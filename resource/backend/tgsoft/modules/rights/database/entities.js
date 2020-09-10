import { default as orm } from 'typeorm';

export const roles = new orm.EntitySchema({
    name: 'roles',
    columns: {
        id: { type: 'int', generated: true, primary: true },
        name: { type: 'varchar', length: 100 },
        active: { type: 'tinyint', default: true }
    }
})

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

export const rightsRoles = new orm.EntitySchema({
    name: 'rightsRoles',
    columns: {
        id: { type: 'int', generated: true, primary: true },
        roleId: { type: 'int' },
        rightId: { type: 'int' },
        allowed: { type: 'tinyint'}
    }
})