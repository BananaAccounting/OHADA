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
// @id = ch.banana.africa.secondaryschool
// @api = 1.0
// @pubdate = 2025-03-09
// @publisher = Banana.ch SA
// @description = Public Secondary School Accounting Reports (OHADA) [BETA]
// @description.fr = Ecole Secondaire Publique - Rapports Financiers  (OHADA) [BETA]
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
   var reportStructure = createReportStructureSecondaryFinancialReport();

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
   var currentYear = Banana.Converter.toDate(banDoc.info("AccountingDataBase", "OpeningDate")).getFullYear();
   var previousYear = currentYear - 1;
   var months = monthDiff(Banana.Converter.toDate(endDate), Banana.Converter.toDate(startDate));

   var company = banDoc.info("AccountingDataBase", "Company");
   var district = banDoc.info("AccountingDataBase", "Courtesy");
   var schoolName = banDoc.info("AccountingDataBase", "Name");
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

   if (logoFormat) {
      // Use the format as defined in the dialog File --> Logo Setup   
      var logoElement = logoFormat.createDocNode(headerLogoSection, stylesheet, "first_page_logo"); 
      report.getHeader().addChild(logoElement); } 
   else {
         // If the format 'logo' is not defined, insert an image   
         report.addImage("documents:logo", "logoStyle"); 
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

   tableRow = table.addRow();
   tableRow.addCell("I", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("RECETTES", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("MONTANT", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   
   /* SI */
    tableRow = table.addRow();
    var openingAmount = banDoc.table("Accounts").row(0).value("Opening") ? banDoc.table("Accounts").row(0).value("Opening") : banDoc.table("Accounts").row(1).value("Opening");
    tableRow.addCell(bReport.getObjectId("SI"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
    tableRow.addCell(bReport.getObjectDescription("SI"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
    tableRow.addCell(formatValuesDecimals(openingAmount), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* RAF */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RAF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RAF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RAF"), "align-right", 1);

   /* RCP */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("RCP"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RCP"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RCP"), "align-right", 1);

   /* R */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("R"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("R"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("R"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   tableRow = table.addRow();
   tableRow.addCell("II", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("DEPENSES", "bold align-left", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");

   /* DAF01 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF01"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF01"), "align-right", 1);

   /* DAF02 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF02"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF02"), "align-right", 1);

   /* DAF03 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF03"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF03"), "align-right", 1);

   /* DAF04 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF04"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF04"), "align-right", 1);

   /* DAF05 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF05"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF05"), "align-right", 1);

   /* DAF06 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF06"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF06"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF06"), "align-right", 1);

   /* DAF07 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF07"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF07"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF07"), "align-right", 1);

   /* DAF08 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF08"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF08"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF08"), "align-right", 1);

   /* DAF09 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF09"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF09"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF09"), "align-right", 1);

   /* DAF10 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF10"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF10"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF10"), "align-right", 1);

   /* DAF11 */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("DAF11"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF11"), "align-right", 1);

   /* DAF */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DAF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("DAF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DAF"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* PRIMES ENS */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("PRIMES ENS"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("PRIMES ENS"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("PRIMES ENS"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DIV DCP */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DIV DCP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("DIV DCP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DIV DCP"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* DCP */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("DCP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("DCP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("DCP"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* D */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("D"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("D"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("D"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* SAF */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("SAF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("SAF"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("SAF"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* SCP */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("SCP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("SCP"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("SCP"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* S */
   tableRow = table.addRow();
   tableRow.addCell(bReport.getObjectId("S"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("S"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("S"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");


   //addFooter(report);
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
