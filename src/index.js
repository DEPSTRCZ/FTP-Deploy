
import { info, setFailed, getInput } from '@actions/core';
import github from '@actions/github';
import ftpDeployer from "ftp-deploy";

const DeployFiles = new FtpDeployer();

info('Deploying...');


try {
    let Deployment = await DeployFiles.deploy({
        sftp: JSON.parse(getInput('sftp')) || false,
        host: getInput('host', { required: true }),
        port: JSON.parse(getInput('port')) || 21,
        user: getInput('username', { required: true }),
        password: getInput('password', { required: true }),
        remoteRoot: getInput('remote_folder') || './',
        localRoot: getInput('local_folder') || 'dist', // __dirname + '/local-folder',
        deleteRemote: JSON.parse(getInput('cleanup')) || false, // If true, delete ALL existing files at destination before uploading
        include: JSON.parse(getInput('include')) || ['*', '**/*'], // this would upload everything except dot files
        exclude: JSON.parse(getInput('exclude')) || ['node_modules/**', 'node_modules/**/.*', '.git/**'], // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
        forcePasv: JSON.parse(getInput('passive')) || true // Passive mode is forced (EPSV command is not sent)
    })
} catch (error) {
    setFailed(error.message);
}
console.log("bef")


deploy.on("uploading", function (data) {
    console.log(data.totalFilesCount); // total file count being transferred
    console.log(data.transferredFileCount); // number of files transferred
    console.log(data.filename); // partial path with filename being uploaded
});
ftpDeploy.on("uploaded", function (data) {
    console.log(data); // same data as uploading event
});
ftpDeploy.on("log", function (data) {
    console.log(data); // same data as uploading event
});
ftpDeploy.on("upload-error", function (data) {
    console.log(data.err); // data will also include filename, relativePath, and other goodies
});

console.log("aft")