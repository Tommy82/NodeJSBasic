import { TGSoft} from "../../tgsoft/tgsoft.js";
import { default as Account } from '../classes/account.js';

/** Save the current AccountData
 * Attention! Must be a prototype of "Account"
 * @return {Promise<object>} Saved Database-Data
 */
export async function save() {
    return new Promise((resolve, reject) => {
        TGSoft.database.upsert('accounts', {
            id: this.id,
            userName: this.userName,
            roleType: this.roleType,
            active: this.active,
        })
            .catch ( err => { return reject(err); })
            .then(acc => { this.id = acc.id; return resolve(acc); })
    })
}

/** Load Account by ID or ID´s
 * @param {[int]} accountId Internal AccountID
 * @return {Promise<Account>}
 */
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

/** Load one(!) Account by Username
 * @param {string} username Login- / Username of Account
 * @return {Promise<Account>}
 */
export async function getByUsername(username) {
    return new Promise((resolve, reject) => {
        TGSoft.database.findOne('accounts', 'userName', username)
            .catch ( err => { return reject(err); })
            .then ( acc => { return resolve(createClassFromDB(acc)); })
    })
}

/** Update partial Data
 * @param {int} id Internal Account ID
 * @param {Object} data
 * @return {Promise<[Object]>} Updated Data
 */
export async function updatePartialData(id, data) {
    return new Promise((resolve, reject) => {
        TGSoft.database.update('accounts', id, data)
            .catch ( err => { return reject(err); })
            .then( res => { return resolve(res); })
    })
}

/** Load all Active Accounts from Database
 * @param {boolean} toClass false = returns as array of Object | true = returns List of Account
 * @return {Promise<[Account]>} Array of DB Entries or Account
 */
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

/** Load all Accounts from Database
 * @param {boolean} toClass false = returns as array of Object | true = returns List of Account
 * @return {Promise<[Account]>} Array of DB Entries or Account
 */
export async function getAll(toClass = false) {
    return new Promise((resolve, reject) => {
        TGSoft.database.findAll('accounts')
            .then(lstAcc => {
                if ( !toClass ) { return resolve(lstAcc); }
                else { return resolve(createClassListFromDB(lstAcc))}
            })
            .catch(err => { return reject(err); })
    })
}

/** Convert the Database-Record to Account-Class
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
        response.active = record.active ? record.active : false;
    }
    return response;
}

/** Convert the List of Database-Records to List of Array-Classes
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


