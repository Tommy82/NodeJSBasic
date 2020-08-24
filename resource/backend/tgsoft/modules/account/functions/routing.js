import { TGSoft} from "../../tgsoft/tgsoft.js";
import * as fWebServer from './webserver.js';

TGSoft.webServer.app.get('/backend/login', TGSoft.webServer.checkNotAuthenticated_Backend, (req, res) => { fWebServer.toOutput(req, res,'login.twig')});

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

TGSoft.webServer.app.get('/backend/users', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.userList );
TGSoft.webServer.app.get('/backend/users/details/:id', /*TGSoft.webServer.checkAuthenticated_Backend,*/ fWebServer.userDetails);
