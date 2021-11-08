const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "styles");
const bundlePath = path.join(__dirname, "project-dist", "bundle.css");

function createStreamReadable(file) {
  return fs.createReadStream(path.join(__dirname, "styles", file));
}

const streamWriteable = fs.createWriteStream(bundlePath);

async function getFilesForStylesBundle() {
  const filesWithStyles = await fs.promises.readdir(
    filePath,
    { withFileTypes: true },
    (err) => {
      if (err) throw err;
    }
  );
  await filesWithStyles.forEach((file) => {
    if (file.isFile() && path.extname(file.name).slice(1) === "css") {
      try {
        createStreamReadable(file.name).pipe(streamWriteable);
        //streamWriteable.end()
      } catch (e) {
        console.log(e);
      }
    }
  });
}

getFilesForStylesBundle();
