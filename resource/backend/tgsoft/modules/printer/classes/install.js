import { TGSoft } from "../../tgsoft/tgsoft.js";
import Printer from "./printer.js";
import * as fStart from '../functions/start.js';

class PrinterInstall {
    constructor() { }

    entities = [];

    rights = [ ]

    moduleName = Printer.moduleName;

    async init() {}
    async install() {}
    async start() { fStart.classStart(); }
}

TGSoft.addModule(new PrinterInstall())