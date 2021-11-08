const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "text.txt");

const stream = fs.createReadStream(filePath);

stream.pipe(process.stdout);
