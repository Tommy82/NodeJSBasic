import {TGSoft} from "../../tgsoft/tgsoft.js";
import * as fDatabase_RO from '../database/functions_ro.js';
import Roles from "../classes/roles.js";
import Rights from "../classes/rights.js";

/**
 * WebServer - Roles List - GET
 * @param {object} req WebServer-Request
 * @param {object} res WebServer-Response
 */
export function get_roles(req, res) {
    fDatabase_RO.getAll(false)
        .catch (err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
        .then( lstRoles => { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'rights'], 'role_list.twig', { lstRoles: lstRoles }); })
}

/**
 * WebServer - Roles Details - Get
 * @param {object} req WebServer-Request
 * @param {object} res WebServer-Response
 * @return {Promise<void>}
 */
export async function get_roles_details(req, res) {
    if ( req.params.id > 0 ) {
        fDatabase_RO.getById(req.params.id)
            .catch (err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
            .then(async role => {
                role.getRights()
                    .catch(err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
                    .then(() => { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'rights'], 'roles_details.twig', {role: role}); });
            })
    } else { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'rights'], 'roles_details.twig', { role: new Roles()}); }
}

/**
 * WebServer - Roles Details - Post
 * @param {object} req WebServer-Request
 * @param {object} res WebServer-Response
 * @return {Promise<void>}
 */
export async function post_roles_details(req, res) {

    let lstRights = await Rights.getAll();
    if ( req.params.id && req.params.id > 0 ) {

        let currRole = await Roles.getById(req.params.id);

        if ( lstRights && lstRights.length > 0 ) {
            lstRights.forEach(item => {
                let tmp = req.body[`right_${item.id}`];
                item.allowed = !!(tmp && tmp === 'on'); // if ( right == 'on' ) -> set allowed = true else false
            });
        }

        currRole.lstRights = lstRights;
        await currRole.save()
    }
    get_roles_details(req, res).catch();
}