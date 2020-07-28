import { TGSoft } from "../../tgsoft/tgsoft.js";
import path from "path";
import fs from "fs";

export function toOutput(req, res, fileName) {
    let _fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', fileName);
    let _altFileName = path.join(TGSoft.directories.frontend, 'tgsoft_override', 'modules', 'accounts', fileName);
    if ( fs.existsSync(_altFileName) ) { res.render(_altFileName, {}); }
    else { res.render(_fileName, {}) }
}