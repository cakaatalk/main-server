const fs = require("fs");
const path = require("path");

const dotenv = () => {
  const envPath = path.join(".env");
  return new Promise((resolve, reject) => {
    fs.readFile(envPath, "utf-8", (err, data) => {
      if (err) {
        reject("Error loading env: " + err);
        return;
      }

      data.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
          process.env[key.trim()] = value.trim();
        }
      });

      console.log("env loaded successfully");
      resolve();
    });
  });
};

module.exports = dotenv;
