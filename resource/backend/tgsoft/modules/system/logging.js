/**
 * Logging Helper Functions
 *
 * @author Thomas Göttsching
 * @version 1.0
 * @revision 1
 */

"use strict";

import { default as helper } from '../helper/helper.js'
import events from 'events';


/**
 * Global Logging Class
 * @type class
 */
export default class Logging  {

    /**
     * Log the Error
     * @param {string} module ModuleName
     * @param {object} error Error Object
     * @param {string} internCode Internal Code of the Error ( that can be identified by Developer! )
     */
    error(module, error, internCode = '[000]') {
        let currDateTime = helper.dateTime.getCurrentDateTime();
        console.log('------------------------------------');
        console.log(`new Error occurred in Module [${module}] @ `);
        console.log(`DateTime: ${currDateTime.realString}`);
        console.log(`UTCDateTime: ${currDateTime.realUTCString}`);
        console.log(`Internal Code: ${internCode}`);
        console.log(error);
        console.log('------------------------------------');
    }

    /**
     * Log of a Message or a Object
     * @param {string} module ModuleName
     * @param {object} message MessageText or Object that should be Shown
     * @param {string} internCode Internal Code of the Error ( that can be identified by Developer! )
     */
    log(module, message, internCode = '[000]') {
        let currDateTime = helper.dateTime.getCurrentDateTime();
        console.log('------------------------------------');
        console.log(`new Logging in Module [${module}] @ `);
        console.log(`DateTime: ${currDateTime.realString}`);
        console.log(`UTCDateTime: ${currDateTime.realUTCString}`);
        console.log(`Internal Code: ${internCode}`);
        console.log(message);
        console.log('------------------------------------');
    }

    /**
    * Simply show a Message in Console without any extended Data
    * @param {string} module ModuleName
    * @param {object} message MessageText or Object that should be Shown. Object converts by JSON.stringify
    */
    simplyMessage(module, message) {
        let currDateTime = helper.dateTime.getCurrentDateTime();
        console.log(`[${currDateTime.realString}] >> ${module} >> ${JSON.stringify(message)}`);
    }

}




