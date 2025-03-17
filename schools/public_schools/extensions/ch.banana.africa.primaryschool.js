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
// @id = ch.banana.africa.primaryschool
// @api = 1.0
// @pubdate = 2025-03-09
// @publisher = Banana.ch SA
// @description = Public Primary School Accounting Reports (OHADA) [BETA]
// @description.fr = Ecole Primaire Publique - Rapports Financiers  (OHADA) [BETA]
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
   var reportStructure = createReportStructurePrimaryFinancialReport();

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

function printfinancialreport(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Rapport Financier");
   var startDate = userParam.selectionStartDate;
   var endDate = userParam.selectionEndDate;
   var currentStartDate = startDate;
   var currentEndDate = endDate;
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;
   var months = monthDiff(Banana.Converter.toDate(currentEndDate), Banana.Converter.toDate(currentStartDate));

   var company = banDoc.info("AccountingDataBase", "Company");
   var district = banDoc.info("AccountingDataBase", "Courtesy");
   var schoolName = banDoc.info("AccountingDataBase", "Name");
   var address1 = banDoc.info("AccountingDataBase", "Address1");
   var zip = banDoc.info("AccountingDataBase", "Zip");
   var city = banDoc.info("AccountingDataBase", "City");
   var state = banDoc.info("AccountingDataBase", "State");
   var email = banDoc.info("AccountingDataBase", "Email");
   var currentStartMonth = Banana.Converter.toDate(currentStartDate).getMonth();
   var currentEndMonth = Banana.Converter.toDate(currentEndDate).getMonth();


   /**************************************************************************************
   * RAPPORT FINANCIER
   **************************************************************************************/
   var table = report.addTable("table");
   var column1 = table.addColumn("column1");
   var column2 = table.addColumn("column2");
   var column3 = table.addColumn("column3");

   var headerLogoSection = report.addSection("");
   var logoFormat = Banana.Report.logoFormat("Logo"); 

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
   tableRow.addCell(company, "bold align-left", 3);
   tableRow = table.addRow();
   tableRow.addCell("SOUS-DIVISION DE " + district, "bold align-left", 3);
   tableRow = table.addRow();
   tableRow.addCell("DENOMINATION ETABLISSEMENT : " + schoolName, "bold align-left", 3);
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);
   tableRow = table.addRow();
   tableRow.addCell(" ", "", 3);
   tableRow = table.addRow();
   tableRow.addCell("RAPPORT FINANCIER", "bold align-center", 3);
   tableRow = table.addRow();
   tableRow.addCell("DU " + Banana.Converter.toLocaleDateFormat(currentStartDate) + " AU " + Banana.Converter.toLocaleDateFormat(currentEndDate), "bold align-center", 3);

   tableRow = table.addRow();
   tableRow.addCell("", "", 3);
   tableRow = table.addRow();
   tableRow.addCell("", "", 3);

   // Profit & Loss table
   var table = report.addTable("table-financial-report");
   var columnFinancialReport1 = table.addColumn("column-financial-report1");
   var columnFinancialReport2 = table.addColumn("column-financial-report2");
   var columnFinancialReport3 = table.addColumn("column-financial-report3");

   tableRow = table.addRow();
   tableRow.addCell("I", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("RECETTES", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("MONTANT", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   
   var openingAmount = calculateOpeningAmount(banDoc, startDate, endDate);
   
   /* SI */
    tableRow = table.addRow();
   //  openingAmount = banDoc.table("Accounts").row(0).value("Opening") ? banDoc.table("Accounts").row(0).value("Opening") : banDoc.table("Accounts").row(1).value("Opening");
    tableRow.addCell(bReport.getObjectId("SI"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
    tableRow.addCell(bReport.getObjectDescription("SI"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
    tableRow.addCell(formatValuesDecimals(openingAmount), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* RFF */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RFF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RFF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RFF"), "align-right", 1);

   /* RDLS */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RDLS"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RDLS"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RDLS"), "align-right", 1);

   /* RAUT */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RAUT"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RAUT"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RAUT"), "align-right", 1);

   /* R */
   tableRow = table.addRow();
   var totalRecettes1 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(openingAmount), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RFF")));
   var totalRecettes2 = Banana.SDecimal.add(totalRecettes1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RDLS")));
   var totalRecettes = Banana.SDecimal.add(totalRecettes2, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RAUT")));
   tableRow.addCell(bReport.getObjectId("R"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("R"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(formatValuesDecimals(totalRecettes), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   tableRow = table.addRow();
   tableRow.addCell("II", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("DEPENSES", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");

   /* DFF01 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF01"), "align-right", 1);

   /* DFF02 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF02"), "align-right", 1);

   /* DFF03 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF03"), "align-right", 1);

   /* DFF04 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF04"), "align-right", 1);

   /* DFF05 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF05"), "align-right", 1);

   /* DFF06 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF06"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DFF06"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF06"), "align-right", 1);

   /* DFF */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DFF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("DFF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DFF"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

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

   /* D */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("D"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("D"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("D"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* SFF */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("SFF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("SFF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("SFF"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* SDLSA */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("SDLSA"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("SDLSA"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("SDLSA"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* S */
   tableRow = table.addRow();
   var totalSoldes = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(totalRecettes), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("D")));
   tableRow.addCell(bReport.getObjectId("S"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("S"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(formatValuesDecimals(totalSoldes), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");


   //addFooter(report);
   return report;
}

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
   
   const reportStructure = createReportStructurePrimaryFinancialReport();
   const prevReport = new BReport(banDoc, prevParam, reportStructure);
   
   prevReport.validateGroups(prevParam.column);
   prevReport.loadBalances();
   prevReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
   prevReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
   
   // Calculate previous month's totalRecettes
   const totalRecettes1 = Banana.SDecimal.add(
       Banana.Converter.toInternalNumberFormat(prevOpeningAmount),
       Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("RFF"))
   );

   const totalRecettes2 = Banana.SDecimal.add(
       totalRecettes1,
         Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("RDLS"))
   );

   const totalRecettes = Banana.SDecimal.add(
         totalRecettes2,
         Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("RAUT"))
   );
   
   
   // Calculate previous month's totalSoldes
   const totalSoldes = Banana.SDecimal.subtract(
       totalRecettes,
       Banana.Converter.toInternalNumberFormat(prevReport.getObjectCurrentAmountFormatted("D"))
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
