import fs from "fs";
import path from "path";
import Jimp from "jimp";

// filterImageFromURL
export async function filterImageFromURL(inputURL) {
  try {
    console.log("DEBUG: fetching image:", inputURL);

    // Fetch image manually (Node 18+ has fetch built-in)
    const response = await fetch(inputURL);

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Read image from buffer (THIS is the fix)
    const photo = await Jimp.read(imageBuffer);

    const outpath = path.join(
      process.cwd(),
      "tmp",
      `filtered.${Math.floor(Math.random() * 2000)}.jpg`
    );

    fs.mkdirSync(path.dirname(outpath), { recursive: true });

    await photo
      .resize(256, 256)
      .quality(60)
      .greyscale()
      .writeAsync(outpath);

    console.log("DEBUG: image saved to:", outpath);

    return outpath;
  } catch (err) {
    console.error("DEBUG: filterImageFromURL failed:");
    console.error(err);
    throw err;
  }
}

// deleteLocalFiles
export function deleteLocalFiles(files) {
  for (const file of files) {
    try {
      fs.unlinkSync(file);
    } catch (err) {
      console.error("DEBUG: failed to delete file:", file);
    }
  }
}
