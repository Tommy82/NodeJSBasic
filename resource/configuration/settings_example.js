export const settings = {
    runType: 'dev',                                 // [dev] = Development Mode | [prod] = Production / Release
    language: 'german',                             // Default Language in Frontend ( current only German! )
    database: {                                     // Database Settings / Connection via typeorm !
        default: {                                  // Default Connection of Basic // Auto Synchronized !
            type: 'mysql',                          // Database - Type
            host: 'localhost',                      // Database - Host
            port: 3306,                             // Database - Port
            user: '',                               // Database - User
            pass: '',                               // Database - Password
            database: ''                            // Database - Name
        }
    },
    user: {
        adminAccount: {                             // Default Admin Account | Override if exists !
            install: true,                          // [true] = Admin Account override exist Account | [false] = No Admin Account installed
            name: 'administrator',                  // Name of Account ( NOT LOGIN NAME )
            email: 'my@mail.de',                    // Mail
            login: 'admin',                         // Login-name
            pass: 'very_secure_pass'                // Login-Password
        }
    },
    webServer: {                                                // WebServer Settings
        port: 3000,                                             // WebServer - Post
        sessionKey: 'mySecret@HashKey!Key_That!noBody%knows',   // Secure Session Key
        templateSystem: 'twig', // Only 'twig'                  // Template System [ only Twig ! ]
        basicSite: '/tgsoft/basic/backend/basic.twig'           // Basic Template Site on Backend !
    }
}