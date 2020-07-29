import { default as orm } from 'typeorm';

export const accounts = new orm.EntitySchema({
    name: 'accounts',
    columns: {
        id: { type: 'int', generated: true, primary: true },            // Internal ID
        userName: { type: 'varchar', length: 100, default: '' },        // Login - Username
        password: { type: 'varchar', length: 100, default: '' },        // Hashed Password
        roleType: { type: 'varchar', length: 50, default: 'none'},      // Role Type
        active: { type: 'tinyint', default: 0 }                         // Active State
    }
})

