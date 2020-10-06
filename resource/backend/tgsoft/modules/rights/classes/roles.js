import * as fDatabase_RO from '../database/functions_ro.js';
import * as fFunction_RI from '../functions/functions_ri.js';

export default class Roles {
    static moduleName = "TGSoft:Roles";
    id = 0;
    name = '';
    lstRights = [];

    save = fDatabase_RO.save;
    getRights = fFunction_RI.getRightsByRole;

    static getByName = fDatabase_RO.getByName;
    static getById = fDatabase_RO.getById;
}