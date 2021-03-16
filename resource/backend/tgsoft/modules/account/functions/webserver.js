import { TGSoft } from "../../tgsoft/tgsoft.js";
import * as fDatabase from '../database/functions.js';
import Account from "../classes/account.js";
import Roles from "../../rights/classes/roles.js";

/** Load UserList and give to Twig Template
 * @param {object} req WebServer-Request
 * @param {Object} res WebServer-Response
 */
export function userList(req, res) {
    if ( req.user.checkIfAllowed(Account.moduleName, "showAll")) {
        fDatabase.getAll(false)
            .then(lstAcc => {
                TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'list.twig', {lstAccounts: lstAcc});
            })
            .catch(err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', {error: err}); })
    } else {
        TGSoft.webServer.toOutput(req, res, [], 'access_denied.twig', {module: Account.moduleName, right: "showAll" });
    }
}

/** Load Self-Settings - Site
 * @param {object} req WebServer-Request
 * @param {Object} res WebServer-Response
 */
export function siteMe(req, res) {
    try {
        let data = {
            id: req.user.id,
            name: req.user.userName,
            role: req.user.roleType,
            state: 0,
        };
        TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'me.twig', { me: data });
    } catch (err)  { TGSoft.webServer.toOutput(req, res, [], 'error.twig', {error: err}); }
}

/** Speichert die eigenen Daten falls diese geändert wurden
 * @param {object} req WebServer-Request
 * @param {object} res WebServer-Response
 */
export function updateMe(req, res) {
    try {
        let data = {
            id: req.user.id,
            name: req.user.userName,
            role: req.user.roleType,
            state: 1,
        };

        Account.getById(data.id)
            .then(acc => {
                acc.password = req.body['txt_password'];
                acc.updatePassword()
                    .then(() => { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'me.twig', { me: data }); })
                    .catch(err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', {error: err}); })
            })
            .catch(err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', {error: err}); })
    } catch (err)  { TGSoft.webServer.toOutput(req, res, [], 'error.twig', {error: err}); }
}

/** Load UserDetails and give to Twig Template
 * @param {object} req WebServer-Request
 * @param {Object} res WebServer-Response
 */
export function userDetails(req, res) {
    try {
        if ( req.user.checkIfAllowed(Account.moduleName, "changeAll") || ( req.user.checkIfAllowed(Account.moduleName, "changeOwn") && parseInt(req.params.id) === req.user.id )) {
            Roles.getAllActive(false)
                .catch (err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
                .then(roles => {
                    let accountId = req.params.id;
                    if ( accountId || accountId > 0 ) {
                        fDatabase.getById(accountId)
                            .catch (err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
                            .then( acc => { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'details.twig', { account: acc, roles: roles}) })

                    } else { TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'details.twig', { account: new Account(), roles: roles}) }
                })
        } else {
            if ( parseInt(req.params.id) === req.user.id ) {
                TGSoft.webServer.toOutput(req, res, [], 'access_denied.twig', {module: Account.moduleName, right: "changeOwn + changeAll" });
            } else {
                TGSoft.webServer.toOutput(req, res, [], 'access_denied.twig', {module: Account.moduleName, right: "changeAll" });
            }

        }
    } catch ( err ) {
        TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err });
    }
}

/** Save UserDetails and redirect to UserList
 * @param {object} req WebServer-Request
 * @param {object} res WebServer-Response
 */
export function postUserDetails(req, res) {
    if ( req.user.checkIfAllowed(Account.moduleName, "changeAll") || ( req.user.checkIfAllowed(Account.moduleName, "changeOwn") && parseInt(req.params.id) === req.user.id )) {
        if ( req.params.id && req.params.id > 0 ) {
            fDatabase.getById(req.params.id)
                .catch ( () => { })
                .then(acc => { saveUserFromWebPage(req, res, acc); })
        } else { saveUserFromWebPage(req, res, new Account()); }
    } else {
        if ( parseInt(req.params.id) === req.user.id ) {
            TGSoft.webServer.toOutput(req, res, [], 'access_denied.twig', {module: Account.moduleName, right: "changeOwn + changeAll" });
        } else {
            TGSoft.webServer.toOutput(req, res, [], 'access_denied.twig', {module: Account.moduleName, right: "changeAll" });
        }
    }
}

/** Get Parameters from WebServer-Request and Save User
 * @param {object} req WebServer-Request
 * @param {object} res WebServer-Response
 * @param {Account} userAccount Current UserAccount
 */
function saveUserFromWebPage(req, res, userAccount) {
    userAccount.userName = req.body["txt_username"];
    userAccount.roleType = req.body["sel_role"].toLowerCase();
    userAccount.active = !!(req.body["chk_active"] && req.body["chk_active"].toLowerCase() === "on");
    userAccount.save()
        .then(() => {
            if ( req.body['txt_password'] && req.body['txt_password'] !== '' ) {
                userAccount.password = req.body['txt_password'];
                userAccount.updatePassword()
                    .catch(err => { console.log(err); })
                    .then(() => { res.redirect("/backend/users") });
            } else { res.redirect("/backend/users") }
        })
        .catch()

}

