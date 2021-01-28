import { TGSoft } from "../../tgsoft/tgsoft.js";
import passport from 'passport';
import passport_local from 'passport-local';
import { default as cAccount } from '../classes/account.js';
import { default as cRole } from '../../rights/classes/roles.js';

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
                    if ( !acc.active ) { return done(null, false, { message: 'no-user'}); }
                    /*
                    if (!TGSoft.helper.security.comparePassword(password, acc.hashedPassword)) {
                        console.log('3');
                        return done(null, false, { message: 'front-password'} );
                    } else {
                        console.log(password + " | " + acc.hashedPassword);
                    }
                    console.log('4');
                    return done(null, acc);
                     */

                    TGSoft.helper.security.comparePassword(password, acc.hashedPassword)
                        .then(state => {
                            if (state === false) {
                                return done(null, false, {message: 'no-user'});
                            } else {
                                return done(null, acc);
                            }
                        })
                        .catch ( () => { return done(null, false, { message: 'no-user'}); })
                })
        }
        TGSoft.webServer.passport.use(new passport_local.Strategy({ usernameField: 'loginName' }, authenticateUser)); // If Authorisize -> get "loginname" from html formular and check Data
        TGSoft.webServer.passport.serializeUser((user, done) => { done(null, user.id) });
        TGSoft.webServer.passport.deserializeUser((id, done) => {
            cAccount.getById(id)
                .catch ( err => { TGSoft.log.error('tgsoft:account:security:passport_initialize', err, '002'); })
                .then( acc => {

                    /** After Login, load all Rights **/
                    if ( acc && acc.roleType !== '' ) {
                        cRole.getByName(acc.roleType)
                            .then(res => {
                                if ( !res || res.length === 0 ) { }
                                res[0].getRights()
                                    .catch ( () => { return done(null, false, { message: 'front-password'} ); })
                                    .then(() => {
                                        acc.role = res[0];
                                        if ( acc.role && acc.role.lstRights && acc.role.lstRights.length > 0 ) {
                                            acc.myRole = [];
                                            acc.role.lstRights.forEach(item => {
                                                if ( !acc.myRole ) { acc.myRole = [] }
                                                if ( !acc.myRole[item.moduleName] ) { acc.myRole[item.moduleName] = []; }

                                                acc.myRole[item.moduleName][item.name] = item.allowed === 1 || item.allowed === true ? 1 : 0;
                                            })
                                        }
                                        return done(null, acc);
                                    })
                            })
                            .catch(() => { return done(null, false, { message: 'front-password'} ); })
                    } else { return done(null, acc); }
                })
        });
    }
}