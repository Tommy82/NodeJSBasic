/**
 *  Global Database Class
 *  Optimized for MySQL
 *  Using "TypeORM", so you can use 'mysql', 'mssql', 'oracle', ... Please read 'https://typeorm.io/#/'
 *
 *  @author: Thomas Göttsching
 *  @version 1.0
 *  @revision: 1
 */

import orm from 'typeorm';

/** Global connection Variable. is used to create the class only once */
let currConnection = undefined;

/** Global Database Class */
export class DBConnection {
    /** Database Connection **/
    connection = undefined;
    /** true = Connected Successful | false = Connected Failed **/
    isConnected = false;

    /**
     * Instantiate a new Database Class
     * @param {array} entityArray List of all orm.EntitySchemas
     * @param {events.EventEmitter} coreEvents Global EventManager
     * @param {object} settings Global Setting Manager
     * @param {boolean} syncDatabase true = Create the Database Tables by EntitySchema
     */
    constructor(entityArray, coreEvents, settings, syncDatabase = false) {
        // Check if connection exists, otherwise create a new Instance
        if ( currConnection === undefined ) {
            // Create Config File for TypeORM Module
            const config = {
                type:       `${settings.database.default.type}`,
                host:       `${settings.database.default.host}`,
                port:       settings.database.default.port,
                username:   `${settings.database.default.user}`,
                password:   `${settings.database.default.pass}`,
                database:   `${settings.database.default.database}`,
                entities:   entityArray,
                cache:      true
            }

            orm.createConnection(config)                                // Create Connection
                .then(conn => {
                    this.connection = conn;                             // Make Connection globally in complete Class
                    conn.synchronize()                                  // Sync DataTables
                        .then(() => {
                            this.isConnected = true;
                            currConnection = this;                      // Set Global Connection Variable
                            coreEvents.emit('core:database:connected'); // Tell all over the Global EventManager, that Database is successful loaded
                            console.log(`[TGSoft] - Basic Database is ready to use`)
                            return currConnection;  // Callback Connection
                        })
                        .catch(err => { throw err; })
                })
                .catch(err => { console.error(err); })
        }
        return currConnection;
    }

    /**
     * Delete all Records with the specific ID´s from Database Table
     * @param {string} repoName TableName | EntitySchema.Name
     * @param {array} ids List of ID´s or a single ID
     * @return {Promise<array of Record>}
     * @example core.database.deleteById('modules', [1]) -> Delete the Record with ID: 1
     */
    async deleteById(repoName, ids) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                let idRef = ids;
                if ( !Array.isArray(ids)) {
                    idRef = [ids];
                }
                repo.delete(idRef)
                    .catch (err => { return reject(err); })
                    .then(res => { return resolve(res); })
            } catch ( err ) { return reject(err); }
        })

    }

    /**
     * Delete all Records where the value in a specific Column
     * @param {string} repoName TableName | EntitySchema.Name
     * @param {object} document Array of delete TableRow | { column: value} | example: {'name': 'myValue'}
     * @return {Promise<void>}
     */
    async delete(repoName, document) {
        return new Promise((resolve, reject) => {
          try {
              const repo = this.connection.getRepository(repoName);
              repo.delete(document)
                  .catch ( err => { return reject(err); })
                  .then(res => { return resolve(res); })
          } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Search all Records with the specific Parameters
     * @param {string} repoName TableName | EntitySchema.name
     * @param {object} document
     * @return {Promise<array of Record>}
     */
    async find(repoName, document) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.find({ where: document})
                    .catch ( err => { return reject(err); })
                    .then( res => { return resolve(res); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Get all Records of a Table
     * @param {string} repoName TableName | EntitySchema.name
     * @return {Promise<array of Record>}
     */
    async findAll(repoName) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.find()
                    .then(res => { return resolve(res); })
                    .catch(err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Search the one Record with the specific ID or IDs
     * @param {string} repoName TableName |
     * @param {array} ids List of ID´s
     * @return {Promise<Record>}
     */
    async findById(repoName, ids) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                let idRef = ids;
                if (!Array.isArray(ids)) {
                    idRef = [ids]
                }
                repo.findByIds(idRef)
                    .then(res => { return resolve(res); })
                    .catch(err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Search the one Record with the specific Field Value
     * @param {string} repoName TableName | EntitySchema.name
     * @param {string} fieldName TableColumn
     * @param {string} fieldValue Value that should be search in the TableColumn.
     * @return {Promise<Record>}
     */
    async findOne(repoName, fieldName, fieldValue) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.findOne({ where: { [fieldName]: fieldValue }})
                    .then(res => { return resolve(res); })
                    .catch ( err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Create a new Database Entry
     * @param {string} repoName TableName | EntitySchema.name
     * @param {object} document Record Content as Object
     * @return {Promise<insert Record>}
     */
    async insert(repoName, document) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.insert(document)
                    .catch (err => { return reject(err); })
                    .then(res => { return resolve(res); })
            } catch ( err ) { return reject(err); }
        })
    }

    /**
     * Select the specific Columns from Database Table
     * @param {string} repoName TableName | EntitySchema.name
     * @param {array} fieldNames Array of TableColumns
     * @return {Promise<list of Record>}
     */
    async select(repoName, fieldNames) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                let selectionRef = fieldNames;
                if (!Array.isArray(fieldNames)) {
                    selectionRef = [fieldNames];
                }
                repo.find( {select: selectionRef })
                    .then(res => { return resolve(res); })
                    .catch(err => { return reject(err); })
            } catch(err) { return reject(err); }
        })
    }

    /**
     * Update the Database Entry with the specific ID
     * @param {string} repoName TableName | EntitySchema.name
     * @param {int} id ID that should be updated
     * @param {object} document Record Content as Class
     * @return {Promise<Database Record>} the Updated Data
     */
    async update(repoName, id, document) {
        return new Promise((resolve, reject) => {

            const repo = this.connection.manager.getRepository(repoName);
            repo.findByIds([id])
                .then(res => {
                    if (res.length <= 0) { return resolve(undefined); }

                    repo.update(id, document)
                        .then(res => { return resolve(res); })
                        .catch(err => { reject(err); });
                })
                .catch(err => { reject(err); });
        })
    }

    /**
     * Update or Insert a new Item
     * @param {string} repoName Name of Table / Entity
     * @param {array} document
     * @return {Promise<array>}
     */
    async upsert(repoName, document) {
        return new Promise((resolve, reject) => {
            try {
                const repo = this.connection.getRepository(repoName);
                repo.save(document)
                    .then(res => { return resolve(res); })
                    .catch(err => { return reject(err); })
            } catch ( err ) { return reject(err); }
        })
    }
}