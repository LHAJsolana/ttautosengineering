import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const input = "public/logo.png";

async function png(size, output) {
  await sharp(input)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(output);
}

function icoFromPngBuffers(images) {
  const headerSize = 6;
  const directorySize = 16 * images.length;
  const totalHeaderSize = headerSize + directorySize;
  const totalImageSize = images.reduce((sum, image) => sum + image.buffer.length, 0);
  const ico = Buffer.alloc(totalHeaderSize + totalImageSize);

  ico.writeUInt16LE(0, 0);
  ico.writeUInt16LE(1, 2);
  ico.writeUInt16LE(images.length, 4);

  let imageOffset = totalHeaderSize;

  images.forEach((image, index) => {
    const entryOffset = headerSize + index * 16;
    ico.writeUInt8(image.size === 256 ? 0 : image.size, entryOffset);
    ico.writeUInt8(image.size === 256 ? 0 : image.size, entryOffset + 1);
    ico.writeUInt8(0, entryOffset + 2);
    ico.writeUInt8(0, entryOffset + 3);
    ico.writeUInt16LE(1, entryOffset + 4);
    ico.writeUInt16LE(32, entryOffset + 6);
    ico.writeUInt32LE(image.buffer.length, entryOffset + 8);
    ico.writeUInt32LE(imageOffset, entryOffset + 12);
    image.buffer.copy(ico, imageOffset);
    imageOffset += image.buffer.length;
  });

  return ico;
}

const faviconSizes = [16, 32, 48];
const faviconImages = await Promise.all(
  faviconSizes.map(async (size) => ({
    size,
    buffer: await sharp(input)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer(),
  }))
);

await png(16, "public/favicon-16x16.png");
await png(32, "public/favicon-32x32.png");
await png(180, "public/apple-touch-icon.png");
await png(192, "public/android-chrome-192x192.png");
await png(512, "public/android-chrome-512x512.png");
const favicon = icoFromPngBuffers(faviconImages);
await writeFile("public/favicon.ico", favicon);
await writeFile("src/app/favicon.ico", favicon);

const manifest = JSON.parse(await readFile("public/site.webmanifest", "utf8").catch(() => "{}"));
await writeFile(
  "public/site.webmanifest",
  JSON.stringify(
    {
      name: "TT AUTO'S Engineering",
      short_name: "TT AUTO'S",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: "#0B1220",
      background_color: "#0B1220",
      display: "standalone",
      ...manifest,
    },
    null,
    2
  ) + "\n"
);

console.log("Generated favicon and app icons from public/logo.png");
