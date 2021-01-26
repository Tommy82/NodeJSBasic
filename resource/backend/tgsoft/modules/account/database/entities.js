import { default as orm } from 'typeorm';

/**
 * Database EntitySchema -> Accounts
 * User Accounts for Backend Users
 */
export const accounts = new orm.EntitySchema({
    name: 'accounts',
    columns: {
        id: { type: 'int', generated: true, primary: true },            // Internal ID
        userName: { type: 'varchar', length: 100, default: '' },        // Login - Username
        password: { type: 'varchar', length: 100, default: '' },        // Hashed Password
        salt: { type: 'varchar', length: 20, default: '' },             // Password Salt
        roleType: { type: 'varchar', length: 50, default: 'none'},      // Role Type
        active: { type: 'tinyint', default: 0 }                         // Active State
    }
})

