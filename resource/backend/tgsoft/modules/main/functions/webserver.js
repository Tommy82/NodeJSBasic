import { TGSoft } from "../../tgsoft/tgsoft.js";
import fs from 'fs';
import DOMParser from 'dom-parser';

/** WebServer -> Backend MainPage -> Get **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend', TGSoft.webServer.checkAuthenticated_Backend, (req, res) => {

    let filename = TGSoft.directories.root + TGSoft.settings.main.changelogFile;

    let params = {
        changelog: '',
    }

    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) { throw err; }
        else {
            let parser = new DOMParser();
            params.changelog = (parser.parseFromString(data, 'text/html')).rawHTML;
            params.changelog =params.changelog.replace(/\r\n/g, '<br/>');
        }
        TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'main'], 'index.twig', params);
    });
})

/** WebServer -> Backend MainPage -> Get **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/', TGSoft.webServer.checkAuthenticated_Backend, (req, res) => {
    let filename = TGSoft.directories.root + TGSoft.settings.main.changelogFile;
    let params = {
        changelog: '',
    }
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) { throw err; }
        else {
            let parser = new DOMParser();
            params.changelog = (parser.parseFromString(data, 'text/html')).rawHTML;
            params.changelog =params.changelog.replace(/\r\n/g, '<br/>');
        }
        TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'main'], 'index.twig', params);
    });
})

TGSoft.webServer.app.get('/', TGSoft.webServer.checkAuthenticated_Backend, (req, res) => {
    let filename = TGSoft.directories.root + TGSoft.settings.main.changelogFile;
    let params = {
        changelog: '',
    }
    fs.readFile(filename, 'utf8', function(err, data) {
        if (err) { throw err; }
        else {
            let parser = new DOMParser();
            params.changelog = (parser.parseFromString(data, 'text/html')).rawHTML;
            params.changelog =params.changelog.replace(/\r\n/g, '<br/>');
        }
        TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'main'], 'index.twig', params);
    });
})