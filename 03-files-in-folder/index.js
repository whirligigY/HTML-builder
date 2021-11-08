const fs = require("fs");
const path = require("path");

const arrPath = [__dirname, "secret-folder"];
const filePath = path.join(__dirname, "secret-folder");

async function showFileInfo(filePath) {
  fs.promises.readdir(filePath, { withFileTypes: true }).then((files) => {
    files.forEach((file) => {
      if (file.isFile()) {
        fs.promises.stat(path.join(filePath, file.name)).then((data) => {
          console.log(
            ` ${file.name.slice(
              0,
              file.name.indexOf(path.extname(file.name))
            )} - ${path.extname(file.name).slice(1)} - ${data.size}b`
          );
        });
      }

      /*if (file.isDirectory()) {
        arrPath.push(file.name);
        showFileInfo(path.join(filePath, file.name));
      }
      */
    });
  });
}
showFileInfo(filePath);
