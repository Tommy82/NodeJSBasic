import './resource/backend/tgsoft/startup.js';
import { TGSoft } from "./resource/backend/tgsoft/modules/tgsoft/tgsoft.js";


/** Automatic Redirect from "Frontend" to "Backend", because no Frontend exists **/
TGSoft.webServer.app.get('/', (req, res) => { res.redirect('/backend'); });



