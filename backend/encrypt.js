const fs = require("fs");
const sharp = require("sharp");

const encrypt = async (inputPath, outputPath, keyPath) => {
  try {
    const imageBuffer = fs.readFileSync(inputPath);
    const image = sharp(imageBuffer);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    const key = [];
    const encrypted = Buffer.alloc(data.length);

    for (let i = 0; i < data.length; i++) {
      const k = Math.floor(Math.random() * 256);
      key.push(k);
      encrypted[i] = data[i] ^ k;
    }

    fs.writeFileSync(keyPath, Buffer.from(key).toString("base64"));

    await sharp(encrypted, {
      raw: {
        width: info.width,
        height: info.height,
        channels: info.channels
      }
    }).png().toFile(outputPath);
  } catch (err) {
    throw new Error("Encryption Failed: " + err.message);
  }
};

module.exports = encrypt;
