import { TGSoft} from "../../tgsoft/tgsoft.js";
import { accounts } from "../database/entities.js";

import { default as Account } from '../classes/account.js';
import * as fDatabase from '../database/functions.js';
import { settings } from '../../../../../configuration/settings.js';

class AccountInstall {
    constructor() { }

    entities = [ accounts ];

    async init() {
    }

    async install() {
        if ( settings && settings.user && settings.user.adminAccount && settings.user.adminAccount.install === true ) {
            fDatabase.getByUsername(settings.user.adminAccount.login)
                .catch ( err => { TGSoft.log.error('TGSoft:account', err); })
                .then ( acc => {
                            if ( !acc ) { acc = new Account() }
                            acc.userName = settings.user.adminAccount.login;
                            acc.password = settings.user.adminAccount.pass;
                            acc.roleType = 'administrator';
                            acc.save()
                                .catch(err => { TGSoft.log.error('TGSoft:account', err);  })
                                .then(() => { acc.updatePassword(); })
                        })

        }
    }
}

TGSoft.addModule(new AccountInstall());