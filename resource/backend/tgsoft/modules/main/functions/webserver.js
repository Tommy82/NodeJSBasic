import { TGSoft } from "../../tgsoft/tgsoft.js";

/** WebServer -> Backend MainPage -> Get **/
TGSoft.webServer.app.get('/backend', TGSoft.webServer.checkAuthenticated_Backend, (req, res) => {
    TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'main'], 'index.twig', { });
})