// Copyright [2024] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//  http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// @id = ch.banana.africa.cashflow
// @api = 1.0
// @pubdate = 2024-02-16
// @publisher = Banana.ch SA
// @description = 3. Cash Flow Report (OHADA) [BETA]
// @description.fr = 3. Tableau des flux de trésorerie (OHADA) [BETA]
// @task = app.command
// @doctype = 100.100;100.110;130.100
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
// @includejs = reportstructure.js
// @includejs = breport.js
// @includejs = errors.js

var BAN_VERSION = "10.0.1";
var BAN_EXPM_VERSION = "";

//Main function
function exec(string) {

    //Check if we are on an opened document
    if (!Banana.document) {
       return;
    }
 
    //Check the banana version
    var isCurrentBananaVersionSupported = bananaRequiredVersion(BAN_VERSION, BAN_EXPM_VERSION);
    if (!isCurrentBananaVersionSupported) {
       return "@Cancel";
    }
 
    var userParam = initUserParam();
    var savedParam = Banana.document.getScriptSettings();
    if (savedParam && savedParam.length > 0) {
       userParam = JSON.parse(savedParam);
    }
    // If needed show the settings dialog to the user
    if (!options || !options.useLastSettings) {
       userParam = settingsDialog(); // From properties
    }
    if (!userParam) {
       return "@Cancel";
    }

    // PREVIOUS year file: Return the previous year document.
    // If the previous year is not defined or it is not foud it returns null */
    var previous = Banana.document.previousYear();
 
    /**
     * 1. Loads the report structure
     */
    var reportStructure = createReportStructureCashFlow();
 
    /**
     * 2. Calls methods to load balances, calculate totals, format amounts
     * and check entries that can be excluded
     */
    const bReport = new BReport(Banana.document, userParam, reportStructure);
    bReport.validateGroups(userParam.column);
    bReport.loadBalances();
    bReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount", "debitAmount", "creditAmount"]);
    bReport.formatValues(["currentAmount", "previousAmount", "openingAmount", "debitAmount", "creditAmount"]);
    bReport.excludeEntries();
    //Banana.console.log(JSON.stringify(reportStructure, "", " "));
 
    /**
     * 3. Creates the report
     */
    var stylesheet = Banana.Report.newStyleSheet();
    var report = printBalanceSheet(Banana.document, previous, userParam, bReport, stylesheet);
    setCss(Banana.document, stylesheet, userParam);
    Banana.Report.preview(report, stylesheet);
 }

 function printRow(userParam, bReport, table, gr, styleColumnDescription, styleColumnAmount) {
   
    var note = bReport.getObjectNote(gr);
    
    
    tableRow = table.addRow();
    // tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription + " " + styleIndentLevel, 1);
    if(bReport.getObjectType(gr) === 'total') { 
       tableRow.addCell(gr, styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
       tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
       if (note) {
          tableRow.addCell(note, styleColumnDescription + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
       } else {
          tableRow.addCell(" ", "bottom-line", 1).setStyleAttributes("background-color: #C0C0C0");
       }
    } else {
       tableRow.addCell(gr, styleColumnDescription, 1);
       tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription, 1);
       if (note) {
          tableRow.addCell(note, styleColumnDescription, 1);
       } else {
          tableRow.addCell(" ", "bottom-line", 1);
       }
    }
    
    if (bReport.getObjectType(gr) === 'group' || bReport.getObjectType(gr) === 'total') { //do not print amounts for title types
       if(bReport.getObjectType(gr) === 'total') {
          tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
          tableRow.addCell(bReport.getObjectPreviousAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
       } else {
          tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount, 1);
          tableRow.addCell(bReport.getObjectPreviousAmountFormatted(gr), styleColumnAmount, 1);
       }         
    } 
 }

 function printBalanceSheet(current, previous, userParam, bReport, stylesheet) {
    var report = Banana.Report.newReport("Tableau des flux de trésorerie");

    var startDate = userParam.selectionStartDate;
    var endDate = userParam.selectionEndDate;
    var currentYear = Banana.Converter.toDate(current.info("AccountingDataBase", "OpeningDate")).getFullYear();
    var previousYear = currentYear - 1;
    var months = monthDiff(Banana.Converter.toDate(endDate), Banana.Converter.toDate(startDate));

    var company = current.info("AccountingDataBase","Company");
    var address = current.info("AccountingDataBase","Address1");
    var zip = current.info("AccountingDataBase","Zip");
    var city = current.info("AccountingDataBase","City");
    var state = current.info("AccountingDataBase","State");
    var email = current.info("AccountingDataBase","Email");
    var currentStartMonth = Banana.Converter.toDate(startDate).getMonth();
    var currentEndMonth = Banana.Converter.toDate(endDate).getMonth();

    if (previous) {
        var previousStartDate;
        var previousEndDate;
        var previousYear;
        // Accounting period for the previous year file
        if ((currentStartMonth === 0 && currentEndMonth === 11) || 
              (currentStartMonth === 0 && currentEndMonth === 0) || 
              (currentStartMonth === 0 && currentEndMonth === 2) ||
              (currentStartMonth === 0 && currentEndMonth === 5)) {
           previousStartDate = previous.info("AccountingDataBase","OpeningDate");
           previousEndDate = previous.info("AccountingDataBase","ClosureDate");
           previousYear = Banana.Converter.toDate(previousStartDate).getFullYear();
        } else if (currentStartMonth >= 1) {
           for (var i = 1; i < 12; i++) {
              if (currentStartMonth === i && currentEndMonth === i) {
                 previous = current;
                 previousStartDate = new Date(Banana.Converter.toDate(currentStartDate).getFullYear(), currentStartMonth - 1, 1);
                 previousEndDate = new Date(Banana.Converter.toDate(currentStartDate) - 1);
                 break;
              } else if (currentStartMonth === i && currentEndMonth === i+2) {
                 previous = current;
                 previousStartDate = new Date(Banana.Converter.toDate(currentStartDate).getFullYear(), currentStartMonth - 3, 1);
                 previousEndDate = new Date(Banana.Converter.toDate(currentStartDate) - 1);
                 break;
              } else if (currentStartMonth === i && currentEndMonth === i+5) {
                 previous = current;
                 previousStartDate = new Date(Banana.Converter.toDate(currentStartDate).getFullYear(), currentStartMonth - 6, 1);
                 previousEndDate = new Date(Banana.Converter.toDate(currentStartDate) - 1);
                 break;
              }
           }
        }
    }

    // Header of the report
    var table = report.addTable("table");
    var col1 = table.addColumn("c1");
    var col2 = table.addColumn("c2");
    var tableRow;
    tableRow = table.addRow();
    tableRow.addCell(company,"bold",1);
    tableRow.addCell("Exercice clos le " + Banana.Converter.toLocaleDateFormat(endDate), "",1);
    tableRow = table.addRow();
    tableRow.addCell(address + " - " + city + " - " + state, "", 1);
    tableRow.addCell("Durée (en mois) " + months, "", 1);

    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);

    tableRow = table.addRow();
    tableRow.addCell("TABLEAU DES FLUX DE TRESORERIE","bold align-center", 3);
    tableRow = table.addRow();
    tableRow.addCell(" ", "", 3);

    // Table with cash flow data
    var table = report.addTable("table-cash-flow");
    var col1 = table.addColumn("column-cash-flow1");
    var col2 = table.addColumn("column-cash-flow2");
    var col3 = table.addColumn("column-cash-flow3");
    var col4 = table.addColumn("column-cash-flow4");
    var col5 = table.addColumn("column-cash-flow5");
    var tableRow;

    tableRow = table.addRow();
    tableRow.addCell("REF","bold",1);
    tableRow.addCell("LIBELLES","bold",1);
    tableRow.addCell("","bold",1);
    if ((currentStartMonth === 0 && currentEndMonth === 11) || 
                (currentStartMonth === 0 && currentEndMonth === 0) || 
                (currentStartMonth === 0 && currentEndMonth === 2) ||
                (currentStartMonth === 0 && currentEndMonth === 5)) {
        tableRow.addCell("EXERCICE " + currentYear,"bold",1);
    } else if (currentStartMonth >= 1) {
        for (var i =     1; i < 12; i++) {
            if (currentStartMonth === i && currentEndMonth === i) {
                tableRow.addCell("EXERCICE " + getMonthString(currentStartMonth + 1) + " " + currentYear,"bold",1);
                break;
            } else if (currentStartMonth === i && currentEndMonth === i+2) {
                tableRow.addCell("EXERCICE " + getQuarter(currentStartMonth, currentEndMonth) + " " + currentYear,"bold",1);
                break;
            } else if (currentStartMonth === i && currentEndMonth === i+5) {
                tableRow.addCell("EXERCICE " + getSemester(currentStartMonth, currentEndMonth) + " " + currentYear,"bold",1);
                break;
            }
        }
        
    }  
    if (previous) {
        if ((currentStartMonth === 0 && currentEndMonth === 11) || 
              (currentStartMonth === 0 && currentEndMonth === 0) || 
              (currentStartMonth === 0 && currentEndMonth === 2) ||
              (currentStartMonth === 0 && currentEndMonth === 5)) {
           tableRow.addCell("EXERCICE " + previousYear,"bold",1);
        } else if (currentStartMonth >= 1) {
           for (var i = 1; i < 12; i++) {
              if (currentStartMonth === i && currentEndMonth === i) {
                 tableRow.addCell("EXERCICE " + getMonthString(currentStartMonth + 1 - 1) + " " + currentYear,"bold",1);
                 break;
              } else if (currentStartMonth === i && currentEndMonth === i+2) {
                 tableRow.addCell("EXERCICE " + getQuarter(currentStartMonth-3, currentEndMonth-3) + " " + currentYear,"bold",1);
                 break;
              } else if (currentStartMonth === i && currentEndMonth === i+5) {
                 tableRow.addCell("EXERCICE " + getSemester(currentStartMonth-6, currentEndMonth-6) + " " + currentYear,"bold",1);
                 break;
              }
           }
        }
     } else {
        tableRow.addCell("EXERCICE N-1","bold",1);
     }

    /* ZA */
    tableRow = table.addRow();
    tableRow.addCell("ZA", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectDescription("ZA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
    tableRow.addCell(bReport.getObjectNote("ZA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
    tableRow.addCell(bReport.getObjectCurrentAmountFormatted("ZA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    
    /*  */
    tableRow = table.addRow();
    tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell("Flux de trésorerie provenant des activités opérationnelles", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    
    /* FA */
    tableRow = table.addRow();
    tableRow.addCell("FA", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectDescription("FA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectNote("FA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectCurrentAmountFormatted("FA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

    /* FB */
    tableRow = table.addRow();
    var ba = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BA")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BA")));
    // var fb_result = Banana.SDecimal.add();
    tableRow.addCell("FB", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectDescription("FB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectNote("FB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(formatValues(ba), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FB"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FC */
   tableRow = table.addRow();
   var bb = Banana.SDecimal.subtract(Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BB")), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BBA")))), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BB")));
   tableRow.addCell("FC", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(bb), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FC"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FD */
   tableRow = table.addRow();
   var total_bh_bi_bj = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BH")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BI"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BJ")));
   var total_bha_bia_bja = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BHA")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BIA"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BJA")));
   var sub_total_1 = Banana.SDecimal.subtract(total_bh_bi_bj, Banana.SDecimal.invert(total_bha_bia_bja));
   var sub_total_2 = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BU1")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DV3"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BJ7"))));
   var sub_total_3 = Banana.SDecimal.add(Banana.SDecimal.add(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BJ3"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("BJ2")))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("BJ3"))));
   var total_fd = Banana.SDecimal.add(Banana.SDecimal.add(sub_total_1, sub_total_2), sub_total_3);
   tableRow.addCell("FD", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fd), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FD"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FE */
   tableRow = table.addRow();
   var total_di_dj_dk = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DI")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DJ"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DK")));
   var total_dm_dn = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DM")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DN")));
   var sub_total_fe_1 = Banana.SDecimal.add(total_di_dj_dk, total_dm_dn);
   var sub_total_fe_2 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DV1"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DJ1"))));
   var sub_total_fe_3 = Banana.SDecimal.subtract(sub_total_fe_2, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DJ2"))));
   var sub_total_fe_4 = Banana.SDecimal.subtract(sub_total_fe_3, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DM1"))));
   var sub_total_fe_5 = Banana.SDecimal.subtract(sub_total_fe_4, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DM2"))));
   var sub_total_fe_6 = Banana.SDecimal.subtract(sub_total_fe_5, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DM3"))));
   var sub_total_fe_7 = Banana.SDecimal.subtract(sub_total_fe_6, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DM4"))));
   var total_fe = Banana.SDecimal.add(sub_total_fe_1, sub_total_fe_7);
   tableRow.addCell("FE", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fe), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FE"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");

   /*  */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Variation du BF lié aux activités opérationnelles (FB+FC+FD+FE)", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
    
   /* ZB */
   tableRow = table.addRow();
   var sub_total_zb_1 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FA")), ba);
   var sub_total_zb_2 = Banana.SDecimal.add(sub_total_zb_1, bb);
   var sub_total_zb_3 = Banana.SDecimal.add(sub_total_zb_2, total_fd);
   var total_zb = Banana.SDecimal.add(sub_total_zb_3, total_fe);
   tableRow.addCell("ZB", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(total_zb), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZB"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   
   /*  */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Flux de trésorerie provenant des activités d'investissements", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;background-color:#C0C0C0;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FF */
   tableRow = table.addRow();
   var sub_total_ae_af = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AE")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AF")));
   var sub_total_ag_ah = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AG")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AH")));
   var sub_total_ff_1 = Banana.SDecimal.add(sub_total_ae_af, sub_total_ag_ah);
   var sub_total_ff_2 = Banana.SDecimal.subtract(sub_total_ff_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("BJ8")));
   var sub_total_ff_3 = Banana.SDecimal.add(sub_total_ff_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("BJ2")));
   var sub_total_ff_4 = Banana.SDecimal.add(sub_total_ff_3, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DH1"))));
   var sub_total_ff_5 = Banana.SDecimal.subtract(sub_total_ff_4, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DJ1"))));
   var sub_total_ff_6 = Banana.SDecimal.add(sub_total_ff_5, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("DH1")));
   var sub_total_ff_7 = Banana.SDecimal.subtract(sub_total_ff_6, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DH1")));
   var sub_total_ff_8 = Banana.SDecimal.subtract(sub_total_ff_7, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("CE1")));
   var total_ff = Banana.SDecimal.subtract(sub_total_ff_8, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("TF1")));
   tableRow.addCell("FF", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_ff), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FF"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FG */
   tableRow = table.addRow();
   var sub_total_fg_0 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AJ")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AK")));
   var sub_total_fg_1 = Banana.SDecimal.add(sub_total_fg_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AL")));
   var sub_total_fg_2 = Banana.SDecimal.add(sub_total_fg_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AM")));
   var sub_total_fg_3 = Banana.SDecimal.add(sub_total_fg_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AN")));
   var sub_total_fg_4 = Banana.SDecimal.subtract(sub_total_fg_3, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("BJ9")));
   var sub_total_fg_5 = Banana.SDecimal.add(sub_total_fg_4, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("BJ3")));
   var sub_total_fg_6 = Banana.SDecimal.subtract(sub_total_fg_5, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DJ2"))));   
   var sub_total_fg_7 = Banana.SDecimal.add(sub_total_fg_6, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DH2"))));
   var sub_total_fg_8 = Banana.SDecimal.add(sub_total_fg_7, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("DH2")));
   var sub_total_fg_9 = Banana.SDecimal.subtract(sub_total_fg_8, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DH2")));
   var sub_total_fg_10 = Banana.SDecimal.subtract(sub_total_fg_9, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DB")));
   var sub_total_fg_11 = Banana.SDecimal.subtract(sub_total_fg_10, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("CE2")));
   var total_fg = Banana.SDecimal.subtract(sub_total_fg_11, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("TF2")));
   tableRow.addCell("FG", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fg), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FG"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FH */
   tableRow = table.addRow();
   var sub_total_fh_0 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AR")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AS")));
   var sub_total_fh_1 = Banana.SDecimal.subtract(sub_total_fh_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DH3")));
   var sub_total_fh_2 = Banana.SDecimal.subtract(sub_total_fh_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("BU2")));
   var total_fh = Banana.SDecimal.subtract(sub_total_fh_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DV2")));
   tableRow.addCell("FH", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fh), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FH"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FI */
   tableRow = table.addRow();
   var sub_total_fi_0 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("TN")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BA1")));
   var sub_total_fi_1 = Banana.SDecimal.subtract(sub_total_fi_0, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("TH"))));
   var total_fi = Banana.SDecimal.subtract(sub_total_fi_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BI1")));
   tableRow.addCell("FI", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fi), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FI"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FJ */
   tableRow = table.addRow();
   var sub_total_fj_0 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("TN1")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BA2")));
   var sub_total_fj_1 = Banana.SDecimal.add(sub_total_fj_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("AS")));
   var sub_total_fj_2 = Banana.SDecimal.subtract(sub_total_fj_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("BU2")));
   var total_fj = Banana.SDecimal.subtract(sub_total_fj_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("DV2")));
   tableRow.addCell("FJ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fj), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FJ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* ZC */
   tableRow = table.addRow();
   var sub_total_zc_1 = Banana.SDecimal.add(total_ff, total_fg);
   var sub_total_zc_2 = Banana.SDecimal.add(sub_total_zc_1, total_fh);
   var sub_total_zc_3 = Banana.SDecimal.add(sub_total_zc_2, total_fi);
   var total_zc = Banana.SDecimal.add(sub_total_zc_3, total_fj);
   tableRow.addCell("ZC", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(total_zc), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZC"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /*  */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Flux de trésorerie provenant du financement par les capitaux propres", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;background-color:#C0C0C0;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FK */
   tableRow = table.addRow();
   tableRow.addCell("FK", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCreditAmountFormatted("DM1"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FK"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FL */
   tableRow = table.addRow();
   var total_fl = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("BJ6")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("BJ3")));
   tableRow.addCell("FL", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fl), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FL"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FM */
   tableRow = table.addRow();
   tableRow.addCell("FM", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDebitAmountFormatted("DM3"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FM"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FN */
   tableRow = table.addRow();
   tableRow.addCell("FN", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDebitAmountFormatted("DM4"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FN"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* ZD */
   tableRow = table.addRow();
   var sub_total_zd_1 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DM1")), total_fl);
   var sub_total_zd_2 = Banana.SDecimal.add(sub_total_zd_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("DM3")));
   var total_zd = Banana.SDecimal.add(sub_total_zd_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("DM4")));
   tableRow.addCell("ZD", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(total_zd), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZD"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /*  */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Trésorerie provenant du financement par les capitaux étrangers", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;background-color:#C0C0C0;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FO */
   tableRow = table.addRow();
   var sub_total_fo_1 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DA"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("DV4")));
   var total_fo = Banana.SDecimal.subtract(sub_total_fo_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("BU3")));
   tableRow.addCell("FO", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FO"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FO"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fo), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FO"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FP */
   tableRow = table.addRow();
   var sub_total_fp_1 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("DA"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("DV4")));
   var total_fp = Banana.SDecimal.subtract(sub_total_fp_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("BU3")));
   tableRow.addCell("FP", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FP"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FP"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fp), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FP"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FQ */
   tableRow = table.addRow();
   tableRow.addCell("FQ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("FQ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FQ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* ZE */
   tableRow = table.addRow();
   var sub_total_ze_1 = Banana.SDecimal.add(total_fo, total_fp);
   var total_ze = Banana.SDecimal.add(sub_total_ze_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FQ")));
   tableRow.addCell("ZE", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(total_ze), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZE"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* ZF */
   tableRow = table.addRow();
   var total_zf = Banana.SDecimal.add(total_zd, total_ze);
   tableRow.addCell("ZF", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(total_zf), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZF"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* ZG */
   tableRow = table.addRow();
   var sub_total_zg_1 = Banana.SDecimal.add(total_zb, total_zc);
   var total_zg = Banana.SDecimal.add(sub_total_zg_1, total_zf);
   tableRow.addCell("ZG", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;font-weight: bold");
   tableRow.addCell(formatValues(total_zg), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZG"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* ZH */
   tableRow = table.addRow();
   var total_zh = Banana.SDecimal.add(total_zg, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("ZA")));
   tableRow.addCell("ZH", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(total_zh), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("ZH"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   addFooter(report);
    return report;
 }

/**************************************************************************************
*
* Functions that calculate the data for the report
*
**************************************************************************************/
function monthDiff(d1, d2) {
    if (d2 < d1) { 
       var dTmp = d2;
       d2 = d1;
       d1 = dTmp;
    }
    var months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth(); //+1
    months += d2.getMonth();
 
    if (d1.getDate() <= d2.getDate()) {
       months += 1;
    }
    return months;
 }
 
 function formatValues(value,decimals) {
    if (decimals) {
      return Banana.Converter.toLocaleNumberFormat(value,2,true);
    }
    else {
      return Banana.Converter.toLocaleNumberFormat(value,2,true);
    }
  }

  function getMonthString(month) {
    if (!month) {
       return;
    }
    switch (month) {
       case 1: return "JANVIER";
       case 2: return "FÉVRIER";
       case 3: return "MARS";
       case 4: return "AVRIL";
       case 5: return "MAI";
       case 6: return "JUIN";
       case 7: return "JUILLET";
       case 8: return "AOÛT";
       case 9: return "SEPTEMBRE";
       case 10: return "OCTOBRE";
       case 11: return "NOVEMBRE";
       case 12: return "DÉCEMBRE";
       default: return;
    }
 }

 function getQuarter(currentStartMonth, currentEndMonth) {
    if (currentStartMonth === 0 && currentEndMonth === 2) {
       return "Q1";
    } else if (currentStartMonth === 3 && currentEndMonth === 5) {
       return "Q2";
    } else if (currentStartMonth === 6 && currentEndMonth === 8) {
       return "Q3";
    } else if (currentStartMonth === 9 && currentEndMonth === 11) {
       return "Q4";
    }
 }
 
 function getSemester(currentStartMonth, currentEndMonth) {
    if (currentStartMonth === 0 && currentEndMonth === 5) {
       return "S1";
    } else if (currentStartMonth === 6 && currentEndMonth === 11) {
       return "S2";
    }
 }
 
 function checkResults(banDoc, startDate, endDate) {
 
    /* total Actif */
    var objA = banDoc.currentBalance("Gr=A", startDate, endDate);
    currentA = objA.balance;
 
    /* total Passif */
    var objP = banDoc.currentBalance("Gr=P", startDate, endDate);
    currentP = objP.balance;
 
    var res0 = Banana.SDecimal.add(currentA, currentP);
    if (res0 !== "0") {
       Banana.document.addMessage("Différence entre l'actif et le passif.");
    }
 }
 
 function addFooter(report) {
    report.getFooter().addClass("footer");
    report.getFooter().addText("- ", "");
    report.getFooter().addFieldPageNr();
    report.getFooter().addText(" -", "");
 }
 
 function setCss(banDoc, repStyleObj, userParam) {
    var textCSS = "";
    var file = Banana.IO.getLocalFile("file:script/cashflowstyle.css");
    var fileContent = file.read();
    if (!file.errorString) {
       Banana.IO.openPath(fileContent);
       //Banana.console.log(fileContent);
       textCSS = fileContent;
    } else {
       Banana.console.log(file.errorString);
    }
    // Parse the CSS text
    repStyleObj.parse(textCSS);
 }
 
 
 
 
 /**************************************************************************************
  * Functions to manage the parameters
  **************************************************************************************/
 function convertParam(userParam) {
 
    var convertedParam = {};
    convertedParam.version = '1.0';
    convertedParam.data = [];
 
    var currentParam = {};
    currentParam.name = 'logo';
    currentParam.title = "Imprimer le logo de l'en-tête";
    currentParam.type = 'bool';
    currentParam.value = userParam.logo ? true : false;
    currentParam.defaultvalue = false;
    currentParam.readValue = function() {
       userParam.logo = this.value;
    }
    convertedParam.data.push(currentParam);
 
    var currentParam = {};
    currentParam.name = 'logoname';
    currentParam.title = 'Nom du logo (Logo Imposé -> Personnalisation)';
    currentParam.type = 'string';
    currentParam.value = userParam.logoname ? userParam.logoname : 'Logo';
    currentParam.defaultvalue = 'Logo';
    currentParam.readValue = function() {
      userParam.logoname = this.value;
    }
    convertedParam.data.push(currentParam);
 
    currentParam = {};
    currentParam.name = 'printheader';
    currentParam.title = "Imprimer le texte de l'en-tête de la page (Proprieté fichier -> Adresse)";
    currentParam.type = 'bool';
    currentParam.value = userParam.printheader ? true : false;
    currentParam.defaultvalue = false;
    currentParam.readValue = function() {
     userParam.printheader = this.value;
    }
    convertedParam.data.push(currentParam);
 
    currentParam = {};
    currentParam.name = 'printtitle';
    currentParam.title = 'Imprimer le titre';
    currentParam.type = 'bool';
    currentParam.value = userParam.printtitle ? true : false;
    currentParam.defaultvalue = true;
    currentParam.readValue = function() {
     userParam.printtitle = this.value;
    }
    convertedParam.data.push(currentParam);
 
    // var currentParam = {};
    // currentParam.name = 'title';
    // currentParam.title = 'Testo titolo (vuoto = testo predefinito)';
    // currentParam.type = 'string';
    // currentParam.value = userParam.title ? userParam.title : '';
    // currentParam.defaultvalue = '';
    // currentParam.readValue = function() {
    //    userParam.title = this.value;
    // }
    // convertedParam.data.push(currentParam);
 
    var currentParam = {};
    currentParam.name = 'column';
    currentParam.title = "Colonne de regroupement (Nom XML de la colonne)";
    currentParam.type = 'string';
    currentParam.value = userParam.column ? userParam.column : 'Gr1';
    currentParam.defaultvalue = 'Gr1';
    currentParam.readValue = function() {
       userParam.column = this.value;
    }
    convertedParam.data.push(currentParam);
 
    var currentParam = {};
    currentParam.name = 'decimals';
    currentParam.title = 'Enlever les décimales';
    currentParam.type = 'bool';
    currentParam.value = userParam.decimals ? userParam.decimals : false;
    currentParam.defaultvalue = false;
    currentParam.readValue = function() {
       userParam.decimals = this.value;
    }
    convertedParam.data.push(currentParam);
 
    return convertedParam;
 }
 
 function initUserParam() {
    var userParam = {};
    userParam.logo = false;
    userParam.logoname = 'Logo';
    userParam.printheader = false;
    userParam.printtitle = true;
    userParam.title = '';
    userParam.column = 'Gr1';
    userParam.compactprint = false;
    userParam.stampa = true;
    return userParam;
 }
 
 function formatValuesDecimals(value,decimals) {
    if (decimals) {
      return Banana.Converter.toLocaleNumberFormat(value,0,true);
    }
    else {
      return Banana.Converter.toLocaleNumberFormat(value,2,true);
    }
 }
 
 function parametersDialog(userParam) {
    if (typeof(Banana.Ui.openPropertyEditor) !== 'undefined') {
       var dialogTitle = "Paramètres";
       var convertedParam = convertParam(userParam);
       var pageAnchor = 'dlgSettings';
       if (!Banana.Ui.openPropertyEditor(dialogTitle, convertedParam, pageAnchor)) {
          return null;
       }
       for (var i = 0; i < convertedParam.data.length; i++) {
          // Read values to userParam (through the readValue function)
          convertedParam.data[i].readValue();
       }
       //  Reset reset default values
       userParam.useDefaultTexts = false;
    }
 
    return userParam;
 }
 
 function settingsDialog() {
    var userParam = initUserParam();
    var savedParam = Banana.document.getScriptSettings();
    if (savedParam && savedParam.length > 0) {
       userParam = JSON.parse(savedParam);
    }
 
    //We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
    var docStartDate = Banana.document.startPeriod();
    var docEndDate = Banana.document.endPeriod();
 
    //A dialog window is opened asking the user to insert the desired period. By default is the accounting period
    var selectedDates = Banana.Ui.getPeriod('', docStartDate, docEndDate,
       userParam.selectionStartDate, userParam.selectionEndDate, userParam.selectionChecked);
 
    //We take the values entered by the user and save them as "new default" values.
    //This because the next time the script will be executed, the dialog window will contains the new values.
    if (selectedDates) {
       userParam["selectionStartDate"] = selectedDates.startDate;
       userParam["selectionEndDate"] = selectedDates.endDate;
       userParam["selectionChecked"] = selectedDates.hasSelection;
    } else {
       //User clicked cancel
       return null;
    }
 
    userParam = parametersDialog(userParam); // From propertiess
    if (userParam) {
       var paramToString = JSON.stringify(userParam);
       Banana.document.setScriptSettings(paramToString);
    }
 
    return userParam;
 }
 
 
 
 
 
 /**************************************************************************************
  * Check the banana version
  **************************************************************************************/
 function bananaRequiredVersion(requiredVersion, expmVersion) {
    if (expmVersion) {
       requiredVersion = requiredVersion + "." + expmVersion;
    }
    if (Banana.compareVersion && Banana.compareVersion(Banana.application.version, requiredVersion) < 0) {
       Banana.application.showMessages();
       Banana.document.addMessage(getErrorMessage(ID_ERR_VERSION));
       return false;
    }
    else {
       if (Banana.application.license) {
          if (Banana.application.license.licenseType === "professional" || Banana.application.license.licenseType === "advanced") {
             return true;
          }
          else {
             Banana.application.showMessages();
             Banana.document.addMessage(getErrorMessage(ID_ERR_LICENCE_ADVANCED));           
             return false;
          }
       }
    }
 }
 