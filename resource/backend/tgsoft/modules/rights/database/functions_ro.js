import { TGSoft } from "../../tgsoft/tgsoft.js";
import { default as Roles } from '../classes/roles.js';

/**
 * Save a specific Role
 * Attention: Must be called as prototype of Class "Roles"
 * @return {Promise<object>}
 */
export async function save() {
    return new Promise((resolve, reject) => {
        try {
            TGSoft.database.upsert('roles',
                {
                    id: this.id,
                    name: this.name,
                    active: this.active
                })
                .catch ( err => { return reject(err); })
                .then(async res => {
                    if ( res && res.id > 0 ) {
                        await TGSoft.database.delete('rights_roles', { 'roleId': res.id });
                        if ( this.lstRights && this.lstRights.length > 0 ) {
                            await TGSoft.helper.lists.asyncForEach(this.lstRights, async (right) => {
                                await TGSoft.database.upsert('rights_roles', { roleId: res.id, rightId: right.id, allowed: right.allowed });
                            });
                        }
                    }
                    return resolve(res);
                })
        } catch ( err ) { return reject(err); }
    })
}

/**
 * Load Role by ID from Database
 * @param {int} roleId RoleID
 * @return {Promise<Roles>}
 */
export async function getById(roleId) {
    return new Promise((resolve, reject) => {
        try {
            TGSoft.database.findById('roles', [roleId])
                .catch ( err => { return resolve(err); })
                .then(res => {
                    if ( res && res.length > 0 ) { return resolve(convertDBToClass(res[0])) }
                    else { return resolve(new Roles()); }
                })
        } catch ( err )  { return reject(err); }
    })
}

/**
 * Get a List of Roles by Name
 * @param {string} roleName 'Complete' Name of Role
 * @return {Promise<[object]>}
 */
export async function getByName(roleName) {
    return new Promise((resolve, reject) => {
        try {
            TGSoft.database.find('roles', {name: roleName})
                .catch(err => {
                    return reject(err);
                })
                .then(res => {
                    return resolve(convertDBListToClass(res));
                })
        } catch (err) {
            return reject(err);
        }
    })
}

/**
 * Get All Roles from Database
 * @param {boolean} toClass true = Return DB-Entry as a Instance of Class "Roles" | false = Returns only DB-Entries as Array | Default: true
 * @return {Promise<[object | Roles]>}
 */
export async function getAll(toClass = true) {
    return new Promise((resolve, reject) => {
        try {
            TGSoft.database.findAll('roles')
                .catch ( err => { return reject(err); })
                .then(res => {
                    if ( toClass === true ) { return resolve(convertDBListToClass(res)); }
                    else { return resolve(res); }
                })
        } catch ( err ) {
            return reject(err);
        }
    })
}

/**
 * Get All Active Roles from Database
 * @param {boolean} toClass true = Return DB-Entry as a Instance of Class "Roles" | false = Returns only DB-Entries as Array | Default: true
 * @return {Promise<[object | Roles]>}
 */
export async function getAllActive(toClass = true) {
    return new Promise((resolve, reject) => {
        try {
            TGSoft.database.find('roles', { active: true })
                .catch ( err => { return reject(err); })
                .then(res => {
                    if ( toClass === true ) { return resolve(convertDBListToClass(res)); }
                    else { return resolve(res); }
                })

        } catch ( err ) { return resolve(err); }
    })
}

/**
 * Convert a DB Entry to the Role Class
 * @param {object} item DB Entry
 * @return {Roles} Single Item of Class
 */
function convertDBToClass(item) {
    let curr = new Roles();
    if ( item && item.id > 0 ) {
        curr.id = item.id;
        curr.name = item.name;
        curr.active = item.active;
    }
    return curr;
}

/**
 * Convert a list of DB Entries to a List of Role Classes
 * @param {array} lstItem List of DB Entries
 * @return {[array]} List of Class Items
 */
function convertDBListToClass(lstItem) {
    let response = [];

    if ( lstItem && lstItem.length > 0 ) {
        lstItem.map(item => {
            let curr = convertDBToClass(item);
            if ( curr.id > 0 ) { response.push(curr); }
        })
    }

    return response;
}