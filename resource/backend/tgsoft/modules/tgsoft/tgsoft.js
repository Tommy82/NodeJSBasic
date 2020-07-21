import events from 'events';
import { default as HelperClass } from '../helper/helper.js';
import { settings as TGSettings } from '../../../../configuration/settings.js';
import { DBConnection } from "../system/database.js";
import { default as WebServerClass } from '../system/webserver.js';
import { default as Logging } from '../system/logging.js';
import fs from 'fs';
import path from 'path';

let TGSoft = undefined;

class TGSoftClass {
    /** Global Database Connection **/
    database = undefined;
    /** Global Directories **/
    directories = {
        root: undefined,
        backend: undefined,
        frontend: undefined,
        import: undefined,
        export: undefined
    }
    /** Global Event Manager **/
    events = undefined;
    /** Global Helper Class **/
    helper = undefined;
    /** Global Log System **/
    log = undefined;
    /** Global Module List **/
    modules = undefined;
    /** Global - Settings Content **/
    settings = undefined;
    /** Global WebServer */
    webServer = undefined;
    /** Global Texts **/
    languages = undefined;

    constructor() {
        console.log('[TGSoft] - Start - Server')
        this.settings = TGSettings;
        this.log = new Logging();
        this.setDirectories();
        this.helper = HelperClass;
        this.events = new events.EventEmitter();
        this.modules = [];
        this.webServer = new WebServerClass(this.events, this.directories, this.settings);
    }

    setDirectories() {
        this.directories.root = fs.realpathSync('.');
        this.directories.backend = path.join(this.directories.root, 'resource', 'backend');
        this.directories.frontend = path.join(this.directories.root, 'resource', 'frontend');
        this.directories.import = path.join(this.directories.root, 'resource', 'import');
        this.directories.export = path.join(this.directories.root, 'resource', 'export');
    }

    /**
     * - Init all Modules
     * - Create Database with Entities of all Modules
     * **/
    async init() {
        console.log('[TGSoft] - Initialize Modules')
        let entityArray = [];
        if ( this.modules && this.modules.length > 0 ) {
            await HelperClass.lists.asyncForEach(this.modules, async(module) => {
                if ( module && module.init ) { await module.init(); }
                if ( module.entities && module.entities.length > 0 ) {
                    for ( let i = 0; i < module.entities.length; i++ ) {
                        if ( module.entities[i] !== undefined ) {
                            entityArray.push(module.entities[i]);
                        }
                    }
                }
            })
        }
        console.log('[TGSoft] - Start Database')
        this.database = new DBConnection(entityArray, this.events, this.settings);
    }

    /**
     * Install all Modules
     * @return {Promise<void>}
     */
    async install() {
        console.log('[TGSoft] - Install Modules')
        await HelperClass.lists.asyncForEach(this.modules, async(module) => {
            if ( module && module.install ) { await module.install(); }
        })
    }

    /**
     * Start Modules and Load Parameters on Serverstart
     * @return {Promise<void>}
     */
    async start() {
        console.log('[TGSoft] - Start Modules')
        await HelperClass.lists.asyncForEach(this.modules, async(module) => {
            if ( module && module.start ) { await module.start(); }
        })
    }

    addModule(module) { this.modules.push(module); }
}

TGSoft = TGSoft ? TGSoft : new TGSoftClass();

export { TGSoft }

