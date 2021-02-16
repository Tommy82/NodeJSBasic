$(function () {
});

/**
 * Generate a TableSorter from a normal Table
 * @param {string} tableId ID of Table ( Without '#' !!! )
 */
function setTableSorter(tableId) {
    let widgets = ['uitheme', 'zebra', 'filter'];
    let widgets_options = {zebra: ["even", "odd"]}
    $(`#${tableId}`).tablesorter();
    setTimeout(() => {
        $(`#${tableId}`).tablesorter({
            theme: 'blue', // theme "jui" and "bootstrap" override the uitheme widget option in v2.7+
            headerTemplate: '{content} {icon}', // needed to add icon for jui theme
            widgets: widgets,
            widgetOptions: widgets_options,
        });
    }, 200)
}

/**
 * Generate a TableSorter from a normal Table with Search Field
 * @param {string} tableId OD of Table ( Without '#' !!!)
 */
function setTableSorterWithSearch(tableId) {
    $(`#${tableId}`).tablesorter({
        theme: 'blue',
        // hidden filter input/selects will resize the columns, so try to minimize the change
        widthFixed: true,
        // initialize zebra striping and filter widgets
        widgets: ["zebra", "filter"],
        ignoreCase: false,
        widgetOptions: {
            // filter_anyMatch options was removed in v2.15; it has been replaced by the filter_external option
            // If there are child rows in the table (rows with class name from "cssChildRow" option)
            // and this option is true and a match is found anywhere in the child row, then it will make that row
            // visible; default is false
            filter_childRows: false,
            // if true, filter child row content by column; filter_childRows must also be true
            filter_childByColumn: false,
            // if true, include matching child row siblings
            filter_childWithSibs: true,
            // if true, a filter will be added to the top of each table column;
            // disabled by using -> headers: { 1: { filter: false } } OR add class="filter-false"
            // if you set this to false, make sure you perform a search using the second method below
            filter_columnFilters: true,
            // if true, allows using "#:{query}" in AnyMatch searches (column:query; added v2.20.0)
            filter_columnAnyMatch: true,
            // extra css class name (string or array) added to the filter element (input or select)
            filter_cellFilter: '',
            // extra css class name(s) applied to the table row containing the filters & the inputs within that row
            // this option can either be a string (class applied to all filters) or an array (class applied to indexed filter)
            filter_cssFilter: '', // or []
            // add a default column filter type "~{query}" to make fuzzy searches default;
            // "{q1} AND {q2}" to make all searches use a logical AND.
            filter_defaultFilter: {},
            // filters to exclude, per column
            filter_excludeFilter: {},
            // jQuery selector (or object) pointing to an input to be used to match the contents of any column
            // please refer to the filter-any-match demo for limitations - new in v2.15
            filter_external: '',
            // class added to filtered rows (rows that are not showing); needed by pager plugin
            filter_filteredRow: 'filtered',
            // ARIA-label added to filter input/select; {{label}} is replaced by the column header
            // "data-label" attribute, if it exists, or it uses the column header text
            filter_filterLabel: 'Filter "{{label}}" column by...',
            // add custom filter elements to the filter row
            // see the filter formatter demos for more specifics
            filter_formatter: null,
            // add custom filter functions using this option
            // see the filter widget custom demo for more specifics on how to use this option
            filter_functions: null,
            // hide filter row when table is empty
            filter_hideEmpty: true,
            // if true, filters are collapsed initially, but can be revealed by hovering over the grey bar immediately
            // below the header row. Additionally, tabbing through the document will open the filter row when an input gets focus
            // in v2.26.6, this option will also accept a function
            filter_hideFilters: true,
            // Set this option to false to make the searches case sensitive
            filter_ignoreCase: true,
            // if true, search column content while the user types (with a delay).
            // In v2.27.3, this option can contain an
            // object with column indexes or classnames; "fallback" is used
            // for undefined columns
            filter_liveSearch: true,
            // global query settings ('exact' or 'match'); overridden by "filter-match" or "filter-exact" class
            filter_matchType: {'input': 'exact', 'select': 'exact'},
            // a header with a select dropdown & this class name will only show available (visible) options within that drop down.
            filter_onlyAvail: 'filter-onlyAvail',
            // default placeholder text (overridden by any header "data-placeholder" setting)
            filter_placeholder: {search: '', select: ''},
            // jQuery selector string of an element used to reset the filters
            filter_reset: 'button.reset',
            // Reset filter input when the user presses escape - normalized across browsers
            filter_resetOnEsc: true,
            // Use the $.tablesorter.storage utility to save the most recent filters (default setting is false)
            filter_saveFilters: false,
            // Delay in milliseconds before the filter widget starts searching; This option prevents searching for
            // every character while typing and should make searching large tables faster.
            filter_searchDelay: 300,
            // allow searching through already filtered rows in special circumstances; will speed up searching in large tables if true
            filter_searchFiltered: true,
            // include a function to return an array of values to be added to the column filter select
            filter_selectSource: null,
            // if true, server-side filtering should be performed because client-side filtering will be disabled, but
            // the ui and events will still be used.
            filter_serversideFiltering: false,
            // Set this option to true to use the filter to find text from the start of the column
            // So typing in "a" will find "albert" but not "frank", both have a's; default is false
            filter_startsWith: false,
            // Filter using parsed content for ALL columns
            // be careful on using this on date columns as the date is parsed and stored as time in seconds
            filter_useParsedData: false,
            // data attribute in the header cell that contains the default filter value
            filter_defaultAttrib: 'data-value',
            // filter_selectSource array text left of the separator is added to the option value, right into the option text
            filter_selectSourceSeparator: '|'
        }
    });
}

function makeTableScroll(id, maxRows) {
    // Constant retrieved from server-side via JSP
    let table = document.getElementById(id);
    let wrapper = table.parentNode;
    let rowsInTable = table.rows.length;
    let height = 0;
    if (rowsInTable > maxRows) {
        for (let i = 0; i < maxRows; i++) {
            height += table.rows[i].clientHeight;
        }
        wrapper.style.height = height + "px";
        wrapper.style.overflow = "auto";
    }
}

/**
 *
 * @param {Date} date
 */
function convertDate(date = null) {
    let response = {
        sYear: date.getFullYear(),
        sMonth: date.getMonth() > 9 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1),
        sDay: date.getDate() >= 10 ? date.getDate() : "0" + date.getDate(),
        iYear: date.getFullYear(),
        iMonth: date.getMonth() + 1,
        iDay: date.getDay(),
        /** dd.MM.yyyy **/
        sDate: undefined,
        /** yyyy-MM-dd **/
        sDate2: undefined,
        /** yyyyMMdd **/
        sDate3: undefined
    };

    response.sDate = `${response.sDay}.${response.sMonth}.${response.sYear}`;
    response.sDate2 = `${response.sYear}-${response.sMonth}-${response.sDay}`;
    response.sDate3 = `${response.sYear}${response.sMonth}${response.sDay}`;

    return response;
}

/**
 * Generate a Dynamic Table with Params
 * parameter: {
 *      tblId: string               // ID of Table ( Without '#'!!!)
 *      layout: Array of String,    // List of Internal Fields
 *      fields: Array of Item       // List of Items
 *      rows: Array of Data         // Response from Server / Database
 * }
 *
 * items: {
 *     header: string,          // Name of Table Header
 *     source: string           // ID of Response Field
 *     type: string             // Table Type ( default String! Use 'bool' to get Checkbox )
 *     html: string             // If Source is undefined, you can set self html code. Parameters in Code can get by [[]]. ( Example: [[id]]) = rows[x].id )
 * }
 * @param {object} myTable Table Params
 * @param setTableSorter
 */
function generateDynamicTable(myTable, setTableSorter = true) {

    $(`#${myTable.tblId}`).trigger('destroy'); // Destroy TableSorter
    let sum = [];

    //#region Set Header
    let myHeader = '<tr>';
    myTable.layout.forEach(layout => {
        let myData = myTable.fields[layout];
        if (myData && myData.header) {
            myHeader += `<th>${myData.header.trim()}</th>`;
        }
    })
    myHeader += '</tr>';
    //#endregion Set Header

    //#region append Header
    let headerLength = $(`#${myTable.tblId} thead tr`).length;
    if ( headerLength === 0 ) {
        $(`#${myTable.tblId} thead tr`).remove();
        $(`#${myTable.tblId} thead`).append(myHeader);
    }
    //#endregion append Header

    // Set Body
    if ( myTable.rows && myTable.rows.length > 0 ) {
        $(`#${myTable.tblId} tbody tr`).remove();
        myTable.rows.forEach(currRow => {
            //if ( (currRow.id > 0 && currRow.id.toString().trim() !== '') ||( currRow.ID > 0 && currRow.ID.toString().trim() !== "" )) {
            if ( (currRow.id && currRow.id.toString().trim() !== '' )
                || ( currRow.ID && currRow.ID.toString().trim() !== '' )
            ) {
                let myRow = '<tr>';

                if ( myTable.rowClick ) {

                    let params = '';
                    if ( myTable.rowClickParams && myTable.rowClickParams.length > 0 ) {
                        myTable.rowClickParams.forEach(myParam => {

                            let curr = myTable.fields[myParam];
                            if ( curr && curr.source !== '' ) {
                                if ( params !== '' ) { params += ','; }
                                params += eval('currRow.' + curr.source);
                            }
                        });
                    }

                    myRow = `<tr onclick=${myTable.rowClick}(${params})>`;
                }
                myTable.layout.forEach(layout => {
                    let myData = myTable.fields[layout];
                    if ( myData && myData.source ) {
                        let tmp = eval('currRow.' + myData.source);
                        // Evtl. Summen zusammenzählen
                        if ( myData.sum && myData.sum === true ) {
                            let curr = sum[layout];
                            if ( !curr ) { curr = 0; sum.push(layout); }
                            if (!tmp) { tmp = 0; }
                            sum[layout] = curr + parseFloat(tmp);
                        }

                        // Evtl. Formatierung
                        tmp = row_format(myData, tmp);
                        myStyle = row_style(myData);
                        myRow += `<td class="${myStyle}">${tmp}</td>`;

                    } else {
                        if ( myData && myData.html) {
                            let tmpHtml = myData.html;
                            myTable.layout.forEach(layout1 => {
                                let myData1 = myTable.fields[layout1];
                                if ( myData1 && myData1.source ) {
                                    let tmp = eval('currRow.' + myData1.source);
                                    tmpHtml = tmpHtml.replaceAll(`[[${layout1.trim()}]]`, tmp);
                                }
                            })
                            myRow += `<td>${tmpHtml}</td>`;
                        }
                    }
                })
                myRow += '</tr>';
                $(`#${myTable.tblId} tbody`).append(myRow);
            }
        });
        if ( sum ) {
            let myRow = '<tr>';
            myTable.layout.forEach(layout => {
                let myData = myTable.fields[layout];
                myRow += '<td>';
                let tmp = sum[layout];
                if ( myData.sum && tmp ) {
                    tmp = row_format(myData, tmp);
                    if ( tmp ) { myRow += tmp; }
                }
                myRow += '</td>';
            })
            myRow += '<tr>';
            $(`#${myTable.tblId} tbody`).append(myRow);

        }
    }
    setTableSorterWithSearch(myTable.tblId);
    $(`#${myTable.tblId}`).trigger('generated');
}

function row_format(myData, tmp) {
    // Evtl. Formatierung
    if ( myData.type ) {
        switch ( myData.type ) {
            case 'N2': tmp = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(tmp); break;
            case 'C2': tmp = new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 2}).format(tmp); break;
            case 'C0': tmp = parseInt(tmp); tmp = new Intl.NumberFormat('de-DE').format(tmp); break;
            case 'P0': tmp = parseInt(tmp); tmp = new Intl.NumberFormat('de-DE', { style: 'percent'}).format(tmp); break;
            case 'P2': tmp = new Intl.NumberFormat('de-DE', { maximumSignificantDigits: 2, style: 'percent'}).format(tmp); break;
            case 'S': tmp = tmp ? tmp.toString().trim() : ''; break;
            case 'bool': tmp = '<input type=checkbox ' + (tmp && (tmp === 1 || tmp === '1' || tmp === true || tmp.toString().trim() === 'J') ? 'checked' : '') + " onclick='return false;'>"; break;
            case 'date': let myDate = convertDate(new Date(tmp)); tmp = myDate.sDate2; break;
            case 'date1': let myDate1 = convertDate(new Date(tmp)); tmp = myDate1.sDate; break;
            case 'date2': let myDate2 = convertDate(new Date(tmp)); tmp = myDate2.sDate2; break;
            case 'date3': let myDate3 = convertDate(new Date(tmp)); tmp = myDate3.sDate3; break;
            default:  break;
        }
    }
    return tmp;
}

function row_style(myData) {
    let response = 'tbl-left';
    if ( myData.style && myData.style !== '' ) { response = myData.style; }
    else {
        if ( myData.type ) {
            switch ( myData.type ) {
                case 'N2': response = 'tbl-right'; break;
                case 'C2': response = 'tbl-right'; break;
                case 'C0': response = 'tbl-right'; break;
                case 'P0': response = 'tbl-right'; break;
                case 'P2': response = 'tbl-right'; break;
                case 'S': response = 'tbl-left'; break;
                case 'bool': response = 'tbl-middle'; break;
                case 'date': response = 'tbl-left'; break;
                case 'date1': response = 'tbl-left'; break;
                case 'date2': response = 'tbl-left'; break;
                case 'date3': response = 'tbl-left'; break;
                default: response = 'tbl-left'; break;
            }
        }
    }
    return response;
}
