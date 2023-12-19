import fs from "fs";

fs.rmSync("./docs", { recursive: true, force: true });
console.log("docs folder removed");

fs.cpSync("./dist", "../docs", { recursive: true, force: true });
console.log("dist folder copied to docs");
