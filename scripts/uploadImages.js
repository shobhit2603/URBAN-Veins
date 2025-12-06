import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const directory = path.join(process.cwd(), "public/images");

const files = fs.readdirSync(directory).filter(file =>
  /\.(png|jpg|jpeg|webp)$/i.test(file)
);

async function uploadSafe() {
  const output = [];

  console.log(`\n📤 Starting upload (${files.length} files)...\n`);

  for (const file of files) {
    try {
      const res = await cloudinary.uploader.upload(
        path.join(directory, file),
        {
          folder: "urban-veins-products",
          public_id: file.replace(/\..*/, ""),
        }
      );

      console.log(`✔ UPLOADED: ${file}`);
      output.push({ id: file.replace(/\..*/, ""), url: res.secure_url });

    } catch (err) {
      console.log(`❌ FAILED: ${file} ----> ${err.message}`);
      output.push({ id: file.replace(/\..*/, ""), url: null, failed: true });
    }
  }

  fs.writeFileSync("cloud-product-urls.json", JSON.stringify(output, null, 2));
  console.log(`\n📄 Saved → cloud-product-urls.json`);
  console.log(`🎉 Upload completed (with skips logged)\n`);
}

uploadSafe();
