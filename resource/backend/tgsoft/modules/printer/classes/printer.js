import * as fHtml from '../functions/html.js';

export default class Printer {

    static format = {
        NotSet: '',
        A4: 'A4',
        A5: 'A5',
        A6: 'A6',
    }

    static moduleName = "TGSoft_Printer";

    static html2pdf = fHtml.toPdf;
    static html2printer = fHtml.toPrinter;
}