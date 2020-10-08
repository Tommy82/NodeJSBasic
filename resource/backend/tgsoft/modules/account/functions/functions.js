import { TGSoft } from '../../tgsoft/tgsoft.js';
import * as fDatabase from '../database/functions.js';

/**
 * Update UserPassword
 * @return {Promise<boolean>} true = Password Changed | false = Password not Changed
 */
export async function updatePassword() {
    return new Promise((resolve, reject) => {
        if ( this.password && this.password !== '' ) {
                TGSoft.helper.security.hashPassword(this.password)
                    .catch ( err => { return reject(err); })
                    .then(hash => {
                        if ( hash && hash !== '' ) {
                            this.hashedPassword = hash;
                            fDatabase.updatePartialData(this.id, { password: this.hashedPassword})
                                .catch ( err => { return reject(err); })
                                .then( () => { return resolve(true); })
                        } else { return resolve(false); }
                    })
        } else { return resolve(false); }
    })
}

/**
 * Check if a User allowed to Do Action
 * @param {string} moduleName Name of the Module
 * @param {string} rightName Name of the Right
 * @return {Promise<boolean>} true = User Allowed | false = User not Allowed
 */
export async function checkIfAllowed(moduleName, rightName) {
    return new Promise((resolve, reject) => {
        try {
            if ( this.role && this.role.lstRights.length > 0 ) {
                let tmp = this.role.lstRights.find(x => x.moduleName === moduleName && x.name === rightName );
                if ( tmp && (tmp.allowed === 1 || tmp.allowed === true )) { return resolve(true); }
                else { return resolve(false); }
            } else { return resolve(false); }
        } catch ( err ) { return reject(err); }
    })
}

/**
 * Filter all Rights from specific ModuleName
 * @param {string} moduleName Name of Module
 * @return {Promise<[]>} Array[key] = bool
 */
export async function filterByModuleName(moduleName) {
    return new Promise((resolve, reject) => {
        try {
            let lstAllowed = [];
            if ( this.role && this.role.lstRights.length > 0 ) {
                let tmp = this.role.lstRights.filter(x => x.moduleName === moduleName);
                if ( tmp && tmp.length > 0 ) {
                    tmp.forEach(item => {
                        lstAllowed[item.name] = item.allowed;
                    })
                }
            }
            return resolve(lstAllowed);
        } catch ( err ) { return reject(err); }
    })
}
