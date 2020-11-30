import './../resource/backend/tgsoft/startup.js';
import { TGSoft } from "./../resource/backend/tgsoft/modules/tgsoft/tgsoft.js";
import {default as printer} from './../resource/backend/tgsoft/modules/printer/classes/printer.js';

printer.html2pdf('http://www.google.de', './data/output/pdf/tmp1.pdf', 'A4')
    .catch(err => { console.error(err); })

printer.html2printer('http://www.google.de', 'A4', null)
    .catch(err => { console.error(err); })


