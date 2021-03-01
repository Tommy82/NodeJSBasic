import fs from 'fs';
import path from 'path';
import { TGSoft } from './modules/tgsoft/tgsoft.js'
import * as fSecurity from './modules/account/functions/security.js';

/**
 * Importieren einer bestimmten Datei
 * @param {string} fileName 
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

/**
 * Laden aller Unterverzeichnisse aus dem angegebenem Verzeichnis
 * @param {string} directory Verzeichnisname
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

/** EventListener: Datenbank ist Verbunden */
TGSoft.events.on('core:database:connected', async () => {
    await TGSoft.install();
    await TGSoft.start();
    console.log('[TGSoft] - Ready to use, enjoy it!')
});

/** Initialize Passport Manager to authenticate Users in Frontend and Backend **/
fSecurity.passport_initialize();


// Startfunktion
loadDirectories('./resource/backend')       // Lade alle Unterverzeichnisse und binde diese ein
    .then(() => { TGSoft.init(); })         // Initialisiere alle Module
    .catch(err => { console.error(err); })  // Falls Fehler, beende

    