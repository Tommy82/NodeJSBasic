import { TGSoft } from "../../tgsoft/tgsoft.js";
import path from "path";
import fs from "fs";
import * as fDatabase from '../database/functions.js';

export function toOutput(req, res, fileName, params) {
    let _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', fileName);
    let _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'accounts', fileName);
    if ( fs.existsSync(_altFileName) ) { res.render(_altFileName, {}); }
    else { res.render(_fileName, !params ? {} : params) }
}

export function userList(req, res) {
    fDatabase.getAll(false)
        .catch ( err => {
            TGSoft.log.error('tgsoft:account', err, 'webServer:userList:001');
            toOutput(req, res, 'error.twig');
        })
        .then(lstAcc => {
            toOutput(req, res, 'list.twig', { lstAccounts : lstAcc })
        })
}