import { TGSoft } from '../../tgsoft/tgsoft.js';
import * as fDatabase from '../database/functions.js';

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
                        }
                    })
        }
    })
}

