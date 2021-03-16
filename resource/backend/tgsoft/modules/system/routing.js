import {TGSoft} from "../tgsoft/tgsoft.js";
import { default as cSettings } from './settings.js';

TGSoft.webServer.app.get('/backend/settings', TGSoft.webServer.checkAuthenticated_Backend, cSettings.toSite);

TGSoft.webServer.app.get('/backend/settings/list', TGSoft.webServer.checkAuthenticated_Backend, cSettings.json_All);