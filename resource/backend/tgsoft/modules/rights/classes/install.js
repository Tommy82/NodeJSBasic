import { TGSoft} from "../../tgsoft/tgsoft.js";
import { rights, roles, rightsRoles } from "../database/entities.js";

class RightInstall {
    constructor() { }

    entities = [ rights, rightsRoles, roles ];

    async init() { }

    async install() { }

    async start() { }
}

TGSoft.addModule(new RightInstall());
