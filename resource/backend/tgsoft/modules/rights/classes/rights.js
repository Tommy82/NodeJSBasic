import * as fDatabase_RI from '../database/functions_ri.js';

export default class Rights {
    static moduleName = "TGSoft_Rights";
    id = 0;
    name = '';
    active = false;
    moduleName = '';
    desc = '';
    defaultRole = '';

    save = fDatabase_RI.save;

    static getAll = fDatabase_RI.getAll;
    static getByRoleId = fDatabase_RI.getByRoleId;

}