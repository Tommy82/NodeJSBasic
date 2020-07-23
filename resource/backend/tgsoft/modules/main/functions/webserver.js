import { TGSoft } from "../../tgsoft/tgsoft.js";
import path from "path";
import fs from "fs";

TGSoft.webServer.app.get('/backend', TGSoft.webServer.checkAuthenticated_Backend, (req, res) => {
    let fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'main', 'index.twig');
    let altFileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'main', 'index.twig');
    if ( fs.existsSync(altFileName) ) { res.render(altFileName, {}); }
    else { res.render(fileName, {}) }
})