// Copyright [2023] [Banana.ch SA - Lugano Switzerland]
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
// @id = ch.banana.africa.asblreportsohadardc
// @api = 1.0
// @pubdate = 2023-12-16
// @publisher = Banana.ch SA
// @description = 1. Balance Sheet Report (OHADA) [BETA]
// @description.fr = 1. Bilan (OHADA) [BETA]
// @task = app.command
// @doctype = 100.100;100.110;100.120;100.130;130.100
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
   var reportStructure = createReportStructureBalanceSheet();

   /**
    * 2. Calls methods to load balances, calculate totals, format amounts
    * and check entries that can be excluded
    */
   const bReport = new BReport(Banana.document, userParam, reportStructure);
   bReport.validateGroups(userParam.column);
   bReport.loadBalances();
   bReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
   bReport.excludeEntries();
   //Banana.console.log(JSON.stringify(reportStructure, "", " "));

   /**
    * 3. Creates the report
    */
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printBalanceSheet(Banana.document, userParam, bReport, stylesheet);
   setCss(Banana.document, stylesheet, userParam);
   Banana.Report.preview(report, stylesheet);
}

function printRow(userParam, bReport, table, gr, styleColumnDescription, styleColumnAmount) {

   var note = bReport.getObjectNote(gr);


   tableRow = table.addRow();
   // tableRow.addCell(bReport.getObjectDescription(gr), styleColumnDescription + " " + styleIndentLevel, 1);
   if (bReport.getObjectType(gr) === 'total') {
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
      if (bReport.getObjectType(gr) === 'total') {
         tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
         tableRow.addCell(bReport.getObjectOpeningAmountFormatted(gr), styleColumnAmount + " bold", 1).setStyleAttributes("background-color: #C0C0C0");
      } else {
         tableRow.addCell(bReport.getObjectCurrentAmountFormatted(gr), styleColumnAmount, 1);
         tableRow.addCell(bReport.getObjectOpeningAmountFormatted(gr), styleColumnAmount, 1);
      }
   }
}

function printBalanceSheet(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Bilan");
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
    * ACTIVE
    **************************************************************************************/

   var table = report.addTable("table");
   var column1 = table.addColumn("column1");
   var column2 = table.addColumn("column2");
   var column3 = table.addColumn("column3");

   var tableRow = table.addRow();
   tableRow.addCell(company, "bold", 1);
   tableRow.addCell("Exercice clos le " + Banana.Converter.toLocaleDateFormat(endDate), "", 2);
   tableRow = table.addRow();
   tableRow.addCell(address1 + " - " + city + " - " + state, "", 1);
   tableRow.addCell("Durée (en mois) " + months, "", 2);

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);

   tableRow = table.addRow();
   tableRow.addCell("BILAN ACTIF AU 31 DÉCEMBRE " + currentYear, "bold align-center", 3);

   // Active balancesheet table
   var table = report.addTable("table-active-balancesheet");
   var columnActive1 = table.addColumn("column-active1");
   var columnActive2 = table.addColumn("column-active2");
   var columnActive3 = table.addColumn("column-active3");
   var columnActive4 = table.addColumn("column-active4");
   var columnActive5 = table.addColumn("column-active5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 6);

   tableRow = table.addRow();
   tableRow.addCell("REF", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("ACTIF", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear, "bold align-center", 3).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear, "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("BRUT", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("AMORT. et DEPREC.", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AA */
   tableRow = table.addRow();
   tableRow.addCell("AA", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AA-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AA-(AA-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AA-(AA-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   /* AB */
   tableRow = table.addRow();
   tableRow.addCell("AB", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AB"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AB-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AB-(AB-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AB-(AB-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AC */
   tableRow = table.addRow();
   tableRow.addCell("AC", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AC"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AC-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AC-(AC-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AC-(AC-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AD */
   tableRow = table.addRow();
   tableRow.addCell("AD", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AD"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AD-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AD-(AD-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AD-(AD-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   /* AE */
   tableRow = table.addRow();
   tableRow.addCell("AE", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AE"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AE-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AE-(AE-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AE-(AE-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AF */
   tableRow = table.addRow();
   tableRow.addCell("AF", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AF"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AF-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AF-(AF-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AF-(AF-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AG */
   tableRow = table.addRow();
   tableRow.addCell("AG", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AG"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AG-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AG-(AG-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AG-(AG-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AH */
   tableRow = table.addRow();
   tableRow.addCell("AH", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AH"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AH-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AH-(AH-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AH-(AH-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   /* AI */
   tableRow = table.addRow();
   tableRow.addCell("AI", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AI"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AI-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AI-(AI-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AI-(AI-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AJ */
   tableRow = table.addRow();
   tableRow.addCell("AJ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AJ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AJ-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AJ-(AJ-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AJ-(AJ-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AK */
   tableRow = table.addRow();
   tableRow.addCell("AK", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AK"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AK-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AK-(AK-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AK-(AK-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AL */
   tableRow = table.addRow();
   tableRow.addCell("AL", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AL"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AL-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AL-(AL-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AL-(AL-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AM */
   tableRow = table.addRow();
   tableRow.addCell("AM", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AM"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AM-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AM-(AM-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AM-(AM-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AN */
   tableRow = table.addRow();
   tableRow.addCell("AN", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AN"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AN-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AN-(AN-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AN-(AN-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AO */
   tableRow = table.addRow();
   tableRow.addCell("AO", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AO"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AO"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AO"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AO-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AO-(AO-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AO-(AO-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   /* AX */
   tableRow = table.addRow();
   tableRow.addCell("AX", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AX"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AX"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AX"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AX-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AX-(AX-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AX-(AX-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AY */
   tableRow = table.addRow();
   tableRow.addCell("AY", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AY"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AY"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AY"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AY-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AY-(AY-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AY-(AY-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AZ */
   tableRow = table.addRow();
   tableRow.addCell("AZ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AZ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("AZ-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AZ-(AZ-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("AZ-(AZ-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   /* BA */
   tableRow = table.addRow();
   tableRow.addCell("BA", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BA-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BA-(BA-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BA-(BA-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BB */
   tableRow = table.addRow();
   tableRow.addCell("BB", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BB"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BB-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BB-(BB-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BB-(BB-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BC */
   tableRow = table.addRow();
   tableRow.addCell("BC", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BC"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BC-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BC-(BC-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BC-(BC-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BD */
   tableRow = table.addRow();
   tableRow.addCell("BD", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BD"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BD-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BD-(BD-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BD-(BD-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BE */
   tableRow = table.addRow();
   tableRow.addCell("BE", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BE"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BE-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BE-(BE-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BE-(BE-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BT */
   tableRow = table.addRow();
   tableRow.addCell("BT", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("BT"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("BT"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BT"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BT-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BT-(BT-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BT-(BT-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   /* BU */
   tableRow = table.addRow();
   tableRow.addCell("BU", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BU"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BU"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BU"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BU-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BU-(BU-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BU-(BU-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BV */
   tableRow = table.addRow();
   tableRow.addCell("BV", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BV"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BV"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BV"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BV-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BV-(BV-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BV-(BV-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BW */
   tableRow = table.addRow();
   tableRow.addCell("BW", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BW"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BW"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BW"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BW-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BW-(BW-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BW-(BW-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BX */
   tableRow = table.addRow();
   tableRow.addCell("BX", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("BX"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("BX"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BX"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BX-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BX-(BX-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BX-(BX-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   /* BY */
   tableRow = table.addRow();
   tableRow.addCell("BY", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BY"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BY"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BY"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BY-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BY-(BY-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BY-(BY-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* BZ */
   tableRow = table.addRow();
   tableRow.addCell("BZ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("BZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("BZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BZ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BZ-A"))), 2), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BZ-(BZ-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectOpeningAmountFormatted("BZ-(BZ-A)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

   if (userParam.stampa) {
      report.addPageBreak();

      if (userParam.printtitle) {
         report.addParagraph(" ", "");
         // report.addParagraph(title, "heading2");
         report.addParagraph(" ", "");
      }
   } else {
      report.addParagraph(" ", "");
      report.addParagraph(" ", "");
   }
   /**************************************************************************************
    * PASSIVE
    **************************************************************************************/
   var table = report.addTable("table");
   var column1 = table.addColumn("column1");
   var column2 = table.addColumn("column2");
   var column3 = table.addColumn("column3");

   var tableRow = table.addRow();
   tableRow.addCell(company, "bold", 1);
   tableRow.addCell("Exercice clos le " + Banana.Converter.toLocaleDateFormat(endDate), "", 2);
   tableRow = table.addRow();
   tableRow.addCell(address1 + " - " + city + " - " + state, "", 1);
   tableRow.addCell("Durée (en mois) " + months, "", 2);

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);

   tableRow = table.addRow();
   tableRow.addCell("BILAN PASSIF AU 31 DÉCEMBRE " + currentYear, "bold align-center", 3);

   // Passive balancesheet table
   var table = report.addTable("table-passive-balancesheet");
   var columnActive1 = table.addColumn("column-passive1");
   var columnActive2 = table.addColumn("column-passive2");
   var columnActive3 = table.addColumn("column-passive3");
   var columnActive4 = table.addColumn("column-passive4");
   var columnActive5 = table.addColumn("column-passive5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 5);

   tableRow = table.addRow();
   tableRow.addCell("REF", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("PASSIF", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note", "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear, "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear, "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("", "", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET", "bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET", "bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* CA */
   printRow(userParam, bReport, table, "CA", "description-groups", "amount-groups");
   /* CB */
   printRow(userParam, bReport, table, "CB", "description-groups", "amount-groups");
   /* CC */
   printRow(userParam, bReport, table, "CC", "description-groups", "amount-groups");
   /* CD */
   printRow(userParam, bReport, table, "CD", "description-groups", "amount-groups");
   /* CE */
   printRow(userParam, bReport, table, "CE", "description-groups", "amount-groups");
   /* CF */
   printRow(userParam, bReport, table, "CF", "description-groups", "amount-groups");
   /* CG */
   printRow(userParam, bReport, table, "CG", "description-groups", "amount-groups");
   /* CH */
   printRow(userParam, bReport, table, "CH", "description-groups", "amount-groups");
   /* CI */
   printRow(userParam, bReport, table, "CI", "description-groups", "amount-groups");
   /* CJ */
   printRow(userParam, bReport, table, "CJ", "description-groups", "amount-groups");
   /* CK */
   printRow(userParam, bReport, table, "CK", "description-groups", "amount-groups-totals");
   /* CW */
   printRow(userParam, bReport, table, "CW", "description-groups", "amount-groups");
   /* CX */
   printRow(userParam, bReport, table, "CX", "description-groups", "amount-groups");
   /* CY */
   printRow(userParam, bReport, table, "CY", "description-groups", "amount-groups-totals");
   /* CZ */
   printRow(userParam, bReport, table, "CZ", "description-groups", "amount-groups-totals");
   /* DA */
   printRow(userParam, bReport, table, "DA", "description-groups", "amount-groups");
   /* DB */
   printRow(userParam, bReport, table, "DB", "description-groups", "amount-groups");
   /* DC */
   printRow(userParam, bReport, table, "DC", "description-groups", "amount-groups");
   /* DD */
   printRow(userParam, bReport, table, "DD", "description-groups", "amount-groups-totals");
   /* DE */
   printRow(userParam, bReport, table, "DE", "description-groups", "amount-groups-totals");
   /* DF */
   printRow(userParam, bReport, table, "DF", "description-groups", "amount-groups");
   /* DG */
   printRow(userParam, bReport, table, "DG", "description-groups", "amount-groups");
   /* DH */
   printRow(userParam, bReport, table, "DH", "description-groups", "amount-groups");
   /* DI */
   printRow(userParam, bReport, table, "DI", "description-groups", "amount-groups");
   /* DV */
   printRow(userParam, bReport, table, "DV", "description-groups", "amount-groups-totals");
   /* DW */
   printRow(userParam, bReport, table, "DW", "description-groups", "amount-groups");
   /* DX */
   printRow(userParam, bReport, table, "DX", "description-groups", "amount-groups-totals");
   /* DY */
   printRow(userParam, bReport, table, "DY", "description-groups", "amount-groups");
   /* DZ */
   printRow(userParam, bReport, table, "DZ", "description-groups", "amount-groups-totals");






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

function formatValues(value, decimals) {
   if (decimals) {
      return Banana.Converter.toLocaleNumberFormat(value, 2, true);
   }
   else {
      return Banana.Converter.toLocaleNumberFormat(value, 2, true);
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
   var file = Banana.IO.getLocalFile("file:script/balancesheetstyle.css");
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
   currentParam.value = userParam.column ? userParam.column : 'Gr1';
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
   userParam.compactprint = false;
   userParam.stampa = true;
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

function parametersDialog(userParam) {
   if (typeof (Banana.Ui.openPropertyEditor) !== 'undefined') {
      var dialogTitle = "Paramètres";
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
