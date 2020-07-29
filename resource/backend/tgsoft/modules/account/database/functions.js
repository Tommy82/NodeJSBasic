import { TGSoft} from "../../tgsoft/tgsoft.js";
import { default as Account } from '../classes/account.js';

export async function save() {
    return new Promise((resolve, reject) => {
        TGSoft.database.upsert('accounts', {
            id: this.id,
            userName: this.userName,
            roleType: this.roleType,
        })
            .catch ( err => { return reject(err); })
            .then(acc => { this.id = acc.id; return resolve(acc); })
    })
}

export async function getById(accountId) {
    return new Promise((resolve, reject) => {
        TGSoft.database.findById('accounts', accountId)
            .catch ( err => { return reject(err); })
            .then( lstAcc => {
                if ( lstAcc && lstAcc.length > 0 ) {
                    return resolve(createClassFromDB(lstAcc[0]));
                } else { return resolve(null); }
            })
    })
}

export async function getByUsername(username) {
    return new Promise((resolve, reject) => {
        TGSoft.database.findOne('accounts', 'userName', username)
            .catch ( err => { return reject(err); })
            .then ( acc => { return resolve(createClassFromDB(acc)); })
    })
}

export async function updatePartialData(id, data) {
    return new Promise((resolve, reject) => {
        TGSoft.database.update('accounts', id, data)
            .catch ( err => { return reject(err); })
            .then( res => { return resolve(res); })
    })
}

export async function getAllActive(toClass = false) {
    return new Promise((resolve, reject) => {
        TGSoft.database.find('accounts', { active: true })
            .catch ( err => { return reject(err); })
            .then(lstAcc => {
                if ( !toClass ) { return resolve(lstAcc); }
                else { return resolve(createClassListFromDB(lstAcc)); }
            })
    })
}

export async function getAll(toClass = false) {
    return new Promise((resolve, reject) => {
        TGSoft.database.findAll('accounts')
            .catch(err => { return reject(err); })
            .then(lstAcc => {
                if ( !toClass ) { return resolve(lstAcc); }
                else { return resolve(createClassListFromDB(lstAcc))}
            });
    })
}

/**
 * Convert the Database-Record to Account-Class
 * @param {object} record DB:accounts
 * @return {Account}
 */
function createClassFromDB(record) {
    let response = new Account();
    if ( record ) {
        response.id = record.id ? record.id : 0;
        response.userName = record.userName ? record.userName : '';
        response.hashedPassword = record.password ? record.password : '';
        response.roleType = record.roleType ? record.roleType : 'none';
    }
    return response;
}

/**
 * Convert the List of Database-Records to List of Array-Classes
 * @param {[Account]} lstRecords
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


