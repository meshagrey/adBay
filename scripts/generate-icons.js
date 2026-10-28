import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, r, g, b, isMaskable = false) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type (RGB)
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (1 + width * 3));
  let offset = 0;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = isMaskable ? width * 0.35 : width * 0.42;

  for (let y = 0; y < height; y++) {
    scanlines.writeUInt8(0, offset++); // filter byte: None
    for (let x = 0; x < width; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        // Inner circle with bright green / amber accent
        if (dist > radius - (width * 0.08) && dist <= radius) {
          scanlines.writeUInt8(245, offset++); // Amber border R
          scanlines.writeUInt8(158, offset++); // G
          scanlines.writeUInt8(11, offset++);  // B
        } else {
          scanlines.writeUInt8(255, offset++); // White badge R
          scanlines.writeUInt8(255, offset++); // G
          scanlines.writeUInt8(255, offset++); // B
        }
      } else {
        // Background brand green
        scanlines.writeUInt8(r, offset++);
        scanlines.writeUInt8(g, offset++);
        scanlines.writeUInt8(b, offset++);
      }
    }
  }

  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(8 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf, start, length) {
    let crc = 0xffffffff;
    for (let i = start; i < start + length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  const crcVal = crc32(chunk, 4, 4 + len);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

// Generate PWA icons in /public
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192, 0, 168, 89, false));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512, 0, 168, 89, false));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, 0, 168, 89, true));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180, 0, 168, 89, false));
fs.writeFileSync('./public/favicon.ico', createPNG(32, 32, 0, 168, 89, false));

console.log('PWA icons successfully generated in ./public');
