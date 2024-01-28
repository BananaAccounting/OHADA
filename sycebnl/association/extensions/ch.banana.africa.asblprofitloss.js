// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
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
// @description = 2. Profit & Loss Statement (OHADA) [BETA]
// @description.fr = 2. Compte de résultat (OHADA) [BETA]
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
   var reportStructure = createReportStructureProfitLoss();

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
   var report = printprofitlossstatement(Banana.document, userParam, bReport, stylesheet);
   setCss(Banana.document, stylesheet, userParam);

   Banana.Report.preview(report, stylesheet);
}

function printprofitlossstatement(banDoc, userParam, bReport, stylesheet) {

   var report = Banana.Report.newReport("Compte de résultat");
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
   * COMPTE DE RÉSULTAT
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
   tableRow.addCell("COMPTE DE RÉSULTAT AU 31 DÉCEMBRE " + currentYear, "bold align-center", 3);

   tableRow = table.addRow();
   tableRow.addCell(" ", "", 6);

   // Profit & Loss table
   var table = report.addTable("table-profit-loss");
   var columnProfitLoss1 = table.addColumn("column-profit-loss1");
   var columnProfitLoss2 = table.addColumn("column-profit-loss2");
   var columnProfitLoss3 = table.addColumn("column-profit-loss3");
   var columnProfitLoss4 = table.addColumn("column-profit-loss4");
   var columnProfitLoss5 = table.addColumn("column-profit-loss5");

   tableRow = table.addRow();
   tableRow.addCell("REF", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid white;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("LIBELLÉS", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid white;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Note", "bold align-center", 1).setStyleAttributes("border-bottom:thin solid white;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + currentYear, "bold align-center", 1).setStyleAttributes("border-bottom:thin solid white;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("EXERCICE AU 31/12/" + previousYear, "bold align-center", 1).setStyleAttributes("border-bottom:thin solid white;padding-bottom:2px;padding-top:5px");
   tableRow = table.addRow();
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "bold align-center", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET", "bold align-center", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");
   tableRow.addCell("NET", "bold align-center", 1).setStyleAttributes("padding-bottom:2px;padding-top:5px");

   /* RA */
   tableRow = table.addRow();
   tableRow.addCell("RA", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RA"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RA"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RA"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RA"), "align-right", 1);

   /* RB */
   tableRow = table.addRow();
   tableRow.addCell("RB", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RB"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RB"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RB"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RB"), "align-right", 1);

   /* RC */
   tableRow = table.addRow();
   tableRow.addCell("RC", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RC"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RC"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RC"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RC"), "align-right", 1);

   /* RD */
   tableRow = table.addRow();
   tableRow.addCell("RD", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RD"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RD"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RD"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RD"), "align-right", 1);

   /* RE */
   tableRow = table.addRow();
   tableRow.addCell("RE", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RE"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RE"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RE"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RE"), "align-right", 1);

   /* RF */
   tableRow = table.addRow();
   tableRow.addCell("RF", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RF"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RF"), "align-right", 1);

   /* RG */
   tableRow = table.addRow();
   tableRow.addCell("RG", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RG"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RG"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RG"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RG"), "align-right", 1);

   /* RH */
   tableRow = table.addRow();
   tableRow.addCell("RH", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("RH"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("RH"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("RH"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("RH"), "align-right", 1);

   /* XA */
   tableRow = table.addRow();
   tableRow.addCell("XA", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("XA"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("XA"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("XA"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("XA"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* TA */
   tableRow = table.addRow();
   tableRow.addCell("TA", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TA"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TA"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TA"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TA"), "align-right", 1);

   /* TB */
   tableRow = table.addRow();
   tableRow.addCell("TB", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TB"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TB"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TB"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TB"), "align-right", 1);

   /* TC */
   tableRow = table.addRow();
   tableRow.addCell("TC", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TC"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TC"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TC"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TC"), "align-right", 1);

   /* TD */
   tableRow = table.addRow();
   tableRow.addCell("TD", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TD"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TD"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TD"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TD"), "align-right", 1);

   /* TE */
   tableRow = table.addRow();
   tableRow.addCell("TE", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TE"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TE"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TE"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TE"), "align-right", 1);

   /* TF */
   tableRow = table.addRow();
   tableRow.addCell("TF", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TF"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TF"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TF"), "align-right", 1);

   /* TG */
   tableRow = table.addRow();
   tableRow.addCell("TG", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TG"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TG"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TG"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TG"), "align-right", 1);

   /* TH */
   tableRow = table.addRow();
   tableRow.addCell("TH", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TH"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TH"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TH"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TH"), "align-right", 1);

   /* TI */
   tableRow = table.addRow();
   tableRow.addCell("TI", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TI"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TI"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TI"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TI"), "align-right", 1);

   /* TJ */
   tableRow = table.addRow();
   tableRow.addCell("TJ", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TJ"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TJ"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TJ"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TJ"), "align-right", 1);

   /* TK */
   tableRow = table.addRow();
   tableRow.addCell("TK", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TK"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TK"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TK"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TK"), "align-right", 1);

   /* TL */
   tableRow = table.addRow();
   tableRow.addCell("TL", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TL"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TL"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TL"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TL"), "align-right", 1);

   /* XB */
   tableRow = table.addRow();
   tableRow.addCell("XB", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("XB"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("XB"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("XB"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("XB"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* XC */
   tableRow = table.addRow();
   tableRow.addCell("XC", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("XC"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("XC"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("XC"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("XC"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* TM */
   tableRow = table.addRow();
   tableRow.addCell("TM", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TM"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TM"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TM"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TM"), "align-right", 1);

   /* TN */
   tableRow = table.addRow();
   tableRow.addCell("TN", "align-left", 1);
   tableRow.addCell(bReport.getObjectDescription("TN"), "align-left", 1);
   tableRow.addCell(bReport.getObjectNote("TN"), "align-left", 1);
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("TN"), "align-right", 1);
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("TN"), "align-right", 1);

   /* XD */
   tableRow = table.addRow();
   tableRow.addCell("XD", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("XD"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("XD"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("XD"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("XD"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   /* XE */
   tableRow = table.addRow();
   tableRow.addCell("XE", "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectDescription("XE"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("XE"), "align-left", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("XE"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");
   tableRow.addCell(bReport.getObjectPreviousAmountFormatted("XE"), "align-right", 1).setStyleAttributes("background-color: #C0C0C0; font-weight: bold");

   //checkResults(banDoc, startDate, endDate);



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
   var file = Banana.IO.getLocalFile("file:script/profitlossstatement.css");
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
   currentParam.defaultvalue = 'Gr';
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
   userParam.column = 'Gr';
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
