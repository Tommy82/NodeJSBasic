/**
 * Helper Class
 *
 * @author Thomas Göttsching
 * @version 1.0
 * @revision: 1
 */

import { default as DateTime } from './functions/datetime.js';
import { default as Lists }  from './functions/lists.js';
import { default as Security } from './functions/security.js';
import { default as Converter } from './functions/converter.js';

export default class Helper {
    dateTime = new DateTime();
    lists = new Lists();
    security = new Security();
    converter = new Converter();
}


