import { TGSoft } from "../../tgsoft/tgsoft.js";
import path from "path";
import fs from "fs";
import * as fDatabase from '../database/functions.js';
import Account from "../classes/account.js";

export function toOutput(req, res, fileName, params) {
    let _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', fileName);
    let _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'accounts', fileName);
    if ( fileName === 'error.twig') {
        _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'error', 'error.twig');
        _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'error', 'error.twig');
    }
    if ( fs.existsSync(_altFileName) ) { res.render(_altFileName, {}); }
    else { res.render(_fileName, !params ? {} : params) }
}

export function userList(req, res) {
    fDatabase.getAll(false)
        .catch ( err => {
            TGSoft.log.error('tgsoft:account', err, 'webServer:userList:001');
            toOutput(req, res, 'error.twig', { error: err });
        })
        .then(lstAcc => {
            toOutput(req, res, 'role_list.twig', { lstAccounts : lstAcc })
        })
}

export function userDetails(req, res) {
    try {
        let accountId = req.params.id;
        if ( accountId || accountId > 0 ) {
            fDatabase.getById(accountId)
                .catch ( err => { throw err; })
                .then(acc => {
                    toOutput(req, res, 'roles_details.twig', { account: acc});
                })
        } else {
            toOutput(req, res, 'roles_details.twig', { account: new Account()})
        }
    } catch ( err ) {
        TGSoft.log.error('tgsoft:account', err, 'webServer:userDetails:001');
        toOutput(req, res, 'error.twig', { error: err});
    }
}