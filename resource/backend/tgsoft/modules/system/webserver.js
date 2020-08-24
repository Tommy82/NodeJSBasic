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
import {TGSoft} from "../tgsoft/tgsoft";
import fs from "fs";

/** WebServer Class **/
export default class WebServer {
    /** {object} Express (WebServer) App **/
    app = undefined;
    /** {boolean} False = WebServer is NOT Ready | True = WebServer is Ready **/
    isOnline = false;

    /**
     * Passport Authentication
     * @type {object}
     */
    passport = undefined;

    /** Instantiate a new WebServer Instance */
    constructor(coreEvents, directories, settings) {
        this.app = express();                                                       // Initialize Express Webserver
        if (settings.webServer.templateSystem === 'twig') {                        // If Template System equals Twig ...
            this.app.engine('twig', Twig.__express);                                // ... set Twig to Express as default Engine
            this.app.set('view-engine', 'twig');                                    // ... set twig as View Engine
            this.app.set('views', directories.frontend);                            // ... set Frontend Directory
            this.app.set('twig options', {});                                       // ... set Twig Options
        }
        this.app.set('view options', {layout: false});                                     // Set View Options
        this.app.use(express.static(directories.frontend));    // Set Frontend Static Directory ( needed for "include files" like 'js', 'css', 'png' ...)
        this.app.use(express.urlencoded({extended: false}));                              // Set Url Encoding
        this.app.use(flash());                                                              // Include Flash to set direct Messages on HTML Form
        this.app.use(session({                                                      // Set WebServer Session
            secret: settings.webServer.sessionKey,
            resave: false,
            saveUninitialized: false
        }));
        this.app.use(methodOverride('_method'));                             // Allow Method Override
        this.app.listen(settings.webServer.port);                                   // Start WebServer with Port given in Settings File
        this.isOnline = true;                                                       // Set Internal Parameter to true, so Modules that initialize later can see that Server is online
        console.log(`[TGSoft] - WebServer is Ready and listen on Port [${settings.webServer.port}]`)
        coreEvents.emit('core:webServer:connected');                                // Tell everyone that Server is online and connected
    }

    checkAuthenticated_Backend(req, res, next) {
        if ( req.isAuthenticated()) { return next(); }
        res.redirect('/backend/login');
    }

    checkNotAuthenticated_Backend(req, res, next) {
        if ( req.isAuthenticated() ) { res.redirect('/backend'); }
        next();
    }

    checkAuthenticated_Frontend(req, res, next) {
        if ( req.isAuthenticated()) { return next(); }
        res.redirect('/login');
    }

    checkNotAuthenticated_Frontend(req, res, next) {
        if ( req.isAuthenticated() ) { res.redirect('/'); }
        next();
    }

    toOutput(req, res, fileName, path, params) {
        let _fileName = TGSoft.directories.frontend;

        console.log(_fileName);
        /*
        let _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', fileName);
        let _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'accounts', fileName);
        if ( fileName === 'error.twig') {
            _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'error', 'error.twig');
            _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'error', 'error.twig');
        }
        if ( fs.existsSync(_altFileName) ) { res.render(_altFileName, {}); }
        else { res.render(_fileName, !params ? {} : params) }
         */
    }

}