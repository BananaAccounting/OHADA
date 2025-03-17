// Copyright [2025] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.africa.schoolinspection
// @api = 1.0
// @pubdate = 2025-03-08
// @publisher = Banana.ch SA
// @description = School Inspection Accounting Reports (OHADA) [BETA]
// @description.fr = Rapports Financiers Inspection Provinciale (OHADA) [BETA]
// @task = app.command
// @doctype = 100.100;100.110;130.100
// @docproperties = 
// @outputformat = none
// @inputdatasource = none
// @timeout = -1
// @includejs = reportstructure.js
// @includejs = breport.js
// @includejs = errors.js


/*

   

*/


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

   /**
    * 1. Loads the report structure
    */
   var reportStructure = createReportStructureFinancialReport();

   /**
    * 2. Calls methods to load balances, calculate totals, format amounts
    * and check entries that can be excluded
    */
   const bReport = new BReport(Banana.document, userParam, reportStructure);
   bReport.validateGroups(userParam.column);
   bReport.loadBalances();
   bReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
   //Banana.console.log(JSON.stringify(reportStructure, "", " "));

   /**
    * 3. Creates the report
    */
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printfinancialreport(Banana.document, userParam, bReport, stylesheet);
   setCss(Banana.document, stylesheet, userParam);

   Banana.Report.preview(report, stylesheet);
}

// function exec(string) {
//    if (!Banana.document) {
//        return;
//    }

//    var isCurrentBananaVersionSupported = bananaRequiredVersion(BAN_VERSION, BAN_EXPM_VERSION);
//    if (!isCurrentBananaVersionSupported) {
//        return "@Cancel";
//    }

//    // Calculate for the year 2025, months 1-12
//    var results = calculateMonthlyReports(2025, 1, 2025, 12);
   
//    // Create a report to display all monthly results
//    var report = Banana.Report.newReport("Monthly Financial Reports 2025");
//    var table = report.addTable("table");
   
//    // Add headers
//    var tableRow = table.addRow();
//    tableRow.addCell("Period", "header");
//    tableRow.addCell("Opening Amount", "header");
//    tableRow.addCell("Total Recettes", "header");
//    tableRow.addCell("Total Soldes", "header");
   
//    // Add data rows
//    results.forEach(function(monthResult) {
//        var row = table.addRow();
//        row.addCell(monthResult.period);
//        row.addCell(formatValuesDecimals(monthResult.openingAmount));
//        row.addCell(formatValuesDecimals(monthResult.totalRecettes));
//        row.addCell(formatValuesDecimals(monthResult.totalSoldes));
//    });
   
//    // Preview the report
//    var stylesheet = Banana.Report.newStyleSheet();
//    setCss(Banana.document, stylesheet, initUserParam());
//    Banana.Report.preview(report, stylesheet);
// }

function printfinancialreport(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Rapport Financier");
   var startDate = userParam.selectionStartDate;
   var endDate = userParam.selectionEndDate;
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;
   var months = monthDiff(Banana.Converter.toDate(endDate), Banana.Converter.toDate(startDate));

   var company = banDoc.info("AccountingDataBase", "Company");
   var address1 = banDoc.info("AccountingDataBase", "Address1");
   var zip = banDoc.info("AccountingDataBase", "Zip");
   var city = banDoc.info("AccountingDataBase", "City");
   var state = banDoc.info("AccountingDataBase", "State");
   var email = banDoc.info("AccountingDataBase", "Email");


   /**************************************************************************************
   * RAPPORT FINANCIER
   **************************************************************************************/
   var table = report.addTable("table");
   var column1 = table.addColumn("column1");
   var column2 = table.addColumn("column2");
   var column3 = table.addColumn("column3");

   var headerLogoSection = report.addSection("");
   var logoFormat = Banana.Report.logoFormat("Logo"); 
   
   // Banana.console.log("Logo format found " + logoFormat);
   //    Banana.console.log("logoFormat: " + Banana.Report.logoFormatsNames());

   if (logoFormat) {
      // Use the format as defined in the dialog File --> Logo Setup   
      var logoElement = logoFormat.createDocNode(headerLogoSection, stylesheet, "logo"); 
      report.getHeader().addChild(logoElement); } 
   else {
         // If the format 'logo' is not defined, insert an image   
         // report.addImage("documents:logo", "logoStyle"); 
   } 

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);

   tableRow = table.addRow();
   tableRow.addCell(company, "bold align-center", 3);
   tableRow = table.addRow();
   tableRow.addCell("RAPPORT FINANCIER", "bold align-center", 3);
   tableRow = table.addRow();
   tableRow.addCell("DU " + Banana.Converter.toLocaleDateFormat(startDate) + " AU " + Banana.Converter.toLocaleDateFormat(endDate), "bold align-center", 3);

   tableRow = table.addRow();
   tableRow.addCell("", "", 3);
   tableRow = table.addRow();
   tableRow.addCell("", "", 3);

   // Profit & Loss table
   var table = report.addTable("table-financial-report");
   var columnFinancialReport1 = table.addColumn("column-financial-report1");
   var columnFinancialReport2 = table.addColumn("column-financial-report2");
   var columnFinancialReport3 = table.addColumn("column-financial-report3");

   // var openingAmount = 0;

   tableRow = table.addRow();
   tableRow.addCell("I", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("RECETTES", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("MONTANT", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   
   // if (Banana.Converter.toDate(startDate).getMonth() === 2 && Banana.Converter.toDate(endDate).getMonth() === 2) {
   //    Banana.console.log("February");
   //    Banana.console.log(JSON.stringify(banDoc.currentBalance("P", startDate, endDate)));
   // }
//    var monthlyResults = calculateMonthlyReports(2025, 1, 2025, 12);
// var februaryResult = monthlyResults[1]; // Index 1 for February
// Banana.console.log("February opening amount: " + februaryResult.openingAmount);
// Banana.console.log("February total soldes: " + februaryResult.totalSoldes);
    var openingAmount = calculateOpeningAmount(banDoc, startDate, endDate);


   /* SI */
    tableRow = table.addRow();
   //  var openingAmount = banDoc.table("Accounts").row(0).value("Opening") ? banDoc.table("Accounts").row(0).value("Opening") : banDoc.table("Accounts").row(1).value("Opening");
    tableRow.addCell(bReport.getObjectId("SI"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
    tableRow.addCell(bReport.getObjectDescription("SI"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
    tableRow.addCell(formatValuesDecimals(openingAmount), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* RFF1 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RFF1"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RFF1"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RFF1"), "align-right", 1);

   /* RFF2 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RFF2"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RFF2"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RFF2"), "align-right", 1);

   /* RFF3 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RFF3"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RFF3"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RFF3"), "align-right", 1);

   /* A */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("A"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("A"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("A"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* REX1 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("REX1"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("REX1"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("REX1"), "align-right", 1);

   /* REX2 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("REX2"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("REX2"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("REX2"), "align-right", 1);

   /* REX3 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("REX3"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("REX3"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("REX3"), "align-right", 1);

   /* REX4 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("REX4"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("REX4"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("REX4"), "align-right", 1);

   /* B */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("B"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("B"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("B"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* RTENA01 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RTENA01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RTENA01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RTENA01"), "align-right", 1);

   /* RTENA02 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RTENA02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RTENA02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RTENA02"), "align-right", 1);

   /* RTENA03 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RTENA03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RTENA03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RTENA03"), "align-right", 1);

   /* RTENA04 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RTENA04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RTENA04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RTENA04"), "align-right", 1);

   /* RTENA05 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RTENA05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RTENA05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RTENA05"), "align-right", 1);

   /* C */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("C"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("C"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("C"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* RDLS */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RDLS"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RDLS"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RDLS"), "align-right", 1);

   /* RAUTO */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RAUTO"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RAUTO"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RAUTO"), "align-right", 1);

   /* RDLSA */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RDLSA"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RDLSA"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RDLSA"), "align-right", 1);

   /* D */
   tableRow = table.addRow();
   var totalRecettes1 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(openingAmount), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("A")));
   var totalRecettes2 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("B")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("C")));
   var totalRecettes3 = Banana.SDecimal.add(totalRecettes1, totalRecettes2);
   var totalRecettes = Banana.SDecimal.add(totalRecettes3, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RDLSA")));
   tableRow.addCell(bReport.getObjectId("D"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("D"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(formatValuesDecimals(totalRecettes), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   tableRow = table.addRow();
   tableRow.addCell("II", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("DEPENSES", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");

   /* DFF1 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF1"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF1"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF1"), "align-right", 1);

   /* DFF2 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF2"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF2"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF2"), "align-right", 1);

   /* DFF3 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF3"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF3"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF3"), "align-right", 1);

   /* DFF4 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF4"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF4"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF4"), "align-right", 1);

   /* DFF5 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF5"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF5"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF5"), "align-right", 1);

   /* DFF6 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF6"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF6"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF6"), "align-right", 1);

   /* DFF7 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF7"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF7"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF7"), "align-right", 1);

   /* DFF8 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF8"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF8"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF8"), "align-right", 1);

   /* DFF9 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF9"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF9"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF9"), "align-right", 1);

   /* DFF10 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF10"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF10"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF10"), "align-right", 1);

   /* DFF11 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF11"), "align-right", 1);

   /* DFF12 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF12"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF12"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF12"), "align-right", 1);

   /* DFF13 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF13"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF13"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF13"), "align-right", 1);

   /* DFF14 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF14"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF14"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF14"), "align-right", 1);

   /* E */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("E"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("E"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("E"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DEX11 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX11"), "align-right", 1);

   /* DEX12 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX12"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX12"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX12"), "align-right", 1);

   /* DEX13 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX13"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX13"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX13"), "align-right", 1);

   /* DEX14 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX14"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX14"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX14"), "align-right", 1);

   /* DEX15 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX15"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX15"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX15"), "align-right", 1);

   /* DEX16 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX16"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX16"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX16"), "align-right", 1);

   /* DEX17 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX17"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX17"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX17"), "align-right", 1);

   /* F */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("F"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("F"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("F"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DEX21 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX21"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX21"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX21"), "align-right", 1);

   /* DEX22 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX22"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX22"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX22"), "align-right", 1);

   /* DEX23 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX23"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX23"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX23"), "align-right", 1);

   /* DEX24 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX24"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX24"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX24"), "align-right", 1);

   /* DEX25 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX25"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX25"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX25"), "align-right", 1);

   /* DEX26 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX26"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX26"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX26"), "align-right", 1);

   /* DEX27 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX27"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX27"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX27"), "align-right", 1);

   /* G */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("G"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("G"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("G"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DEX310 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX310"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX310"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX310"), "align-right", 1);

   /* DEX311 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX311"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX311"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX311"), "align-right", 1);

   /* DEX312 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX312"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX312"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX312"), "align-right", 1);

   /* DEX313 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX313"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX313"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX313"), "align-right", 1);

   /* DEX314 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX314"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX314"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX314"), "align-right", 1);

   /* DEX315 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX315"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX315"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX315"), "align-right", 1);

   /* DEX316 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX316"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX316"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX316"), "align-right", 1);

   /* DEX317 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX317"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX317"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX317"), "align-right", 1);

   /* DEX318 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX318"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX318"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX318"), "align-right", 1);

   /* H */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("H"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("H"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("H"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DEX410 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX410"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX410"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX410"), "align-right", 1);

   /* DEX411 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX411"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX411"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX411"), "align-right", 1);

   /* DEX412 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX412"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX412"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX412"), "align-right", 1);

   /* DEX413 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX413"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX413"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX413"), "align-right", 1);

   /* DEX414 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX414"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX414"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX414"), "align-right", 1);

   /* DEX415 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX415"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX415"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX415"), "align-right", 1);

   /* DEX416 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX416"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX416"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX416"), "align-right", 1);

   /* DEX417 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX417"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX417"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX417"), "align-right", 1);

   /* DEX418 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX418"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX418"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX418"), "align-right", 1);

   /* DEX419 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX419"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX419"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX419"), "align-right", 1);

   /* DEX420 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DEX420"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DEX420"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DEX420"), "align-right", 1);

   /* I */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("I"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("I"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("I"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* J */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("J"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("J"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("J"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DTENA01 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA01"), "align-right", 1);

   /* DTENA02 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA02"), "align-right", 1);

   /* DTENA03 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA03"), "align-right", 1);

   /* DTENA04 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA04"), "align-right", 1);

   /* DTENA05 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA05"), "align-right", 1);

   /* DTENA06 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA06"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA06"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA06"), "align-right", 1);

   /* DTENA07 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA07"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA07"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA07"), "align-right", 1);

   /* DTENA08 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA08"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA08"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA08"), "align-right", 1);

   /* DTENA09 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA09"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA09"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA09"), "align-right", 1);

   /* DTENA10 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA10"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA10"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA10"), "align-right", 1);

   /* DTENA11 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DTENA11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DTENA11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DTENA11"), "align-right", 1);

   /* K */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("K"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("K"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("K"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DDLS */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DDLS"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DDLS"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DDLS"), "align-right", 1);

   /* DAUT */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAUT"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAUT"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAUT"), "align-right", 1);

   /* DDLSA */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DDLSA"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("DDLSA"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DDLSA"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* L */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("L"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("L"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("L"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* M */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("M"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("M"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("M"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* N */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("N"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("N"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("N"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* O */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("O"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("O"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("O"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* P */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("P"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("P"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("P"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* Q */
   tableRow = table.addRow();
   var totalSoldes = Banana.SDecimal.subtract(totalRecettes, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("L")));
   tableRow.addCell(bReport.getObjectId("Q"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("Q"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(formatValuesDecimals(totalSoldes), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");


   //addFooter(report);
   return report;
}

// function calculateOpeningAmount(banDoc, selectedStartDate, selectedEndDate) {
//    // Convert dates to Date objects
//    const startDate = Banana.Converter.toDate(selectedStartDate);
//    const endDate = Banana.Converter.toDate(selectedEndDate);
   
//    // If it's January or first month of fiscal year, get from Accounts table
//    if (startDate.getMonth() === 0) { // January
//        return banDoc.table("Accounts").row(0).value("Opening") ? 
//               banDoc.table("Accounts").row(0).value("Opening") : 
//               banDoc.table("Accounts").row(1).value("Opening");
//    }
   
//    // For other months, calculate previous month's totalSoldes
//    const previousMonthEnd = new Date(startDate.getFullYear(), startDate.getMonth(), 0);
//    const previousMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
   
//    // Format dates for Banana
//    const prevStart = Banana.Converter.toLocaleDateFormat(previousMonthStart);
//    const prevEnd = Banana.Converter.toLocaleDateFormat(previousMonthEnd);
   
//    // Calculate previous month's totalSoldes
//    const userParam = initUserParam();
//    userParam.selectionStartDate = prevStart;
//    userParam.selectionEndDate = prevEnd;
//    Banana.console.log(prevStart + " - " + prevEnd);
   
//    const reportStructure = createReportStructureFinancialReport();
//    const bReport = new BReport(banDoc, userParam, reportStructure);
   
//    bReport.validateGroups(userParam.column);
//    bReport.loadBalances();
//    bReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
//    bReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
   
//    // Calculate totalRecettes and totalSoldes for previous month
//    const prevOpeningAmount = banDoc.table("Accounts").row(0).value("Opening") ? 
//                            banDoc.table("Accounts").row(0).value("Opening") : 
//                            banDoc.table("Accounts").row(1).value("Opening");
   
//    const totalRecettes1 = Banana.SDecimal.add(
//        Banana.Converter.toInternalNumberFormat(prevOpeningAmount),
//        Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("A"))
//    );
   
//    const totalRecettes2 = Banana.SDecimal.add(
//        Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("B")),
//        Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("C"))
//    );
   
//    const totalRecettes = Banana.SDecimal.add(totalRecettes1, totalRecettes2);
   
//    const totalSoldes = Banana.SDecimal.subtract(
//        totalRecettes,
//        Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("J"))
//    );
   
//    return totalSoldes;
// }

function calculateOpeningAmount(banDoc, selectedStartDate, selectedEndDate) {
   // Convert dates to Date objects
   const startDate = Banana.Converter.toDate(selectedStartDate);
   // const firstDayOfYear = new Date(startDate.getFullYear(), 0, 1);
   
   // If January, get from Accounts table
   if (startDate.getMonth() === 0) {
       const accountsOpening = banDoc.table("Accounts").row(0).value("Opening") ? 
           banDoc.table("Accounts").row(0).value("Opening") : 
           banDoc.table("Accounts").row(1).value("Opening");
      //  Banana.console.log("January - Using opening amount from Accounts table: " + accountsOpening);
       return accountsOpening;
   }
   else {
   
   // Calculate previous month's period
   const previousMonthEnd = new Date(startDate.getFullYear(), startDate.getMonth(), 0);
   const previousMonthStart = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
   // Banana.console.log("Previous month period: " + previousMonthStart + " to " + previousMonthEnd);
   
   // Format dates for Banana
   const prevStart = Banana.Converter.toLocaleDateFormat(previousMonthStart);
   const prevEnd = Banana.Converter.toLocaleDateFormat(previousMonthEnd);
   // prevStart = Banana.Converter.toInternalDateFormat(prevStart);
   // prevEnd = Banana.Converter.toInternalDateFormat(prevEnd);
   // Banana.console.log("Calculating opening amount for: " + Banana.Converter.toLocaleDateFormat(startDate));
   // Banana.console.log("Using previous month period: " + prevStart + " to " + prevEnd);

   // Get previous month's report
   const prevParam = initUserParam();
   prevParam.selectionStartDate = Banana.Converter.toInternalDateFormat(prevStart);
   prevParam.selectionEndDate = Banana.Converter.toInternalDateFormat(prevEnd);
   // Banana.console.log("Previous month's report period: " + prevParam.selectionStartDate + " to " + prevParam.selectionEndDate);
   
   // Calculate previous month's opening amount recursively
   const prevOpeningAmount = calculateOpeningAmount(banDoc, Banana.Converter.toInternalDateFormat(prevStart), Banana.Converter.toInternalDateFormat(prevEnd));
   
   const reportStructure = createReportStructureFinancialReport();
   const prevReport = new BReport(banDoc, prevParam, reportStructure);
   
   prevReport.validateGroups(prevParam.column);
   prevReport.loadBalances();
   prevReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
   prevReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
   
   // Calculate previous month's totalRecettes
   const totalRecettes1 = Banana.SDecimal.add(
       Banana.Converter.toInternalNumberFormat(prevOpeningAmount),
       Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("A"))
   );
   
   const totalRecettes2 = Banana.SDecimal.add(
       Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("B")),
       Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("C"))
   );
   
   const totalRecettes3 = Banana.SDecimal.add(totalRecettes1, totalRecettes2);

   const totalRecettes = Banana.SDecimal.add(totalRecettes3, Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("RDLSA")));
   
   // Calculate previous month's totalSoldes
   const totalSoldes = Banana.SDecimal.subtract(
       totalRecettes,
       Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("L"))
   );
   
   // Banana.console.log("Previous month's totalSoldes: " + totalSoldes);
   return totalSoldes;
   }
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

function checkResults(banDoc, startDate, endDate) {
}

function addFooter(report) {
   report.getFooter().addClass("footer");
   report.getFooter().addText("- ", "");
   report.getFooter().addFieldPageNr();
   report.getFooter().addText(" -", "");
}


/**************************************************************************************
 * Styles
 **************************************************************************************/
function setCss(banDoc, repStyleObj, userParam) {
   var textCSS = "";
   var file = Banana.IO.getLocalFile("file:script/financialreport.css");
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
   currentParam.readValue = function () {
      userParam.logo = this.value;
   }
   convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'logoname';
   currentParam.title = 'Nom du logo (Logo Imposé -> Personnalisation)';
   currentParam.type = 'string';
   currentParam.value = userParam.logoname ? userParam.logoname : 'Logo';
   currentParam.defaultvalue = 'Logo';
   currentParam.readValue = function () {
      userParam.logoname = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'printheader';
   currentParam.title = "Imprimer le texte de l'en-tête de la page (Proprieté fichier -> Adresse)";
   currentParam.type = 'bool';
   currentParam.value = userParam.printheader ? true : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function () {
      userParam.printheader = this.value;
   }
   convertedParam.data.push(currentParam);

   currentParam = {};
   currentParam.name = 'printtitle';
   currentParam.title = 'Imprimer le titre';
   currentParam.type = 'bool';
   currentParam.value = userParam.printtitle ? true : false;
   currentParam.defaultvalue = true;
   currentParam.readValue = function () {
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
   currentParam.value = userParam.column ? userParam.column : 'Gr';
   currentParam.defaultvalue = 'Gr1';
   currentParam.readValue = function () {
      userParam.column = this.value;
   }
   convertedParam.data.push(currentParam);

   var currentParam = {};
   currentParam.name = 'decimals';
   currentParam.title = 'Enlever les décimales';
   currentParam.type = 'bool';
   currentParam.value = userParam.decimals ? userParam.decimals : false;
   currentParam.defaultvalue = false;
   currentParam.readValue = function () {
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
   return userParam;
}

function parametersDialog(userParam) {
   if (typeof (Banana.Ui.openPropertyEditor) !== 'undefined') {
      var dialogTitle = "Parametri";
      var convertedParam = convertParam(userParam);
      var pageAnchor = 'ch.banana.africa.asblreportsohadardc';
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

function formatValuesDecimals(value, decimals) {
   if (decimals) {
      return Banana.Converter.toLocaleNumberFormat(value, 0, true);
   }
   else {
      return Banana.Converter.toLocaleNumberFormat(value, 2, true);
   }
}

// function calculateMonthlyReports(startYear, startMonth, endYear, endMonth) {
//    var monthlyResults = [];
//    var previousMonthSoldes = 0;
   
//    for (var year = startYear; year <= endYear; year++) {
//        var monthStart = (year === startYear) ? startMonth : 1;
//        var monthEnd = (year === endYear) ? endMonth : 12;
       
//        for (var month = monthStart; month <= monthEnd; month++) {
//            // Calculate start and end dates for current month
//            var startDate = new Date(year, month - 1, 1);
//            var endDate = new Date(year, month, 0);
           
//            var formattedStartDate = Banana.Converter.toLocaleDateFormat(startDate);
//            var formattedEndDate = Banana.Converter.toLocaleDateFormat(endDate);
           
//            // Initialize parameters for current month
//            var userParam = initUserParam();
//            userParam.selectionStartDate = formattedStartDate;
//            userParam.selectionEndDate = formattedEndDate;
           
//            // Create report structure
//            var reportStructure = createReportStructureFinancialReport();
//            const bReport = new BReport(Banana.document, userParam, reportStructure);
           
//            // Set opening amount to previous month's totalSoldes
//            bReport.openingAmount = previousMonthSoldes;
           
//            // Calculate report for current month
//            bReport.validateGroups(userParam.column);
//            bReport.loadBalances();
//            bReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
//            bReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
           
//            // Calculate totalRecettes and totalSoldes for current month
//            var totalRecettes1 = Banana.SDecimal.add(
//                Banana.Converter.toInternalNumberFormat(bReport.openingAmount), 
//                Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("A"))
//            );
//            var totalRecettes2 = Banana.SDecimal.add(
//                Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("B")), 
//                Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("C"))
//            );
//            var totalRecettes = Banana.SDecimal.add(totalRecettes1, totalRecettes2);
           
//            var totalSoldes = Banana.SDecimal.subtract(
//                totalRecettes, 
//                Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("J"))
//            );
           
//            // Store results
//            monthlyResults.push({
//                period: `${year}-${month.toString().padStart(2, '0')}`,
//                startDate: formattedStartDate,
//                endDate: formattedEndDate,
//                openingAmount: bReport.openingAmount,
//                totalRecettes: totalRecettes,
//                totalSoldes: totalSoldes
//            });
           
//            // Store current month's totalSoldes for next month's opening amount
//            previousMonthSoldes = totalSoldes;
//        }
//    }
   
//    return monthlyResults;
// }

function settingsDialog() {
   var userParam = initUserParam();
   var savedParam = Banana.document.getScriptSettings();
   if (savedParam && savedParam.length > 0) {
      userParam = JSON.parse(savedParam);
   }

   //We take the accounting "starting date" and "ending date" from the document. These will be used as default dates
   var docStartDate = Banana.document.startPeriod();
   var docEndDate = Banana.document.endPeriod();
   userParam.selectionStartDate = docStartDate;
   userParam.selectionEndDate = docEndDate;

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
         if (Banana.application.license.licenseType === "advanced") {
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
