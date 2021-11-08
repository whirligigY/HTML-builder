const fs = require("fs");
const path = require("path");
const stream = require("stream");

const filePath = path.join(__dirname, "project-dist");
const filePathForAssets = path.join(__dirname, "project-dist", "assets");

async function createDirectory(filePath) {
  const projectDist = await fs.promises.mkdir(
    filePath,
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
}
createDirectory(filePath);

function getFilePath(fileName) {
  return path.join(__dirname, "project-dist", fileName);
}
const streamReadable = fs.createReadStream(
  path.join(__dirname, "template.html")
);
function getReadableStream(components, file) {
  return fs.createReadStream(path.join(__dirname, components, file));
}

const streamWriteable = fs.createWriteStream(
  path.join(__dirname, "project-dist", "index.html")
);
//streamWriteable.write("");
const bundlePath = path.join(__dirname, "project-dist", "style.css");
const streamStylesWriteable = fs.createWriteStream(bundlePath);

async function getFilesFromDirectory(filePath, extens) {
  const filesWithStyles = await fs.promises.readdir(filePath, {
    withFileTypes: true,
  });

  fs.readFile(path.join(__dirname, "template.html"), "utf-8", (err, result) => {
    if (err) throw err;
    str = result.toString();

    filesWithStyles.forEach((file, _, arr) => {
      if (file.isFile() && path.extname(file.name).slice(1) === extens) {
        try {
          if (extens === "html") {
            getReadableStream("components", file.name).on("data", (data) => {
              str = str.replace(
                `{{${file.name.slice(0, file.name.indexOf("."))}}}`,
                data.toString()
              );
              if (!str.includes("{{")) {
                streamWriteable.write(str);
              }
            });
          }
          if (extens === "css") {
            fs.createReadStream(path.join(__dirname, "styles", file.name)).pipe(
              streamStylesWriteable
            );
          }
        } catch (e) {
          console.log(e);
        }
      }
    });
  });
}
getFilesFromDirectory(path.join(__dirname, "styles"), "css");
getFilesFromDirectory(path.join(__dirname, "components"), "html");

async function copyFileInfo(pathToFile) {
  fs.promises
    .readdir(path.join(__dirname, ...pathToFile), { withFileTypes: true })
    .then((files) => {
      files.forEach((file) => {
        if (file.isFile()) {
          try {
            fs.promises.copyFile(
              path.join(__dirname, ...pathToFile, file.name),
              path.join(__dirname, "project-dist", ...pathToFile, file.name)
            );
          } catch {
            console.log("The file could not be copied");
          }
        }
        if (file.isDirectory()) {
          try {
            fs.access(
              path.join(__dirname, "project-dist", ...pathToFile, file.name),
              (err) => {
                if (err && err.code === "ENOENT") {
                  createDirectory(
                    path.join(
                      __dirname,
                      "project-dist",
                      ...pathToFile,
                      file.name
                    )
                  );
                } else {
                }
              }
            );

            copyFileInfo([...pathToFile, file.name]);
          } catch {
            console.log("The dist could not be copied");
          }
        }
      });
    });
}
fs.rmdir(
  path.join(__dirname, "project-dist", "assets"),
  { recursive: true },
  async (err) => {
    if (err) throw err;
    await createDirectory(filePathForAssets);
    copyFileInfo(["assets"]);
  }
);
