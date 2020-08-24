import { TGSoft } from "../../tgsoft/tgsoft.js";


export async function getAll() {
    return new Promise((resolve, reject) => {
        TGSoft.database.findAll('rights')
            .catch ( err => { return reject(err); })
            .then(res => { return resolve(res); })
    })
}

export async function getByRoleId(roleId) {
    return new Promise((resolve, reject) => {
        TGSoft.database.find('rightsRoles', { roleId: roleId})
            .catch ( err => { return reject(err); })
            .then(res => { return resolve(res); })
    })
}