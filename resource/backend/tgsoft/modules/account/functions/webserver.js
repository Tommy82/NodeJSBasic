import { TGSoft } from "../../tgsoft/tgsoft.js";
import * as fDatabase from '../database/functions.js';
import Account from "../classes/account.js";

/**
 * Load UserList and give to Twig Template
 * @param {object} req WebServer-Request
 * @param {Object} res WebServer-Response
 */
export function userList(req, res) {
    fDatabase.getAll(false)
        .catch ( err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', {error: err}); })
        .then(lstAcc => { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'list.twig', {lstAccounts : lstAcc }); })
}

/**
 * Load UserDetails and give to Twig Template
 * @param {object} req WebServer-Request
 * @param {Object} res WebServer-Response
 */
export function userDetails(req, res) {
    try {
        let accountId = req.params.id;
        if ( accountId || accountId > 0 ) {
            fDatabase.getById(accountId)
                .catch (err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
                .then( acc => { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'details.twig', { account: acc}) })

        } else { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'details.twig', { account: new Account()}) }
    } catch ( err ) {
        TGSoft.log.error(Account.moduleName, err, 'webServer:userDetails:001');
        TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err });
    }
}