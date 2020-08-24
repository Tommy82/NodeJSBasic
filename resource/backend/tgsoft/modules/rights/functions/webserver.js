import path from "path";
import {TGSoft} from "../../tgsoft/tgsoft.js";
import fs from "fs";
import * as fDatabase_RO from '../database/functions_ro.js';
import Roles from "../classes/roles";

export function toOutput(req, res, fileName, params) {
    let _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', fileName);
    let _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'accounts', fileName);
    if ( fileName === 'error.twig') {
        _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'error', 'error.twig');
        _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'error', 'error.twig');
    }
    console.log(_fileName);
    TGSoft.webServer.toOutput(req, res, fileName, ['tgsoft', 'modules', 'account'], params);
    if ( fs.existsSync(_altFileName) ) { res.render(_altFileName, {}); }
    else { res.render(_fileName, !params ? {} : params) }
}

export function get_roles(req, res) {
    fDatabase_RO.getAll(false)
        .catch (err => { toOutput(req, res, 'error.twig', { error: err}); })
        .then( lstRoles => { toOutput(req, res, 'list.twig', { lstRoles: lstRoles}); })
}

export function get_roles_details(req, res) {
    if ( req.params.id > 0 ) {
        fDatabase_RO.getById(req.params.id)
            .catch (err => { toOutput(req, res, 'error.twig', { error:err }); })
            .then(role => { toOutput(req, res, 'details.twig', { role: role }); });
    } else { toOutput(req, res, 'details.twig', { role: new Roles()}); }
}