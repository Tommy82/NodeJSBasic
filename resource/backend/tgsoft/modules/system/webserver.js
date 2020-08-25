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
    directories = undefined;

    /** Instantiate a new WebServer Instance */
    constructor(coreEvents, directories, settings) {
        this.directories = directories;
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

    toOutput(req, res, filePath, fileName, params) {
        let _fileName = this.directories.frontend;
        let _altFileName = this.directories.frontend;
        if ( filePath && filePath.length > 0 ) { filePath.map(item => {
            _fileName = path.join(_fileName, item);
            if ( item === 'tgsoft' ) { _altFileName = path.join(_altFileName, 'tgsoft_override'); } else { _altFileName = path.join(_altFileName, item); }
        })}
        _fileName = path.join(_fileName, fileName);
        if ( fs.existsSync(_altFileName) ) { res.render(_altFileName, !params ? {} : params); }
        else { res.render(_fileName, !params ? {} : params) }
    }
}