import * as fDatabase_RO from '../database/functions_ro.js';
import * as fDatabase_RI from '../database/functions_ri.js';

export default class Roles {
    id = 0;
    name = '';
    lstRights = [];

    getRights = fDatabase_RI.getByRoleId;
    getAll = fDatabase_RI.getAll;

}