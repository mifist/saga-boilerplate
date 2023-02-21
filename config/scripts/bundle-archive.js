const path = require('path');
const archiver = require('archiver');
const fs = require('fs');
const fsPromises = require('fs').promises;

const ROOT_PATH = path.resolve(process.cwd());

const envKeys = require(path.resolve(process.cwd(), 'config', 'environment', 'index.js'));
const { BASE_ENV, APP_VERSION } = envKeys;

const BUILD_PATH = path.resolve(`${ROOT_PATH}/build`);


async function generateZipArchive() {
  const archive = archiver("zip");

  // set the destination of the zip archive
  const stream = fs.createWriteStream("build.zip");

  archive.pipe(stream);

  // append files from a sub-directory, putting its contents at the root of archive
  archive.directory("build/", false);

  // finalize the archive (you can't modify it after this)
  archive.finalize();
  
  const releaseType = (BASE_ENV == 'lcoal' || BASE_ENV == 'development') ? 'dev' : (BASE_ENV == 'staging' ? 'demo' : 'prod');
  const destinationPath = path.resolve(`${ROOT_PATH}/releases/${releaseType}/${APP_VERSION}`);

  // wait for the archive to be fully written to the file system
  // listen for all archive data to be written
  // 'close' event is fired only when a file descriptor is involved
  stream.on("close", () => {
    // check if the destination path exists, and create it if it doesn't
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    // move the archive to the destination path
    fs.renameSync("build.zip", `${destinationPath}/build.zip`);

    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    console.log('archiver has been saved in Path: '+destinationPath);
  });

}


fsPromises.access(BUILD_PATH).then(() => {
  generateZipArchive();
}).catch(err => {
  console.error(err)
})
