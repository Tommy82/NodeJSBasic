import { TGSoft } from "../../tgsoft/tgsoft.js";
import * as webServer from "./webserver.js";

/** WebServer -> Get | Roles **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend/roles', TGSoft.webServer.checkAuthenticated_Backend, webServer.get_roles);
/** WebServer -> Get | RoleDetails (id) **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend/roles/details/:id', TGSoft.webServer.checkAuthenticated_Backend, webServer.get_roles_details);
/** WebServer -> Post | RoleDetails **/
TGSoft.webServer.app.post(TGSoft.webServer.prefix + '/backend/roles/details/:id', TGSoft.webServer.checkAuthenticated_Backend, webServer.post_roles_details);