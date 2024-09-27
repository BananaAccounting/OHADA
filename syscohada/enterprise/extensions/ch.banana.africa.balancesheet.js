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
// @id = ch.banana.africa.balancesheet
// @api = 1.0
// @pubdate = 2024-02-14
// @publisher = Banana.ch SA
// @description = 1. Balance Sheet Report (OHADA) [BETA]
// @description.fr = 1. Bilan (OHADA) [BETA]
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
   var reportStructure = createReportStructureBalanceSheet();

   /**
    * 2. Calls methods to load balances, calculate totals, format amounts
    * and check entries that can be excluded
    */
   const bReport = new BReport(Banana.document, userParam, reportStructure);
   bReport.validateGroups(userParam.column);
   bReport.loadBalances();
   bReport.calculateTotals(["currentAmount", "previousAmount"]);
   bReport.formatValues(["currentAmount", "previousAmount"]);
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

function printBalanceSheet(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Bilan");
   var startDate = userParam.selectionStartDate;
   var endDate = userParam.selectionEndDate;
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;
   var months = monthDiff(Banana.Converter.toDate(endDate), Banana.Converter.toDate(startDate));
   
   var company = banDoc.info("AccountingDataBase","Company");
   var address1 = banDoc.info("AccountingDataBase","Address1");
   var zip = banDoc.info("AccountingDataBase","Zip");
   var city = banDoc.info("AccountingDataBase","City");
   var state = banDoc.info("AccountingDataBase","State");
   var email = banDoc.info("AccountingDataBase","Email");
 

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
   tableRow.addCell("BILAN ACTIF AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 3);

   // Active balancesheet table
   var table = report.addTable("table-active-balancesheet");
   var columnActive1 = table.addColumn("column-active1");
   var columnActive2 = table.addColumn("column-active2");
   var columnActive3 = table.addColumn("column-active3");
   var columnActive4 = table.addColumn("column-active4");
   var columnActive5 = table.addColumn("column-active5");

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 7);

   tableRow = table.addRow();
   tableRow.addCell("REF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("ACTIF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear,"bold align-center",3).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear,"bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("BRUT","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("AMORT. et DEPREC.","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET","bold align-center",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* AD */
   tableRow = table.addRow();
   tableRow.addCell("AD", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AD"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("ADA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AD-(ADA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AD-(ADA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   /* Row AE */
   tableRow = table.addRow();
   tableRow.addCell("AE", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AE"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AEA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AE-(AEA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AE-(AEA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AF */
   tableRow = table.addRow();
   tableRow.addCell("AF", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AF"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AFA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AF-(AFA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AF-(AFA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AG */
   tableRow = table.addRow();
   tableRow.addCell("AG", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AG"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AGA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AG-(AGA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AG-(AGA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AH */
   tableRow = table.addRow();
   tableRow.addCell("AH", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AH"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AHA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AH-(AHA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AH-(AHA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AI */
   tableRow = table.addRow();
   tableRow.addCell("AI", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AI"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AIA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AI-(AIA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AI-(AIA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   /* AJ */
   tableRow = table.addRow();
   tableRow.addCell("AJ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AJ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AJA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AJ-(AJA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AJ-(AJA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AK */
   tableRow = table.addRow();
   tableRow.addCell("AK", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AK"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AKA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AK-(AKA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AK-(AKA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AL */
   tableRow = table.addRow();
   tableRow.addCell("AL", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AL"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("ALA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AL-(ALA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AL-(ALA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AM */
   tableRow = table.addRow();
   tableRow.addCell("AM", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AM"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AMA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AM-(AMA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AM-(AMA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AN */
   tableRow = table.addRow();
   tableRow.addCell("AN", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AN"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("ANA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AN-(ANA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AN-(ANA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AP */
   tableRow = table.addRow();
   tableRow.addCell("AP", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AP"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AP"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AP"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("APA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AP-(APA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AP-(APA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AQ */
   tableRow = table.addRow();
   tableRow.addCell("AQ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AQ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AQA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AQ-(AQA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AQ-(AQA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   /* AR */
   tableRow = table.addRow();
   tableRow.addCell("AR", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AR"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AR"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AR"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("ARA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AR-(ARA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AR-(ARA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AS */
   tableRow = table.addRow();
   tableRow.addCell("AS", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("AS"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("AS"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AS"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("ASA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AS-(ASA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AS-(ASA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* AZ */
   tableRow = table.addRow();
   tableRow.addCell("AZ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("AZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("AZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AZ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AZA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("AZ-(AZA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("AZ-(AZA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   /* BA */
   tableRow = table.addRow();
   tableRow.addCell("BA", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BAA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BA-(BAA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BA-(BAA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BB */
   tableRow = table.addRow();
   tableRow.addCell("BB", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BB"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BBA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BB-(BBA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BB-(BBA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BG */
   tableRow = table.addRow();
   tableRow.addCell("BG", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("BG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("BG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BG"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BGA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BG-(BGA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BG-(BGA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   /* BH */
   tableRow = table.addRow();
   tableRow.addCell("BH", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BH"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BHA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BH-(BHA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BH-(BHA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BI */
   tableRow = table.addRow();
   tableRow.addCell("BI", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BI"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BIA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BI-(BIA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BI-(BIA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BJ */
   tableRow = table.addRow();
   tableRow.addCell("BJ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BJ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BJA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BJ-(BJA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BJ-(BJA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BK */
   tableRow = table.addRow();
   tableRow.addCell("BK", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("BK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("BK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BK"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BKA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BK-(BKA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BK-(BKA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   /* BQ */
   tableRow = table.addRow();
   tableRow.addCell("BQ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BQ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BQA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BQ-(BQA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BQ-(BQA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BR */
   tableRow = table.addRow();
   tableRow.addCell("BR", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BR"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BR"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BR"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BRA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BR-(BRA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BR-(BRA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BS */
   tableRow = table.addRow();
   tableRow.addCell("BS", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BS"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BS"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BS"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BSA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BS-(BSA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BS-(BSA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BT */
   tableRow = table.addRow();
   tableRow.addCell("BT", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("BT"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("BT"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BT"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BTA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BT-(BTA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BT-(BTA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   /* BU */
   tableRow = table.addRow();
   tableRow.addCell("BU", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("BU"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("BU"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BU"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BUA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BU-(BUA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BU-(BUA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   /* BZ */
   tableRow = table.addRow();
   tableRow.addCell("BZ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("BZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("BZ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BZ"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BZA"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("BZ-(BZA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("BZ-(BZA)"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");

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
   tableRow.addCell("BILAN PASSIF AU 31 DÉCEMBRE "  + currentYear, "bold align-center", 3);

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
   tableRow.addCell("REF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("PASSIF","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note","bold align-center",1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear,"bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear, "bold align-center", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("","",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("","",1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET","bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET", "bold align-center", 1).setStyleAttributes("border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* CA */
   printRow(userParam, bReport, table, "CA", "description-groups", "amount-groups");
   /* CB */
   printRow(userParam, bReport, table, "CB", "description-groups", "amount-groups");
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
   /* CJ */
   printRow(userParam, bReport, table, "CJ", "description-groups", "amount-groups");
   /* CL */
   printRow(userParam, bReport, table, "CL", "description-groups", "amount-groups");
   /* CM */
   printRow(userParam, bReport, table, "CM", "description-groups", "amount-groups");
   /* CP */
   printRow(userParam, bReport, table, "CP", "description-groups", "amount-groups-totals");
   /* DA */
   printRow(userParam, bReport, table, "DA", "description-groups", "amount-groups");
   /* DB */
   printRow(userParam, bReport, table, "DB", "description-groups", "amount-groups");
   /* DC */
   printRow(userParam, bReport, table, "DC", "description-groups", "amount-groups");
   /* DD */
   printRow(userParam, bReport, table, "DD", "description-groups", "amount-groups-totals");
   /* DF */
   printRow(userParam, bReport, table, "DF", "description-groups", "amount-groups-totals");
   /* DH */
   printRow(userParam, bReport, table, "DH", "description-groups", "amount-groups");
   /* DI */
   printRow(userParam, bReport, table, "DI", "description-groups", "amount-totals");
   /* DJ */
   printRow(userParam, bReport, table, "DJ", "description-groups", "amount-groups");
   /* DK */
   printRow(userParam, bReport, table, "DK", "description-groups", "amount-groups");
   /* DM */
   printRow(userParam, bReport, table, "DM", "description-groups", "amount-groups");
   /* DN */
   printRow(userParam, bReport, table, "DN", "description-groups", "amount-groups");
   /* DP */
   printRow(userParam, bReport, table, "DP", "description-groups", "amount-groups-totals");
   /* DQ */
   printRow(userParam, bReport, table, "DQ", "description-groups", "amount-groups");
   /* DR */
   printRow(userParam, bReport, table, "DR", "description-groups", "amount-groups");
   /* DT */
   printRow(userParam, bReport, table, "DT", "description-groups", "amount-groups-totals");
   /* DV */
   printRow(userParam, bReport, table, "DV", "description-groups", "amount-groups");
   /* DZ */
   printRow(userParam, bReport, table, "DZ", "description-groups", "amount-groups-totals");

   //checkResults(banDoc, startDate, endDate);



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
