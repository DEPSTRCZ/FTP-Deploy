
import { info, setFailed, getInput } from '@actions/core';
import github from '@actions/github';
import FtpDeployer from "ftp-deploy";
import cliProgress from "cli-progress";

const Deployment = new FtpDeployer();

info('Deploying...');

async function generateProgressBar(progress) {
    const completed = Math.round(50 * progress); // Number of completed characters
    const remaining = 50 - completed; // Number of remaining characters
  
    const progressBar = '='.repeat(completed) + '>'.repeat(progress > 0 && progress < 1 ? 1 : 0) + ' '.repeat(remaining); // Generate the progress bar string
    return progressBar;

}
try {
    let progress = 0
    Deployment.deploy({
        sftp: JSON.parse(getInput('sftp')) || false,
        host: getInput('host', { required: true }),
        port: JSON.parse(getInput('port')) || 21,
        user: getInput('username', { required: true }),
        password: getInput('password', { required: true }),
        remoteRoot: getInput('remote_folder') || './',
        localRoot: getInput('local_folder') || 'dist', // __dirname + '/local-folder',
        deleteRemote: JSON.parse(getInput('delete_remote')) || false, // If true, delete ALL existing files at destination before uploading
        include: JSON.parse(getInput('include')) || ['*', '**/*'], // this would upload everything except dot files
        exclude: JSON.parse(getInput('exclude')) || ['node_modules/**', 'node_modules/**/.*', '.git/**'], // e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
        forcePasv: JSON.parse(getInput('passive')) || true // Passive mode is forced (EPSV command is not sent)
    })

    /*Deployment.on("uploading", function (data) {
    //if (bar1.value === 0) bar1.start(data.totalFilesCount, 0);
    bar1.update(data.transferredFileCount);
    });*/
    Deployment.on("uploaded", async function (data) {
        console.log(data.totalFilesCount,data.transferredFileCount,data.filename,progress)
        progress += 1 / data.totalFilesCount
        const progressBar = await generateProgressBar(progress);
        const procentage = Math.round((data.transferredFileCount / data.totalFilesCount) * 100)
        console.log(`File: ${data.filename} [${progressBar}] ${procentage}%`)
        if (data.transferredFileCount === data.totalFilesCount) {
            console.log("S/FTP Upload has been done!")
        }
    });
    Deployment.on("upload-error", function (data) {
        console.log(data.err); // data will also include filename, relativePath, and other goodies
    });
    console.log("xd")
} catch (error) {
    setFailed(error.message);
}
console.log("bef")




console.log("aft")