
import { info, setFailed, getInput, warning,  } from '@actions/core';
import FtpDeployer from "ftp-deploy";



info('\x1b[33mDeploying...');
async function generateProgressBar(progress) {
    const completed = Math.round(50 * progress); 
    const remaining = 50 - completed; 
    const progressBar = '='.repeat(completed) + '>'.repeat(progress > 0 && progress < 1 ? 1 : 0) + ' '.repeat(remaining);
    return progressBar;
}

const Deployment = new FtpDeployer();
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
}).catch((err) => {
    setFailed(`S/FTP file deployment failed!\n\x1b[31m${err.message}\x1b[0m`);
});

Deployment.on("uploaded", async function (data) {
    progress += 1 / data.totalFilesCount
    const progressBar = await generateProgressBar(progress);
    const procentage = Math.round((data.transferredFileCount / data.totalFilesCount) * 100)

    info(`File: ${data.filename} \n\x1b[34m[${progressBar}] ${procentage}%\x1b[0m`)

    if (data.transferredFileCount === data.totalFilesCount) {
        info("\x1b[32mS/\n\nFTP file deployment completed!\x1b[0m")
    }
});

Deployment.on("upload-error", function (data) {
    setFailed("There has been an error while uploading! \nFile: ${data.filename}\nError: ${data.err}")
});