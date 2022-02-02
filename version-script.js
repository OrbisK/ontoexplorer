const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function getGitVersion() {
  const {stdout, stderr} = await exec('git describe --long');
  if(stderr) {
    console.warn("Could not determine build version with Git!");
    return "Build version unknown";
  }
  return stdout.trim();
}

(async () => {
  const version = await getGitVersion();
  const versionJs = `module.exports = "${version.replace('"', '\\"')}"`;
  await fs.promises.writeFile('version.js', versionJs);
})();