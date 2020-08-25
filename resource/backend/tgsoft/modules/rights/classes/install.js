import { TGSoft} from "../../tgsoft/tgsoft.js";
import { rights, roles, rightsRoles } from "../database/entities.js";
import { default as Roles } from "../classes/roles.js";

class RightInstall {
    constructor() { }

    entities = [ rights ];

    async init() { }

    async install() { }

    async start() { }
}

class RoleInstall {
    constructor() { }

    entities = [ rightsRoles, roles ];

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

TGSoft.addModule(new RightInstall());
TGSoft.addModule(new RoleInstall());
