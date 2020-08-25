import { TGSoft } from "../../tgsoft/tgsoft.js";
import * as webServer from "./webserver.js";

TGSoft.webServer.app.get('/backend/roles', /*TGSoft.webServer.checkAuthenticated_Backend,*/ webServer.get_roles);
TGSoft.webServer.app.get('/backend/roles/details/:id', /*TGSoft.webServer.checkAuthenticated_Backend,*/ webServer.get_roles_details);