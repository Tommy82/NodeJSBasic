import { TGSoft} from "../../tgsoft/tgsoft.js";
import { accounts } from "../database/entities.js";

import { default as Account } from '../classes/account.js';
import * as fDatabase from '../database/functions.js';
import * as fSecurity from '../functions/security.js';
import { settings } from '../../../../../configuration/settings.js';

class AccountInstall {
    constructor() { }

    entities = [ accounts ];

    rights = [
        { key: "changeAll", desc: "Change all Users", defaultRole: "administrator" },
        { key: "changeOwn", desc: "Change only own User", defaultRole: "administrator" },
        { key: "add", desc: "Create a new User", defaultRole: "administrator" },
        { key: "showAll", desc: "Show all Users", defaultRole: "administrator" },
        { key: "showSelf", desc: "Show only own User", defaultRole: "administrator" },
    ];
    moduleName = Account.moduleName;

    async init() {
    }

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
                                .catch(err => { TGSoft.log.error(Account.moduleName, err);  })
                                .then(() => { acc.updatePassword(); })
                        })

        }
    }

    async start() { }
}

TGSoft.addModule(new AccountInstall());

fSecurity.passport_initialize();
