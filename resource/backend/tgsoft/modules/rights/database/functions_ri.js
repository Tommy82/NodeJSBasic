import { TGSoft } from "../../tgsoft/tgsoft.js";
import Rights from "../classes/rights.js";


export async function save() {
    return new Promise((resolve, reject) => {
        try {
        TGSoft.database.upsert('rights', {
            id: this.id,
            name: this.name,
            active: this.active,
            moduleName: this.moduleName,
            defaultRole: this.defaultRole,
            desc: this.desc,
        })
            .catch ( err => { return reject(err); })
            .then(res => { return resolve(res); })
        } catch ( err ) { return reject(err); }
    })
}

export async function getAll(toClass = false) {
    return new Promise((resolve, reject) => {
        TGSoft.database.findAll('rights')
            .catch ( err => { return reject(err); })
            .then(res => {
                if ( toClass === true ) { return resolve(createClassListFromDB(res))}
                else { return resolve(res); }
            })
    })
}

export async function getByRoleId(roleId, toClass = true) {
    return new Promise((resolve, reject) => {
        TGSoft.database.find('rights_roles', { roleId: roleId})
            .catch ( err => { return reject(err); })
            .then(res => {
                if ( toClass === true && res && res.length > 0 ) { return resolve(createClassFromDB(res[0])) }
                else { return resolve(res); }
            })
    })
}

/**
 * Convert the Database-Record to Account-Class
 * @param {object} record DB:rights
 * @return {Rights}
 */
function createClassFromDB(record) {
    let response = new Rights();
    if ( record ) {
        response.id = record.id ? record.id : 0;
        response.name = record.name ? record.name : '';
        response.active = record.active ? record.active : false;
        response.moduleName = record.moduleName ? record.moduleName : '';
        response.defaultRole = record.defaultRole ? record.defaultRole : '';
        response.desc = record.desc ? record.desc : '';
    }
    return response;
}

/**
 * Convert the List of Database-Records to List of Array-Classes
 * @param {[Rights]} lstRecords
 * @return {null|[]}
 */
function createClassListFromDB(lstRecords) {
    if ( lstRecords === null ) { return null }
    else {
        let response = [];
        lstRecords.forEach(item => {  response.push(createClassFromDB(item)) });
        return response;
    }
}