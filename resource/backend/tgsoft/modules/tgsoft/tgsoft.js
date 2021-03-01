import events from 'events';
import fs from 'fs';
import path from 'path';

/// <reference path="../helper/helper.js" />
import { default as HelperClass } from '../helper/helper.js';
import { settings as TGSettings } from '../../../../configuration/settings.js';
import { DBConnection } from "../system/database.js";
/// <reference path="../system/webserver.js" />
import { default as WebServerClass } from '../system/webserver.js';
/// <reference path="../system/logging.js" />
import { default as Logging } from '../system/logging.js';
import Rights from "../rights/classes/rights.js";
import { default as Printer } from '../printer/classes/printer.js';


/** @type TGSoftClass */
let TGSoft;

class Directories {
    /** Root Verzeichnis @type string */
    root;
    /** Backend Verzeichnis @type string */
    backend;
    /** Frontend Verzeichnis @type string */
    frontend;
    /** Import Verzeichnis @type string */
    import;
    /** Export Verzeichnis @type string */
    export;
}

/** Global Class */
class TGSoftClass {

    /** Database of TGSoft System
     * @type DBConnection 
     **/
    database = undefined;

    /** Global Directories 
     * @type Directories
     **/
    directories = new Directories();

    /** Global Event Manager 
     *  @type events
     **/
    events;
    
    /** Global Helper Class 
     * @type HelperClass
     * **/
    helper = new HelperClass();

    /** Global Log System 
     * @type Logging
     * **/
    ///<reference path="../system/logging.js">
    log = new Logging();
    
    /** Global Module List 
     * @type Array
     * **/
    modules = [];

    /** Global Right List
     * @type Array 
     * **/
    rights = [];
    
    /** Global - Settings Content 
     * @type Array
     * **/
    settings;

    /** Express Webserver 
     * @type WebServerClass */
    webServer;

    /** Global Printer Support 
     * @type Printer
     * **/
    printer = new Printer();

    /** Global Texts **/
    languages;
    
    /** Global Timers
     * @type Array
     */
    timers = [];
    
    /** Current Jobs ( maybe from timers ) working
     * @type Array
     */
    currentJobs = [];

    /** Generate a new Instance of TGSoft Core Class **/
    constructor() {
        console.log('[TGSoft] - Start - Server')
        this.settings = TGSettings;                                                             // Add Settings
        this.setDirectories();                                                                  // Set Global Directories
        this.events = new events.EventEmitter();                                                // Add Eventemitters
        this.webServer = new WebServerClass(this.events, this.directories, this.settings);      // Add Module - Webserver
    }

    /** Set Global Directories */
    setDirectories() {
        this.directories.root = fs.realpathSync('.');                                           // Root Path 
        this.directories.backend = path.join(this.directories.root, 'resource', 'backend');     // Backend Source
        this.directories.frontend = path.join(this.directories.root, 'resource', 'frontend');   // Frontend Source
        this.directories.import = path.join(this.directories.root, 'resource', 'import');       // Import Source
        this.directories.export = path.join(this.directories.root, 'resource', 'export');       // Export Source
    }

    /**
     * - Init all Modules
     * - Create Database with Entities of all Modules
     * **/
    async init() {
        console.log('[TGSoft] - Initialize Modules')
        let entityArray = [];                                                           // Temporary EntityArray to catch all Entities
        if ( this.modules && this.modules.length > 0 ) {
            await this.helper.lists.asyncForEach(this.modules, async(module) => {
                let moduleName = 'undefined';
                if ( module && module.moduleName ) { moduleName = module.moduleName }
                if ( module && module.init ) { await module.init(); }                   // Init Module ( Start Module Install:Init Function )
                //#region Add Module - Entities
                if ( module.entities && module.entities.length > 0 ) {
                    for ( let i = 0; i < module.entities.length; i++ ) {
                        if ( module.entities[i] !== undefined ) {
                            entityArray.push(module.entities[i]);
                        }
                    }
                }
                //#endregion Add Module - Entities
                
                //#region Add Module - Rights
                if ( module.rights && module.rights.length > 0 ) {
                    for ( let i = 0; i < module.rights.length; i++ ) {
                        if ( module.rights[i] !== undefined ) {
                            this.rights.push({
                                moduleName: moduleName,
                                key: module.rights[i].key,
                                desc: module.rights[i].desc,
                                defaultRole: module.rights[i].defaultRole
                            })
                        }
                    }
                }
                //#endregion Add Module - Rights
            })
        }
        console.log('[TGSoft] - Start Database')
        this.database = new DBConnection(entityArray, this.events, this.settings);      // Start Database
    }

    /**
     * - Install all Modules
     * - Check all Rights
     */
    async install() {
        console.log('[TGSoft] - Install Modules')
        await this.helper.lists.asyncForEach(this.modules, async(module) => {   
            if ( module && module.install ) { await module.install(); }             // Start Install Function of Module Install:install
        })

        console.log('[TGSoft] - Install Rights')
        
        //#region Handle Module Rights
        let lstRights = await Rights.getAll(true);
        if ( this.rights && this.rights.length > 0 ) {
            await this.helper.lists.asyncForEach(this.rights, async(right) => {
                let dbRight = undefined;
                if ( lstRights && lstRights.length > 0 ) {
                    dbRight = lstRights.find(x => x.moduleName === right.moduleName && x.name === right.key);
                }
                if ( dbRight && dbRight.id > 0 ) {
                    dbRight.defaultRole = right.defaultRole;
                    dbRight.desc = right.desc;
                } else {
                    dbRight = new Rights();
                    dbRight.moduleName = right.moduleName;
                    dbRight.active = true;
                    dbRight.defaultRole = right.defaultRole;
                    dbRight.desc = right.desc;
                    dbRight.name = right.key;
                    dbRight.id = 0;
                }
                await dbRight.save();
            });
        }
        //#endregion Handle Module Rights

    }

    /**
     * Start Modules and Load Parameters on Serverstart
     */
    async start() {
        console.log('[TGSoft] - Start Modules')
        await this.helper.lists.asyncForEach(this.modules, async(module) => {
            if ( module && module.start ) { await module.start(); }
        });

        // Start Timers
        this.timers.forEach(item => {
            if ( item.interval > 0 && item.function ) {
                item.myTimer = setInterval(item.function, item.interval);
            }
        })
    }

    /**
     * Add a module to Global Modules to init and install the Module.
     * After Finish start all Modules, the Array was cleared to clean Resources
     * @param module
     */
    addModule(module) { this.modules.push(module); }
}

// If TGSoft not instantiated, do it!
TGSoft = TGSoft ? TGSoft : new TGSoftClass(); 


// Export TGSoft to use it in all Modules
export { TGSoft }   
