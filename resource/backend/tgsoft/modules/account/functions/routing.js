import { TGSoft} from "../../tgsoft/tgsoft.js";
import * as fWebServer from './webserver.js';

/** WebServer -> Login -> Get **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend/login', TGSoft.webServer.checkNotAuthenticated_Backend, (req, res) => {
    TGSoft.webServer.toOutput(req, res, ['tgsoft', 'modules', 'accounts'], 'login.twig', { });
});

/** WenServer -> Login -> Post | Check Login **/
TGSoft.webServer.app.post(TGSoft.webServer.prefix + '/backend/login', TGSoft.webServer.passport.authenticate('local', {
    successRedirect: TGSoft.webServer.prefix + '/backend',
    failureRedirect: TGSoft.webServer.prefix + '/backend/login?error=1',
    failureFlash: true
}))

/** WebServer -> Logout -> Get | Logout User **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/logout', function(req, res){
    req.logout();
    res.redirect(TGSoft.webServer.prefix + '/');
});

/** WebServer -> Logout -> Get | Logout Backend User **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend/logout', function(req, res) {
    req.logout();
    res.redirect(TGSoft.webServer.prefix + '/backend');
})

/** WebServer -> UserList -> Get | Load UserList **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend/users', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.userList );

/** WebServer -> Me | Get | Load Self Settings */
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend/users/me', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.siteMe );

/** WebServer -> Me | Post | Save Self Settings */
TGSoft.webServer.app.post(TGSoft.webServer.prefix + '/backend/users/me', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.updateMe);

/** WebServer -> UserList -> Get | Load UserDetails **/
TGSoft.webServer.app.get(TGSoft.webServer.prefix + '/backend/users/details/:id', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.userDetails);

/** WebServer -> UserList -> Post | Save Userdata **/
TGSoft.webServer.app.post(TGSoft.webServer.prefix + '/backend/users/details/:id', TGSoft.webServer.checkAuthenticated_Backend, fWebServer.postUserDetails);

