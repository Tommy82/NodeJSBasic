import * as fDatabase_RO from '../database/functions_ro.js';

export default class Roles {
    id = 0;
    name = '';
    lstRights = [];

    save = fDatabase_RO.save;

    static getByName = fDatabase_RO.getByName;


}