import { TGSoft} from "../../tgsoft/tgsoft.js";
import * as fWebServer from './webserver.js';

/** WebServer -> Login -> Get **/
TGSoft.webServer.app.get('/backend/login', TGSoft.webServer.checkNotAuthenticated_Backend, (req, res) => {
    TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'login.twig', { });
});

/** WenServer -> Login -> Post | Check Login **/
TGSoft.webServer.app.post('/backend/login', TGSoft.webServer.passport.authenticate('local', {
    successRedirect: '/backend',
    failureRedirect: '/backend/login?error=1',
    failureFlash: true
}))

/** WebServer -> Logout -> Get | Logout User **/
TGSoft.webServer.app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

/** WebServer -> Logout -> Get | Logout Backend User **/
TGSoft.webServer.app.get('/backend/logout', function(req, res) {
    req.logout();
    res.redirect('/backend');
})

/** WebServer -> UserList -> Get | Load UserList **/
TGSoft.webServer.app.get('/backend/users', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.userList );

TGSoft.webServer.app.get('/backend/users/me', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.siteMe );

TGSoft.webServer.app.post('/backend/users/me', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.updateMe);

/** WebServer -> UserList -> Get | Load UserDetails **/
TGSoft.webServer.app.get('/backend/users/details/:id', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.userDetails);

/** WebServer -> UserList -> Post | Save Userdata **/
TGSoft.webServer.app.post('/backend/users/details/:id', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.postUserDetails);
