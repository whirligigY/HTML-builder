const fs = require("fs");
const path = require("path");
let readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const { SIGINT } = require("constants");

const filePath = path.join(__dirname, "text2.txt");

const streamWritable = fs.createWriteStream(filePath, { flags: "a" });

const rl = readline.createInterface({ input, output });

console.log("Hello, my dear friend! Tell me something about you!");
rl.on("SIGINT", () => {
  console.log("Nice to meet you. Bye!");
  rl.close();
});

rl.on("line", (answer) => {
  try {
    if (answer === "exit") {
      console.log("Nice to meet you. Bye!");
      rl.close();
    } else if (answer !== "") {
      console.log("I wrote it down. Is there anything else?");
      streamWritable.write(answer.toString().trim() + "\n");
    } else {
      rl.close();
    }
  } catch (err) {
    console.error(err);
    rl.close();
  }
});
