import { default as fs } from 'fs';
export function classStart() {
    // Check if Printer Directory exists
    if (!fs.existsSync('./data')) { fs.mkdirSync('./data'); }
    if (!fs.existsSync('./data/output')) { fs.mkdirSync('./data/output'); }
    if (!fs.existsSync('./data/output/printer')) { fs.mkdirSync('./data/output/printer'); }
    if (!fs.existsSync('./data/output/pdf')) { fs.mkdirSync('./data/output/pdf'); }
}