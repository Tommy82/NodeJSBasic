import { TGSoft} from "../../tgsoft/tgsoft.js";
import { rights, roles, rightsRoles } from "../database/entities.js";
import { default as Roles } from "../classes/roles.js";
import { default as Rights } from "../classes/rights.js";

class RightInstall {
    constructor() { }

    entities = [ rights ];
    rights = [
        { key: "change", desc: "Ändern eines Rechtes", defaultRole: "administrator" }
    ];
    moduleName = Rights.moduleName;

    async init() { }

    async install() { }

    async start() { }
}

class RoleInstall {
    constructor() { }

    entities = [ rightsRoles, roles ];
    rights = [
        { key: "add", desc: "Hinzufügen einer Rolle", defaultRole: "administrator" },
        { key: "change", desc: "Ändern einer Rolle", defaultRole: "administrator" },
        { key: "delete", desc: "Löschen einer Rolle", defaultRole: "administrator" },
        { key: "showAll", desc: "Zeigt alle Rollen an", defaultRole: "administrator" },
    ];
    moduleName = Roles.moduleName;

    async init() {}

    async install() {
        Roles.getByName('Administrator')
            .catch ( err => { console.error(err); })
            .then(res => {
                if (!res || res.length === 0) {
                    let role = new Roles();
                    role.name = 'Administrator';
                    role.save();
                }
            })
   }

    async start() {}
}

TGSoft.addModule(new RoleInstall());
TGSoft.addModule(new RightInstall());
