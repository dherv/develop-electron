const { exec } = require("child_process");

const visualStudioOpen = (path) => {
  const command = `code -n ${path}/`;
  console.log(command);
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

module.exports = {
  visualStudioOpen,
};
