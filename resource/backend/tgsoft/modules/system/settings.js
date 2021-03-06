import {TGSoft} from "../tgsoft/tgsoft.js";

export default class Settings {
    
    id;
    key;
    value;

    constructor() {
        this.id = 0;
        this.key = '';
        this.value = '';
    }

    static async db_getAll() {
        return new Promise((resolve, reject) => {
            TGSoft.database.findAll('settings')
                .then(lstData => { return resolve(lstData); })
                .catch(err => { return reject(err); })
        })
    }

    static async handle() {
        return new Promise((resolve, reject) => {
            TGSoft.settings.fromDB = [];
            Settings.db_getAll()
                .then(lstData => {
                    if ( lstData && lstData.length > 0 ) {
                        lstData.forEach(item => {
                            TGSoft.settings.fromDB[key] = value;
                        })
                    }
                    return resolve(true);
                })
                .catch(err => { return reject(err); })
        })
    }

    static async getAll() {
        return new Promise((resolve, reject) => {
            Settings.db_getAll()
                .then(lstData => { return resolve(lstData); })
                .catch(err => { return reject(err); })
        })
    }

    static async toSite(req, res) {
        TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'settings'], 'list.twig', {  });
    }

    static async json_All(req, res) {
        Settings.db_getAll()
            .then(lstData => { return res.json({success: true, data: lstData}); })
            .catch(err => { return res.json({success: false, error: err}); })
    }

}

