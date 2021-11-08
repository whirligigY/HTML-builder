const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "files-copy");

async function createDirectory() {
  const dir_copy = await fs.promises.mkdir(
    filePath,
    { recursive: true },
    (err) => {
      if (err) throw err;
    }
  );
}
createDirectory();

async function copyFileInfo(filePath) {
  fs.promises.readdir(filePath, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        try {
          fs.promises.copyFile(
            path.join(__dirname, "files", file.name),
            path.join(__dirname, "files-copy", file.name)
          );
          console.log(
            `files/${file.name} was copied to files-copy/${file.name}`
          );
        } catch {
          console.log("The file could not be copied");
        }
      }
    });
    fs.promises
      .readdir(path.join(__dirname, "files-copy"))
      .then((filesCopy) => {
        const filesNameArr = files.map((file) => file.name);
        const arrayForDelete = filesCopy.filter(
          (el) => !filesNameArr.includes(el)
        );
        arrayForDelete.forEach((el) => {
          try {
            fs.promises.unlink(path.join(__dirname, "files-copy", el));
          } catch (e) {
            throw err;
          }
        });
      });
  });
}
copyFileInfo(path.join(__dirname, "files"));
