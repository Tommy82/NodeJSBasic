import { TGSoft } from "../../tgsoft/tgsoft.js";
import { default as Roles } from '../classes/roles.js';

export async function save() {
    return new Promise((resolve, reject) => {
        try {
            TGSoft.database.save('roles',
                {
                    id: this.id,
                    name: this.name,
                    active: this.active
                })
                .catch ( err => { return reject(err); })
                .then(res => { return resolve(res); })
        } catch ( err ) { return reject(err); }
    })
}

export async function getById(roleId) {
    return new Promise((resolve, reject) => {
        try {
            TGSoft.database.findById('roles', [roleId])
                .catch ( err => { return resolve(err); })
                .then(res => { return resolve(convertDBListToClass(res)); })
        } catch ( err )  { return reject(err); }
    })
}

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