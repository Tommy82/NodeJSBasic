/**
 *
 * Global WebServer Class
 *
 * Features:
 * -> NodeJS Express Webserver
 * -> Template System ( Twig )
 * -> Authenticate Mode
 *
 * @author Thomas Göttsching
 * @version 1.0
 * @revision 1
 */

import express from 'express';
import {default as session} from 'express-session';
import flash from 'express-flash';
import methodOverride from 'method-override';
import Twig from 'twig';
import path from "path";
import fs from "fs";
import Account from "../account/classes/account.js";
import {TGSoft} from "../tgsoft/tgsoft.js";

/** WebServer Class **/
export default class WebServer {
    /** 
     * Express Webserver
     * @type express
     */
    app = undefined;
    
    /** False = WebServer is NOT Ready | True = WebServer is Ready 
     * @type boolean
     **/
    isOnline = false;

    /**
     * Passport Authentication
     * @type {object}
     */
    passport = undefined;
    
    /**
     * Directories of Backend, Frontend, ...
     * @type Directories
     */
    directories = undefined;

    /** Instantiate a new WebServer Instance */
    constructor(coreEvents, directories, settings) {
        this.directories = directories;
        this.app = express();                                           // Initialize Express Webserver
        if (settings.webServer.templateSystem === 'twig') {             // If Template System equals Twig ...
            this.app.engine('twig', Twig.__express);                    // ... set Twig to Express as default Engine
            this.app.set('view-engine', 'twig');                        // ... set twig as View Engine
            this.app.set('views', directories.frontend);                // ... set Frontend Directory
            this.app.set('twig options', {});                           // ... set Twig Options
        }
        this.app.set('view options', {layout: false});                  // Set View Options
        this.app.use(express.static(directories.frontend));             // Set Frontend Static Directory ( needed for "include files" like 'js', 'css', 'png' ...)

        this.prefix = '';
        if ( settings.webServer.prefix && settings.webServer.prefix !== '' ) {
            this.prefix = settings.webServer.prefix;
            this.router = new express.Router();
            this.router.use(this.prefix, () => {});
            this.app.use(this.prefix, express.static(directories.frontend));
            this.app.use(this.prefix, this.router);
            this.app.use(this.prefix, this.router);
        }

        this.app.use(express.urlencoded({extended: false}));            // Set Url Encoding
        this.app.use(flash());                                          // Include Flash to set direct Messages on HTML Form
        this.app.use(session({                                          // Set WebServer Session
            secret: settings.webServer.sessionKey,
            resave: false,
            saveUninitialized: false
        }));
        this.app.use(methodOverride('_method'));                        // Allow Method Override
        this.app.listen(settings.webServer.port);                       // Start WebServer with Port given in Settings File
        this.isOnline = true;                                           // Set Internal Parameter to true, so Modules that initialize later can see that Server is online
        console.log(`[TGSoft] - WebServer is Ready and listen on Port [${settings.webServer.port}]`)
        coreEvents.emit('core:webServer:connected');                    // Tell everyone that Server is online and connected
    }

    /**
     * Check if Backend User is logged in.
     * If Check is "positive", goto function "next", other routing to "backend/login"
     * @param {object} req WebServer-Request
     * @param {object} res WebServer-Response
     * @param {function} next Function that called on positive Authentication
     * @return {*}
     */
    checkAuthenticated_Backend(req, res, next) {
        if ( req.isAuthenticated()) { return next(); }
        res.redirect(TGSoft.webServer.prefix + '/backend/login');
    }

    /**
     * Check if Backend User is NOT logged in
     * If Check is "negative", goto function "next", other routing to "Backend-Mainpage"
     * @param {object} req WebPage-Request
     * @param {object} res WebPage-Response
     * @param {function} next Function that called on negative Authentication
     */
    checkNotAuthenticated_Backend(req, res, next) {
        if ( req.isAuthenticated() ) { res.redirect(TGSoft.webServer.prefix + '/backend'); }
        next();
    }

    /**
     * Send the "Core" Data to Twig Template.
     * Check if Twig Template is in "tgsoft_override", other load twig in "tgsoft"
     * @param {object} req WebServer-Request
     * @param {object} res WebServer-Response
     * @param {Array} filePath Path to twig File
     * @param {string} fileName Twig FileName
     * @param {object} params Parameter that should be send to Template
     */
    toOutput(req, res, filePath, fileName, params) {

        if ( req.user && req.user.id > 0 ) {
            params.me = {
                id: req.user.id,
                name: req.user.userName,
                role: req.user.roleType,
                active: req.user.active,
            };

            req.user.filterByModuleName(Account.moduleName)
                .catch ( err => { TGSoft.webServer.toOutput(req, res, [], 'error.twig', { error: err }); })
                .then(twigRights => {
                    params.lstModuleRights = twigRights;
                    params.myModules = req.user.myRole;
                    params.currUser = req.user;
                    params.basicSite = TGSoft.settings.webServer.basicSite;
                    this.toTwigOutput(req, res, filePath, fileName, params);
                })
        } else {
            params.lstModuleRights = [];
            params.myModules = [];
            params.basicSite = TGSoft.settings.webServer.basicSite;
            params.prefix = TGSoft.webServer.prefix;
            params.me = {
                id: 0,
                name: '',
                role: '',
                active: false,
            };
            this.toTwigOutput(req, res, filePath, fileName, params);
        }
    }

    /**
     * Send Data to Twig Template
     * @param {object} req  Website-Request
     * @param {object} res  Website-Response
     * @param {Array} filePath Path to File ( without Filename! )
     * @param {string} fileName Filename (without Path)
     * @param {Array} params Params for Twig Template
     */
    toTwigOutput(req, res, filePath, fileName, params) {
        let _fileName = this.directories.frontend;
        let _altFileName = this.directories.frontend;
        if ( filePath && filePath.length > 0 ) { filePath.map(item => {
            _fileName = path.join(_fileName, item);
            if ( item === 'tgsoft' ) { _altFileName = path.join(_altFileName, 'tgsoft_override'); } else { _altFileName = path.join(_altFileName, item); }
        })}
        _fileName = path.join(_fileName, fileName);
        _altFileName = path.join(_altFileName, fileName);

        if ( fileName === 'error.twig') {
            _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'error', 'error.twig');
            _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'error', 'error.twig');
        }
        if ( fileName === 'access_denied.twig') {
            _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'error', 'access_denied.twig');
            _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'error', 'access_denied.twig');
        }

        if ( fs.existsSync(_altFileName) ) { res.render(_altFileName, !params ? {} : params); }
        else { res.render(_fileName, !params ? {} : params) }

    }
}

