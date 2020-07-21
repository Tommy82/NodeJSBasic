import { TGSoft} from "../../tgsoft/tgsoft.js";
import path from 'path';
import fs from 'fs';

TGSoft.webServer.app.get('/', (req, res) => {
    res.redirect('/login');
})

TGSoft.webServer.app.get('/login', (req, res) => {
    let fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', 'login.twig');
    let altFileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', 'login.twig');
    if ( fs.existsSync(altFileName) ) { toOutput(req, res, altFileName, {}); }
    else { toOutput(req, res, fileName, {}) }
})

function toOutput(req, res, fileName, params) {
    res.render(fileName, params)
}