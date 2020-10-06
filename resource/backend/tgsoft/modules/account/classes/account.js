import * as fDatabase from '../database/functions.js';
import * as fFunctions from '../functions/functions.js';

/** AccountClass */
export default class Account {
    id =  0;
    userName = '';
    password = '';
    hashedPassword = '';
    roleType = '';

    save = fDatabase.save;
    updatePassword = fFunctions.updatePassword;

    static getById = fDatabase.getById;
    static getByUsername = fDatabase.getByUsername;
    static getAll = fDatabase.getAll;
    static getAllActive = fDatabase.getAllActive;
}


