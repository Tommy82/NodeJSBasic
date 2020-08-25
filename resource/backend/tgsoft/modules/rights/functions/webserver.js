import {TGSoft} from "../../tgsoft/tgsoft.js";
import * as fDatabase_RO from '../database/functions_ro.js';
import Roles from "../classes/roles.js";

export function get_roles(req, res) {
    fDatabase_RO.getAll(false)
        .catch (err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
        .then( lstRoles => { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'rights'], 'role_list.twig', { lstRoles: lstRoles }); })
}

export function get_roles_details(req, res) {
    if ( req.params.id > 0 ) {
        fDatabase_RO.getById(req.params.id)
            .catch (err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
            .then(role => { console.log(role);
                TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'rights'], 'roles_details.twig', { role: role}); });
    } else { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'rights'], 'roles_details.twig', { role: new Roles()}); }
}