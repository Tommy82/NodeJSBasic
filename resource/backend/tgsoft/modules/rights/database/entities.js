import { default as orm } from 'typeorm';

/** Database - Table of Roles */
export const roles = new orm.EntitySchema({
    name: 'roles',
    columns: {
        id: { type: 'int', generated: true, primary: true },
        name: { type: 'varchar', length: 100 },
        active: { type: 'tinyint', default: true }
    }
})

/** Database - Table of Rights */
export const rights = new orm.EntitySchema({
    name: 'rights',
    columns: {
        id: { type: 'int', generated: true, primary: true },
        name: { type: 'varchar', length: 100 },
        active: { type: 'tinyint', default: true },
        moduleName: { type: 'varchar', length: 100 },
        desc: { type: 'varchar', length: 200, default: '' },
        defaultRole: { type: 'varchar', length: 50, default: 'none' },
    }
})

/** Database - Table of RightsRoles | All Rights of a Role */
export const rightsRoles = new orm.EntitySchema({
    name: 'rightsRoles',
    columns: {
        id: { type: 'int', generated: true, primary: true },
        roleId: { type: 'int' },
        rightId: { type: 'int' },
        allowed: { type: 'tinyint'}
    }
})