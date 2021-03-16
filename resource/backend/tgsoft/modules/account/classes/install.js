import { TGSoft} from "../../tgsoft/tgsoft.js";
import { accounts } from "../database/entities.js";

import { default as Account } from '../classes/account.js';
import * as fDatabase from '../database/functions.js';
import { settings } from '../../../../../configuration/settings.js';

/**
 * Install Class of Class "Account"
 * Attention: Only for Install! After Install, this Instance must be cleared
 */
class AccountInstall {
    constructor() { }

    /** Database Entities **/
    entities = [ accounts ];

    /** Needed Rights in this Module **/
    rights = [
        { key: "changeAll", desc: "Change all Users", defaultRole: "administrator" },
        { key: "changeOwn", desc: "Change only own User", defaultRole: "administrator" },
        { key: "add", desc: "Create a new User", defaultRole: "administrator" },
        { key: "showAll", desc: "Show all Users", defaultRole: "administrator" },
        { key: "showSelf", desc: "Show only own User", defaultRole: "administrator" },
    ];

    /** Name of Module **/
    moduleName = Account.moduleName;

    /** Initialize of Install Module. Execute before Database Install !
     * @return {Promise<void>}
     */
    async init() { }

    /** Install this Module
     * @return {Promise<void>}
     */
    async install() {
        if ( settings && settings.user && settings.user.adminAccount && settings.user.adminAccount.install === true ) {
            fDatabase.getByUsername(settings.user.adminAccount.login)
                .catch ( err => { TGSoft.log.error(Account.moduleName, err); })
                .then ( acc => {
                            if ( !acc ) { acc = new Account() }
                            acc.userName = settings.user.adminAccount.login;
                            acc.password = settings.user.adminAccount.pass;
                            acc.roleType = 'administrator';
                            acc.save()
                                .then(() => { acc.updatePassword(); })
                                .catch(err => { TGSoft.log.error(Account.moduleName, err);  })
                        })

        }
    }

    /** Start Module!
     * Attention! Instance of this Module was cleared after start. If start some Parameters, write it in the Main Function as static!
     * @return {Promise<void>}
     */
    async start() { }
}

/** Add this Install Class to Installable Modules **/
TGSoft.addModule(new AccountInstall());

/** Initialize Passport Manager to authenticate Users in Frontend and Backend **/
//fSecurity.passport_initialize();
