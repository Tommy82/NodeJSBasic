import * as fDatabase from '../database/functions.js';
import * as fFunctions from '../functions/functions.js';

export default class Account {
    id =  0;
    userName = '';
    password = '';
    hashedPassword = '';
    roleType = '';

    save = fDatabase.save;
    updatePassword = fFunctions.updatePassword;
}


