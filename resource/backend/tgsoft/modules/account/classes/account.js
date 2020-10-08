import * as fDatabase from '../database/functions.js';
import * as fFunctions from '../functions/functions.js';

/** AccountClass */
export default class Account {

    static moduleName = "TGSoft_Account"

    /** Internal ID **/
    id =  0;
    /** Username to Login **/
    userName = '';
    /** Password to Login **/
    password = '';
    /** HashedPassword, saved in Database **/
    hashedPassword = '';
    /** RoleType for Right Control **/
    roleType = '';
    /** Status **/
    active = true;
    /** UserRole, that includes the UserRights **/
    role = undefined;
    /** UserRoles as Array / myRole[moduleName][rightName] : [0/1] **/
    myRole = undefined;

    save = fDatabase.save;
    updatePassword = fFunctions.updatePassword;
    checkIfAllowed = fFunctions.checkIfAllowed;
    filterByModuleName = fFunctions.filterByModuleName;

    static getById = fDatabase.getById;
    static getByUsername = fDatabase.getByUsername;
    static getAll = fDatabase.getAll;
}


