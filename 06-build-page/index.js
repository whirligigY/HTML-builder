const fs = require("fs");
const path = require("path");
const stream = require("stream");

async function createDirectory(filePath) {
  await fs.promises.mkdir(filePath, { recursive: true });
}

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
async function insertTemplates(file, templateFiles) {
  let outputContent = await fs.promises.readFile(file);
  outputContent = outputContent.toString();
  templateFiles.forEach((template) => {
    outputContent = outputContent.replace(
      `{{${path.parse(template.filename).name}}}`,
      template.content
    );
  });
  return outputContent;
}

async function createBundle(dir, file, template) {
  const files = await fs.promises.readdir(dir, {
    withFileTypes: true,
  });
  const templates = files.map((file) => {
    if (file.isFile()) {
      return fs.promises.readFile(path.join(dir, file.name));
    }
  });
  const contents = await Promise.all(templates); //.filter((item) => item);
  let outputContent;
  if (template) {
    const templateFiles = contents.reduce((acc, item, index) => {
      acc.push({
        filename: files[index].name,
        content: item.toString(),
      });
      return acc;
    }, []);
    outputContent = await insertTemplates(template, templateFiles);
  } else {
    outputContent = contents.reduce((acc, item) => {
      return acc + item.toString();
    }, "");
  }
  fs.promises.writeFile(file, outputContent);
}

//createBundle("components", "index.htnl", "template.html");

const filePath = path.join(__dirname, "project-dist");
const filePathForAssets = path.join(__dirname, "project-dist", "assets");

fs.rmdir(filePath, { recursive: true }, async (err) => {
  // if (err) throw err;
  try {
    await createDirectory(filePath);
    await createDirectory(filePathForAssets);
    createBundle(
      path.join(__dirname, "components"),
      path.join(__dirname, "project-dist", "index.html"),
      path.join(__dirname, "template.html")
    );
    createBundle(
      path.join(__dirname, "styles"),
      path.join(__dirname, "project-dist", "style.css")
    );
    copyFileInfo(["assets"]);
  } catch (e) {
    console.log(e);
  }
});
