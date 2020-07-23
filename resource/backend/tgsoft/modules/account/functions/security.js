import { TGSoft } from "../../tgsoft/tgsoft.js";
import passport from 'passport';
import passport_local from 'passport-local';
import { default as cAccount } from '../classes/account.js';

export function passport_initialize() {
    if ( TGSoft.webServer.passport === undefined ) {
        TGSoft.webServer.passport = new passport.Authenticator();
        TGSoft.webServer.app.use(TGSoft.webServer.passport.initialize());
        TGSoft.webServer.app.use(TGSoft.webServer.passport.session());
        const authenticateUser = async (loginName, password, done ) => {
            cAccount.getByUsername(loginName)
                .catch ( err => { TGSoft.log.error('tgsoft:account:security:passport_initialize', err, '001'); })
                .then(acc => {
                    if ( !acc || acc.id === 0 ) { return done(null, false, { message: 'no-user' }); }
                    if (!TGSoft.helper.security.comparePassword(password, acc.hashedPassword)) {
                        return done(null, false, { message: 'front-password'} );
                    }
                    return done(null, acc);
                })
        }
        TGSoft.webServer.passport.use(new passport_local.Strategy({ usernameField: 'loginName' }, authenticateUser)); // If Authorisize -> get "loginname" from html formular and check Data
        TGSoft.webServer.passport.serializeUser((user, done) => { done(null, user.id) });
        TGSoft.webServer.passport.deserializeUser((id, done) => {
            cAccount.getById(id)
                .catch ( err => { TGSoft.log.error('tgsoft:account:security:passport_initialize', err, '002'); })
                .then( acc => { return done(null, acc); })
        });
    }
}