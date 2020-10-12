import Rights from "../classes/rights.js";

/**
 * Load all Rights by a Role
 * Attention: This Function must called as a prototype of the Class "Roles"
 * @return {Promise<boolean>} True = Successful | False = Failure
 */
export async function getRightsByRole() {
    return new Promise(async (resolve, reject) => {
        try {
            this.lstRights = await Rights.getAll();                 // Load all Rights
            let rights_self = await Rights.getByRoleId(this.id, false);    // Load all Rights for this Role
            let lstRightsSelf = [];
            // Check Rights and get "defaultRole" to "true"
            this.lstRights.forEach(item => {
                if ( item.defaultRole.toLowerCase() === this.name.toLowerCase() ) {
                    lstRightsSelf.push({ id: item.id, value: true });
                }
            });

            // Set 'rights_self' to role.lstRightsSelf
            if ( rights_self && rights_self.length > 0 ) {
                rights_self.forEach(item => {
                    let tmp = lstRightsSelf.find(x => x.id === item.rightId);
                    if ( tmp && tmp.id > 0 ) { tmp.value = item.allowed; }
                    else { lstRightsSelf.push({ id: item.rightId, value: false}); }
                })
            }

            // set allowed to right
            if ( lstRightsSelf && lstRightsSelf.length > 0 ) {
                lstRightsSelf.forEach(item => {
                    let right = this.lstRights.find(x => x.id === item.id);
                    right.allowed = item.value;
                });
            }
            return resolve(true);
        } catch ( err ) { return reject(err); }
    })
}