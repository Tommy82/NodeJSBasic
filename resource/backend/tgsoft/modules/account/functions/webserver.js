import { TGSoft} from "../../tgsoft/tgsoft.js";
import path from 'path';
import fs from 'fs';

TGSoft.webServer.app.get('/backend/login', TGSoft.webServer.checkNotAuthenticated_Backend, (req, res) => {
    let fileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', 'login.twig');
    let altFileName = path.join(TGSoft.directories.frontend, 'tgsoft', 'modules', 'accounts', 'login.twig');
    if ( fs.existsSync(altFileName) ) { res.render(altFileName, {}); }
    else { res.render(fileName, {}) }
});

TGSoft.webServer.app.post('/backend/login', TGSoft.webServer.passport.authenticate('local', {
    successRedirect: '/backend',
    failureRedirect: '/backend/login?error=1',
    failureFlash: true
}))

TGSoft.webServer.app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

TGSoft.webServer.app.get('/backend/logout', function(req, res) {
    req.logout();
    res.redirect('/backend');
})