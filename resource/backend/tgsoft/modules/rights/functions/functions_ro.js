import * as fDatabase_RI from '../database/functions_ri.js';

export function fillRights() {
    // Clear Rights
    if ( this.lstRights && this.lstRights.length > 0 ) { this.lstRights = []; }
}