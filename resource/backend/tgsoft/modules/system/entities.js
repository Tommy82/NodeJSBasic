import orm from 'typeorm';

export const settings = new orm.EntitySchema({
    name: 'settings',
    columns: {
        id: { type: 'int', primary: true, generated: true},     // Internal / Primary Key
        upperId: { type: 'int', default: 0 },                   // UpperKey
        key: { type: 'varchar', length: 200, },                 // Name of Settings-Key
        value: { type: 'text' }                                 // Value of Key
    }
})