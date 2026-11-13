/**
 * Utility to inject standard EXIF metadata (DateTimeOriginal, DateTimeDigitized, DateTime)
 * into JPEG ArrayBuffers so that Google Photos, Apple Photos, and OS viewers
 * recognize the exact original date the photo was captured.
 */

export function formatExifDate(dateStr: string): string {
  // Normalize date string (e.g. "2024-05-14" -> "2024:05:14 12:00:00")
  let cleanDate = dateStr;
  const match = dateStr.match(/(\d{4})[-/.](\d{2})[-/.](\d{2})/);
  if (match) {
    cleanDate = `${match[1]}:${match[2]}:${match[3]} 12:00:00`;
  } else {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    cleanDate = `${y}:${m}:${d} 12:00:00`;
  }
  return cleanDate;
}

/**
 * Creates an APP1 EXIF segment (98 bytes) containing DateTimeOriginal, DateTimeDigitized, and DateTime.
 */
export function createExifApp1Segment(dateStr: string): Uint8Array {
  const exifDate = formatExifDate(dateStr); // 19 chars: "YYYY:MM:DD HH:MM:SS"
  const dateBytes = new TextEncoder().encode(exifDate + '\0'); // 20 bytes with null terminator

  // TIFF Payload (88 bytes)
  const tiff = new Uint8Array(88);
  const view = new DataView(tiff.buffer);

  // 1. TIFF Header (Little Endian "II")
  view.setUint16(0, 0x4949, true); // "II"
  view.setUint16(2, 0x002a, true); // 42
  view.setUint32(4, 8, true);      // Offset to IFD0 = 8

  // 2. IFD0 (starts at offset 8, 2 entries = 30 bytes)
  view.setUint16(8, 2, true);      // 2 directory entries

  // Entry 1: Tag 0x0132 (DateTime), Type 2 (ASCII), Count 20, Offset = 68
  view.setUint16(10, 0x0132, true);
  view.setUint16(12, 2, true);
  view.setUint32(14, 20, true);
  view.setUint32(18, 68, true);

  // Entry 2: Tag 0x8769 (ExifOffset), Type 4 (LONG), Count 1, Value = 38
  view.setUint16(22, 0x8769, true);
  view.setUint16(24, 4, true);
  view.setUint32(26, 1, true);
  view.setUint32(30, 38, true);

  // Next IFD offset: 0
  view.setUint32(34, 0, true);

  // 3. Exif SubIFD (starts at offset 38, 2 entries = 30 bytes)
  view.setUint16(38, 2, true);

  // Entry 1: Tag 0x9003 (DateTimeOriginal), Type 2 (ASCII), Count 20, Offset = 68
  view.setUint16(40, 0x9003, true);
  view.setUint16(42, 2, true);
  view.setUint32(44, 20, true);
  view.setUint32(48, 68, true);

  // Entry 2: Tag 0x9004 (DateTimeDigitized), Type 2 (ASCII), Count 20, Offset = 68
  view.setUint16(52, 0x9004, true);
  view.setUint16(54, 2, true);
  view.setUint32(56, 20, true);
  view.setUint32(60, 68, true);

  // Next IFD offset: 0
  view.setUint32(64, 0, true);

  // 4. Value Data: Date string (starts at offset 68, 20 bytes)
  tiff.set(dateBytes, 68);

  // Construct complete APP1 Segment:
  // Marker: 0xFF, 0xE1 (2 bytes)
  // Length: 2 + 6 (Exif\0\0) + 88 (TIFF) = 96 bytes (0x0060, Big Endian)
  // "Exif\0\0" (6 bytes)
  // TIFF Payload (88 bytes)
  const app1 = new Uint8Array(2 + 96);
  app1[0] = 0xff;
  app1[1] = 0xe1;
  app1[2] = (96 >> 8) & 0xff;
  app1[3] = 96 & 0xff;

  const exifHeader = new Uint8Array([0x45, 0x78, 0x69, 0x66, 0x00, 0x00]); // "Exif\0\0"
  app1.set(exifHeader, 4);
  app1.set(tiff, 10);

  return app1;
}

/**
 * Injects or replaces the APP1 EXIF segment into a JPEG ArrayBuffer.
 * Returns the modified ArrayBuffer.
 */
export function injectExifIntoJpeg(buffer: ArrayBuffer, dateStr: string): ArrayBuffer {
  const bytes = new Uint8Array(buffer);

  // Verify JPEG SOI marker (0xFF, 0xD8)
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return buffer; // Not a JPEG, return untouched
  }

  const app1Segment = createExifApp1Segment(dateStr);

  // Check if an APP1 (0xFF, 0xE1) segment already exists right after SOI or after APP0
  let insertPos = 2; // Default right after SOI (0xFF, 0xD8)
  let skipExistingApp1Length = 0;

  let pos = 2;
  while (pos < bytes.length - 4) {
    if (bytes[pos] === 0xff) {
      const marker = bytes[pos + 1];
      if (marker === 0xd9 || marker === 0xda) {
        // End of image or start of scan, stop search
        break;
      }
      const segmentLen = (bytes[pos + 2] << 8) | bytes[pos + 3];

      if (marker === 0xe1) {
        // Existing APP1 found! Replace it
        insertPos = pos;
        skipExistingApp1Length = segmentLen + 2;
        break;
      } else if (marker === 0xe0) {
        // APP0 (JFIF) found, place APP1 right after APP0
        insertPos = pos + segmentLen + 2;
      }
      pos += segmentLen + 2;
    } else {
      break;
    }
  }

  // Build the new buffer with our APP1 inserted
  const before = bytes.slice(0, insertPos);
  const after = bytes.slice(insertPos + skipExistingApp1Length);

  const combined = new Uint8Array(before.length + app1Segment.length + after.length);
  combined.set(before, 0);
  combined.set(app1Segment, before.length);
  combined.set(after, before.length + app1Segment.length);

  return combined.buffer;
}
