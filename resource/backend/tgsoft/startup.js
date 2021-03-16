import fs from 'fs';
import path from 'path';
import { TGSoft } from './modules/tgsoft/tgsoft.js'
import * as fSecurity from './modules/account/functions/security.js';

/** Import specific File
 * @param {string} fileName Filename that should be imported
 */
async function loadFiles(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            let newFilename = '.\\' + fileName;
            //let newFilename = fileName;
            newFilename = newFilename.replace(/\\/g, "/");
            if ( newFilename.includes('.js')) {
                newFilename = '../../../' + newFilename; // 3 ways back, because file is in '/resource/backend/tgsoft'
                await import(newFilename).catch(err => { throw err;})
            }
            return resolve(true);
        } catch ( err ) { return reject(err); }
    })
}

/** Load all lower Directories of Directory
 * @param {string} directory Directory
 */
async function loadDirectories(directory) {
    return new Promise(async (resolve, reject) => {
        try {
            const files = fs.readdirSync(directory);
            if ( files ) {
                for ( let i = 0; i < files.length; i++ ) {
                    if ( !files[i].includes('configuration') ) {
                        let myPath = path.join(directory, files[i]);
                        if ( fs.lstatSync(myPath).isDirectory()) { await loadDirectories(myPath) }
                        if ( fs.lstatSync(myPath).isFile()) { await loadFiles(myPath).catch(err => { throw err;}) }
                    }
                }
            }
            return resolve(true);
        } catch ( err ) { return reject(err); }
    })
}

/** EventListener: throws when Database is connected */
TGSoft.events.on('core:database:connected', async () => {
    await TGSoft.install(); // Install Modules
    await TGSoft.start();   // Start Modules
    console.log('[TGSoft] - Ready to use, enjoy it!')
});

/** Initialize Passport Manager to authenticate Users in Frontend and Backend **/
fSecurity.passport_initialize();


// Startfunktion
loadDirectories('./resource/backend')       // Load all Lower Directories
    .then(() => { TGSoft.init(); })         // Iitialize Modules
    .catch(err => { console.error(err); })  // If any Error, throw it

    