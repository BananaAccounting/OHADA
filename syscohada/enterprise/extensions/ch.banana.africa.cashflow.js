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
   var userParamPrevious = Object.assign({}, userParam);
   if (previous) {
      userParamPrevious.selectionStartDate = previous.startPeriod();
      userParamPrevious.selectionEndDate = previous.endPeriod();
   }
   
   if (!previous) {
      Banana.console.log("No previous year found");
   }
   /**
    * 1. Loads the report structure
    */
   var reportStructure = createReportStructureCashFlow();
   var reportStructurePrev = createReportStructureCashFlow();

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

   var bReportPrevious = null;
   if (previous) {
      bReportPrevious = new BReport(previous, userParamPrevious, reportStructurePrev);
      bReportPrevious.validateGroups(userParamPrevious.column);
      bReportPrevious.loadBalances();
      bReportPrevious.calculateTotals(["currentAmount", "previousAmount", "openingAmount", "debitAmount", "creditAmount"]);
      bReportPrevious.formatValues(["currentAmount", "previousAmount", "openingAmount", "debitAmount", "creditAmount"]);
      bReportPrevious.excludeEntries();
   }

   /**
    * 3. Creates the report
    */
   var stylesheet = Banana.Report.newStyleSheet();
   var report = printCashFlow(Banana.document, previous, userParam, bReport, bReportPrevious, stylesheet);
   setCss(Banana.document, stylesheet, userParam);
   Banana.Report.preview(report, stylesheet);
 }

 function printRow(userParam, bReport, table, gr, styleColumnDescription, styleColumnAmount) {
   
   var note = bReport.getObjectNote(gr);
   
   
   tableRow = table.addRow();
   
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

 function printCashFlow(current, previous, userParam, bReport, bReportPrevious, stylesheet) {
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
   var za_result_0 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BQ")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BR")));
   var za_result_1 = Banana.SDecimal.add(za_result_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BS")));
   var za_result_2 = Banana.SDecimal.invert(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("DQ")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("DR"))));
   var za_result = Banana.SDecimal.subtract(za_result_1, za_result_2);

   var za_result_0_previous = 0;
   var za_result_1_previous = 0;
   var za_result_2_previous = 0;
   var za_result_previous = 0;
   if (previous) {
      za_result_0_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BQ")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BR")));
      za_result_1_previous = Banana.SDecimal.add(za_result_0_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BS")));
      za_result_2_previous = Banana.SDecimal.invert(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("DQ")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("DR"))));
      za_result_previous = Banana.SDecimal.subtract(za_result_1_previous, za_result_2_previous);
   }
   tableRow.addCell("ZA", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(za_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if(previous) {
      tableRow.addCell(formatValues(za_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   /*  */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Flux de trésorerie provenant des activités opérationnelles", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   
   /* FA */
   tableRow = table.addRow();
   var ta_tb_td = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TA")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TB"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TD")));
   var te_th = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TE")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TH")));
   var ff5_fg6_fa1 = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FF5")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FG6"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FA1")));
   var xd_a = Banana.SDecimal.add(Banana.SDecimal.add(ta_tb_td, te_th), ff5_fg6_fa1);
   var ra_rb_rc = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RA")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RB"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RC")));
   var re_rh_rj = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RE")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RH"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RJ")));
   var rk_fa2 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RK")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FA2")));
   var xd_b = Banana.SDecimal.add(Banana.SDecimal.add(ra_rb_rc, re_rh_rj), rk_fa2);
   var xd = Banana.SDecimal.subtract(xd_a, xd_b); 
   var fa2 = Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FA2"));
   var fa1 = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FA1")));
   var total_tk_tm_tl = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TK")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TM"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TL")));
   var total_rm_rn = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RM")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RN")));
   var sub_total_t_r = Banana.SDecimal.subtract(Banana.SDecimal.invert(total_tk_tm_tl), total_rm_rn);
   var sub_total_1 = Banana.SDecimal.add(xd, fa2);
   var sub_total_2 = Banana.SDecimal.add(sub_total_1, Banana.SDecimal.invert(fa1));
   var sub_total_3 = Banana.SDecimal.add(sub_total_2, sub_total_t_r);
   var sub_total_4 = Banana.SDecimal.add(sub_total_3, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("TO")));
   var sub_total_5 = Banana.SDecimal.subtract(sub_total_4, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RP")));
   var sub_total_6 = Banana.SDecimal.subtract(sub_total_5, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RQ")));
   var total_fa = Banana.SDecimal.subtract(sub_total_6, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("RS")));
   
   var ta_tb_td_previous = 0;
   var te_th_previous = 0;
   var ff5_fg6_fa1_previous = 0;
   var xd_a_previous = 0;
   var ra_rb_rc_previous = 0;
   var re_rh_rj_previous = 0;
   var rk_fa2_previous = 0;
   var xd_b_previous = 0;
   var xd_previous = 0;
   var fa2_previous = 0;
   var fa1_previous = 0;
   var total_tk_tm_tl_previous = 0;
   var total_rm_rn_previous = 0;
   var sub_total_t_r_previous = 0;
   var sub_total_1_previous = 0;
   var sub_total_2_previous = 0;
   var sub_total_3_previous = 0;
   var sub_total_4_previous = 0;
   var sub_total_5_previous = 0;
   var sub_total_6_previous = 0;
   var total_fa_previous = 0;
   if (previous) {
      ta_tb_td_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TA")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TB"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TD")));
      te_th_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TE")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TH")));
      ff5_fg6_fa1_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FF5")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FG6"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FA1")));
      xd_a_previous = Banana.SDecimal.add(Banana.SDecimal.add(ta_tb_td_previous, te_th_previous), ff5_fg6_fa1_previous);
      ra_rb_rc_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RA")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RB"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RC")));
      re_rh_rj_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RE")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RH"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RJ")));
      rk_fa2_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RK")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FA2")));
      xd_b_previous = Banana.SDecimal.add(Banana.SDecimal.add(ra_rb_rc_previous, re_rh_rj_previous), rk_fa2_previous);
      xd_previous = Banana.SDecimal.subtract(xd_a_previous, xd_b_previous);
      fa2_previous = Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FA2"));
      fa1_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FA1")));
      total_tk_tm_tl_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TK")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TM"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TL")));
      total_rm_rn_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RM")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RN")));
      sub_total_t_r_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(total_tk_tm_tl_previous), total_rm_rn_previous);
      sub_total_1_previous = Banana.SDecimal.add(xd_previous, fa2_previous);
      sub_total_2_previous = Banana.SDecimal.add(sub_total_1_previous, Banana.SDecimal.invert(fa1_previous));
      sub_total_3_previous = Banana.SDecimal.add(sub_total_2_previous, sub_total_t_r_previous);
      sub_total_4_previous = Banana.SDecimal.add(sub_total_3_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("TO")));
      sub_total_5_previous = Banana.SDecimal.subtract(sub_total_4_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RP")));
      sub_total_6_previous = Banana.SDecimal.subtract(sub_total_5_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RQ")));
      total_fa_previous = Banana.SDecimal.subtract(sub_total_6_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("RS")));
   }
   tableRow.addCell("FA", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FA"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fa), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fa_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FB */
   tableRow = table.addRow();
   var total_fb = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BA")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BA")));

   var total_fb_previous = 0;
   if (previous) {
      total_fb_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BA")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BA")));
   }

   tableRow.addCell("FB", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fb), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fb_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FC */
   tableRow = table.addRow();
   var total_fc = Banana.SDecimal.subtract(Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BB")), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BBA")))), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BB")));

   var total_fc_previous = 0;
   if (previous) {
      total_fc_previous = Banana.SDecimal.subtract(Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BB")), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BBA")))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BB")));
   }
   tableRow.addCell("FC", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fc), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fc_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FD */
   tableRow = table.addRow();
   var total_bh_bi_bj = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BH")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BI"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BJ")));
   total_bh_bi_bj = Banana.SDecimal.add(total_bh_bi_bj, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FD5")));
   total_bh_bi_bj = Banana.SDecimal.add(total_bh_bi_bj, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FD6")));
   var total_bha_bia_bja = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BHA")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BIA"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("BJA")));
   var total_bh_bi_bj_opening = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BH")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BI"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BJ")));
   var total_bha_bia_bja_opening = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BHA")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BIA"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("BJA")));
   var sub_total_1_balance = Banana.SDecimal.subtract(total_bh_bi_bj, Banana.SDecimal.invert(total_bha_bia_bja));
   var sub_total_1_opening = Banana.SDecimal.subtract(total_bh_bi_bj_opening, Banana.SDecimal.invert(total_bha_bia_bja_opening));
   var sub_total_fd_1 = Banana.SDecimal.subtract(sub_total_1_balance, sub_total_1_opening);
   var sub_total_fd_2 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FD1")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FD1")));
   var sub_total_fd_3 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FD2")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FD2")));
   var sub_total_fd_4 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FD3")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FD3")));
   var sub_total_fd_5 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FD4")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FD4")));
   var sub_total_fd_final_1 = Banana.SDecimal.add(sub_total_fd_1, sub_total_fd_2);
   var sub_total_fd_final_2 = Banana.SDecimal.add(sub_total_fd_final_1, sub_total_fd_3);
   var sub_total_fd_final_3 = Banana.SDecimal.subtract(sub_total_fd_final_2, sub_total_fd_4);
   var sub_total_fd_final_4 = Banana.SDecimal.add(sub_total_fd_final_3, sub_total_fd_5); // Not sure
   var sub_total_fd_final_5 = Banana.SDecimal.subtract(sub_total_fd_final_4, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FD5")));
   var total_fd = Banana.SDecimal.subtract(sub_total_fd_final_5, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FD6")));

   var total_bh_bi_bj_previous = 0;
   var total_bha_bia_bja_previous = 0;
   var total_bh_bi_bj_opening_previous = 0;
   var total_bha_bia_bja_opening_previous = 0;
   var sub_total_1_balance_previous = 0;
   var sub_total_1_opening_previous = 0;
   var sub_total_fd_1_previous = 0;
   var sub_total_fd_2_previous = 0;
   var sub_total_fd_3_previous = 0;
   var sub_total_fd_4_previous = 0;
   var sub_total_fd_5_previous = 0;
   var sub_total_fd_final_1_previous = 0;
   var sub_total_fd_final_2_previous = 0;
   var sub_total_fd_final_3_previous = 0;
   var sub_total_fd_final_4_previous = 0;
   var sub_total_fd_final_5_previous = 0;
   var total_fd_previous = 0;
   if (previous) {
      total_bh_bi_bj_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BH")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BI"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BJ")));
      total_bh_bi_bj_previous = Banana.SDecimal.add(total_bh_bi_bj_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FD5")));
      total_bh_bi_bj_previous = Banana.SDecimal.add(total_bh_bi_bj_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FD6")));
      total_bha_bia_bja_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BHA")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BIA"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("BJA")));
      total_bh_bi_bj_opening_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BH")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BI"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BJ")));
      total_bha_bia_bja_opening_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BHA")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BIA"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("BJA")));
      sub_total_1_balance_previous = Banana.SDecimal.subtract(total_bh_bi_bj_previous, Banana.SDecimal.invert(total_bha_bia_bja_previous));
      sub_total_1_opening_previous = Banana.SDecimal.subtract(total_bh_bi_bj_opening_previous, Banana.SDecimal.invert(total_bha_bia_bja_opening_previous));
      sub_total_fd_1_previous = Banana.SDecimal.subtract(sub_total_1_balance_previous, sub_total_1_opening_previous);
      sub_total_fd_2_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FD1")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FD1")));
      sub_total_fd_3_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FD2")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FD2")));
      sub_total_fd_4_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FD3")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FD3")));
      sub_total_fd_5_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FD4")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FD4")));
      sub_total_fd_final_1_previous = Banana.SDecimal.add(sub_total_fd_1_previous, sub_total_fd_2_previous);
      sub_total_fd_final_2_previous = Banana.SDecimal.add(sub_total_fd_final_1_previous, sub_total_fd_3_previous);
      sub_total_fd_final_3_previous = Banana.SDecimal.subtract(sub_total_fd_final_2_previous, sub_total_fd_4_previous);
      sub_total_fd_final_4_previous = Banana.SDecimal.add(sub_total_fd_final_3_previous, sub_total_fd_5_previous); // Not sure
      sub_total_fd_final_5_previous = Banana.SDecimal.subtract(sub_total_fd_final_4_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FD5")));
      total_fd_previous = Banana.SDecimal.subtract(sub_total_fd_final_5_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FD6")));
   }
   tableRow.addCell("FD", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fd), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fd_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FE */
   tableRow = table.addRow();
   var total_di_dj_dk = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DI")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DJ"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DK")));
   var total_dm_dn = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DM")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("DN")));
   var sub_total_fe_1_balance = Banana.SDecimal.add(total_di_dj_dk, total_dm_dn);
   var total_di_dj_dk_opening = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("DI")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("DJ"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("DK")));
   var total_dm_dn_opening = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("DM")), Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("DN")));
   var sub_total_fe_1_opening = Banana.SDecimal.add(total_di_dj_dk_opening, total_dm_dn_opening);
   var sub_total_fe_1 = Banana.SDecimal.subtract(Banana.SDecimal.invert(sub_total_fe_1_balance), Banana.SDecimal.invert(sub_total_fe_1_opening));
   var sub_total_fe_2 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FE1"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FE1"))));
   var sub_total_fe_3 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FE2"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FE2"))));
   var sub_total_fe_4 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FE3"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FE3"))));
   var sub_total_fe_5 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FE4"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FE4"))));
   var sub_total_fe_6 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FE5"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FE5"))));
   var sub_total_fe_7 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FE6"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FE6"))));
   var sub_total_fe_8 = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FE7"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectOpeningAmountFormatted("FE7"))));
   var sub_total_fe_final_1 = Banana.SDecimal.add(sub_total_fe_1, sub_total_fe_2);
   var sub_total_fe_final_2 = Banana.SDecimal.subtract(sub_total_fe_final_1, sub_total_fe_3);
   var sub_total_fe_final_3 = Banana.SDecimal.subtract(sub_total_fe_final_2, sub_total_fe_4);
   var sub_total_fe_final_4 = Banana.SDecimal.subtract(sub_total_fe_final_3, sub_total_fe_5);
   var sub_total_fe_final_5 = Banana.SDecimal.subtract(sub_total_fe_final_4, sub_total_fe_6);
   var sub_total_fe_final_6 = Banana.SDecimal.subtract(sub_total_fe_final_5, sub_total_fe_7);
   var sub_total_fe_final_7 = Banana.SDecimal.subtract(sub_total_fe_final_6, sub_total_fe_8);
   var sub_total_fe_final_8 = Banana.SDecimal.add(Banana.SDecimal.invert(sub_total_fe_final_7), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FE8"))));
   var total_fe = Banana.SDecimal.add(sub_total_fe_final_8, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FE9")));

   var total_di_dj_dk_previous = 0;
   var total_dm_dn_previous = 0;
   var sub_total_fe_1_balance_previous = 0;
   var total_di_dj_dk_opening_previous = 0;
   var total_dm_dn_opening_previous = 0;
   var sub_total_fe_1_opening_previous = 0;
   var sub_total_fe_1_previous = 0;
   var sub_total_fe_2_previous = 0;
   var sub_total_fe_3_previous = 0;
   var sub_total_fe_4_previous = 0;
   var sub_total_fe_5_previous = 0;
   var sub_total_fe_6_previous = 0;
   var sub_total_fe_7_previous = 0;
   var sub_total_fe_8_previous = 0;
   var sub_total_fe_final_1_previous = 0;
   var sub_total_fe_final_2_previous = 0;
   var sub_total_fe_final_3_previous = 0;
   var sub_total_fe_final_4_previous = 0;
   var sub_total_fe_final_5_previous = 0;
   var sub_total_fe_final_6_previous = 0;
   var sub_total_fe_final_7_previous = 0;
   var sub_total_fe_final_8_previous = 0;
   var total_fe_previous = 0;
   if (previous) {
      total_di_dj_dk_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("DI")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("DJ"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("DK")));
      total_dm_dn_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("DM")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("DN")));
      sub_total_fe_1_balance_previous = Banana.SDecimal.add(total_di_dj_dk_previous, total_dm_dn_previous);
      total_di_dj_dk_opening_previous = Banana.SDecimal.add(Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("DI")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("DJ"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("DK")));
      total_dm_dn_opening_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("DM")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("DN")));
      sub_total_fe_1_opening_previous = Banana.SDecimal.add(total_di_dj_dk_opening_previous, total_dm_dn_opening_previous);
      sub_total_fe_1_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(sub_total_fe_1_balance_previous), Banana.SDecimal.invert(sub_total_fe_1_opening_previous));
      sub_total_fe_2_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FE1"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FE1"))));
      sub_total_fe_3_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FE2"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FE2"))));
      sub_total_fe_4_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FE3"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FE3"))));
      sub_total_fe_5_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FE4"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FE4"))));
      sub_total_fe_6_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FE5"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FE5"))));
      sub_total_fe_7_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FE6"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FE6"))));
      sub_total_fe_8_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FE7"))), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectOpeningAmountFormatted("FE7"))));
      sub_total_fe_final_1_previous = Banana.SDecimal.add(sub_total_fe_1_previous, sub_total_fe_2_previous);
      sub_total_fe_final_2_previous = Banana.SDecimal.subtract(sub_total_fe_final_1_previous, sub_total_fe_3_previous);
      sub_total_fe_final_3_previous = Banana.SDecimal.subtract(sub_total_fe_final_2_previous, sub_total_fe_4_previous);
      sub_total_fe_final_4_previous = Banana.SDecimal.subtract(sub_total_fe_final_3_previous, sub_total_fe_5_previous);
      sub_total_fe_final_5_previous = Banana.SDecimal.subtract(sub_total_fe_final_4_previous, sub_total_fe_6_previous);
      sub_total_fe_final_6_previous = Banana.SDecimal.subtract(sub_total_fe_final_5_previous, sub_total_fe_7_previous);
      sub_total_fe_final_7_previous = Banana.SDecimal.subtract(sub_total_fe_final_6_previous, sub_total_fe_8_previous);
      sub_total_fe_final_8_previous = Banana.SDecimal.add(Banana.SDecimal.invert(sub_total_fe_final_7_previous), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FE8"))));
      total_fe_previous = Banana.SDecimal.add(sub_total_fe_final_8_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FE9")));
   }
   tableRow.addCell("FE", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fe), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fe_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;border-bottom:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /*  */
   tableRow = table.addRow();
   var var_bf_0 = Banana.SDecimal.subtract(Banana.SDecimal.invert(total_fb), total_fc);
   var var_bf_1 = Banana.SDecimal.subtract(var_bf_0, total_fd);
   var var_bf = Banana.SDecimal.add(var_bf_1, total_fe);

   var var_bf_0_previous = 0;
   var var_bf_1_previous = 0;
   var var_bf_previous = 0;
   if (previous) {
      var_bf_0_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(total_fb_previous), total_fc_previous);
      var_bf_1_previous = Banana.SDecimal.subtract(var_bf_0_previous, total_fd_previous);
      var_bf_previous = Banana.SDecimal.add(var_bf_1_previous, total_fe_previous);
   }
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Variation du BF lié aux activités opérationnelles (FB+FC+FD+FE)", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(var_bf), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(var_bf_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
      
   /* ZB */
   tableRow = table.addRow();
   var zb_result_0 = Banana.SDecimal.subtract(total_fa, total_fb);
   var zb_result_1 = Banana.SDecimal.subtract(zb_result_0, total_fc);
   var zb_result_2 = Banana.SDecimal.subtract(zb_result_1, total_fd);
   var zb_result = Banana.SDecimal.add(zb_result_2, total_fe);

   var zb_result_0_previous = 0;
   var zb_result_1_previous = 0;
   var zb_result_2_previous = 0;
   var zb_result_previous = 0;
   if (previous) {
      zb_result_0_previous = Banana.SDecimal.subtract(total_fa_previous, total_fb_previous);
      zb_result_1_previous = Banana.SDecimal.subtract(zb_result_0_previous, total_fc_previous);
      zb_result_2_previous = Banana.SDecimal.subtract(zb_result_1_previous, total_fd_previous);
      zb_result_previous = Banana.SDecimal.add(zb_result_2_previous, total_fe_previous);
   }
   tableRow.addCell("ZB", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZB"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(zb_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(zb_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
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
   var sub_total_ff_2 = Banana.SDecimal.subtract(sub_total_ff_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FF1")));
   var sub_total_ff_3 = Banana.SDecimal.add(sub_total_ff_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FD5")));
   var sub_total_ff_4 = Banana.SDecimal.subtract(sub_total_ff_3, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FF2")));
   var sub_total_ff_5 = Banana.SDecimal.add(sub_total_ff_4, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FF2")));
   var sub_total_ff_6 = Banana.SDecimal.subtract(sub_total_ff_5, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FE2")));
   var sub_total_ff_7 = Banana.SDecimal.add(sub_total_ff_6, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FE2")));
   var sub_total_ff_8 = Banana.SDecimal.add(sub_total_ff_7, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FF3")));
   var sub_total_ff_9 = Banana.SDecimal.subtract(sub_total_ff_8, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FF3")));
   var sub_total_ff_10 = Banana.SDecimal.subtract(sub_total_ff_9, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FF4")));
   var total_ff = Banana.SDecimal.subtract(sub_total_ff_10, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FF5")));
   
   var sub_total_ae_af_previous = 0;
   var sub_total_ag_ah_previous = 0;
   var sub_total_ff_1_previous = 0;
   var sub_total_ff_2_previous = 0;
   var sub_total_ff_3_previous = 0;
   var sub_total_ff_4_previous = 0;
   var sub_total_ff_5_previous = 0;
   var sub_total_ff_6_previous = 0;
   var sub_total_ff_7_previous = 0;
   var sub_total_ff_8_previous = 0;
   var sub_total_ff_9_previous = 0;
   var sub_total_ff_10_previous = 0;
   var total_ff_previous = 0;
   if (previous) {
      sub_total_ae_af_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AE")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AF")));
      sub_total_ag_ah_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AG")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AH")));
      sub_total_ff_1_previous = Banana.SDecimal.add(sub_total_ae_af_previous, sub_total_ag_ah_previous);
      sub_total_ff_2_previous = Banana.SDecimal.subtract(sub_total_ff_1_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FF1")));
      sub_total_ff_3_previous = Banana.SDecimal.add(sub_total_ff_2_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FD5")));
      sub_total_ff_4_previous = Banana.SDecimal.subtract(sub_total_ff_3_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FF2")));
      sub_total_ff_5_previous = Banana.SDecimal.add(sub_total_ff_4_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FF2")));
      sub_total_ff_6_previous = Banana.SDecimal.subtract(sub_total_ff_5_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FE2")));
      sub_total_ff_7_previous = Banana.SDecimal.add(sub_total_ff_6_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FE2")));
      sub_total_ff_8_previous = Banana.SDecimal.add(sub_total_ff_7_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FF3")));
      sub_total_ff_9_previous = Banana.SDecimal.subtract(sub_total_ff_8_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FF3")));
      sub_total_ff_10_previous = Banana.SDecimal.subtract(sub_total_ff_9_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FF4")));
      total_ff_previous = Banana.SDecimal.subtract(sub_total_ff_10_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FF5")));
   }
   
   tableRow.addCell("FF", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_ff), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_ff_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FG */
   tableRow = table.addRow();
   var sub_total_fg_0 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AJ")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AK")));
   var sub_total_fg_1 = Banana.SDecimal.add(sub_total_fg_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AL")));
   var sub_total_fg_2 = Banana.SDecimal.add(sub_total_fg_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AM")));
   var sub_total_fg_3 = Banana.SDecimal.add(sub_total_fg_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("AN")));
   var sub_total_fg_4 = Banana.SDecimal.subtract(sub_total_fg_3, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FG1")));
   var sub_total_fg_5 = Banana.SDecimal.add(sub_total_fg_4, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FD6")));
   var fe_3 = Banana.SDecimal.add(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FE3"))), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FE3")));
   var fg_2 = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FG2")), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FG2"))));
   var fg_4 = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FG4")));
   var fg_5 = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FG5")));
   var fg_6 = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FG6")));
   var fg_7 = Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FG7"));
   var fg_8 = Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FG8"));
   var sub_total_fg_6 = Banana.SDecimal.subtract(sub_total_fg_5, fe_3);
   var sub_total_fg_7 = Banana.SDecimal.subtract(sub_total_fg_6, fg_2);
   var sub_total_fg_8 = Banana.SDecimal.subtract(sub_total_fg_7, fg_4); 
   var sub_total_fg_9 = Banana.SDecimal.subtract(sub_total_fg_8, fg_5);  
   var sub_total_fg_10 = Banana.SDecimal.subtract(sub_total_fg_9, fg_6);
   var sub_total_fg_11 = Banana.SDecimal.subtract(sub_total_fg_10, fg_7);
   var total_fg = Banana.SDecimal.subtract(sub_total_fg_11, fg_8);
   total_fg = Banana.SDecimal.subtract(total_fg, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FG6")));
   
   var sub_total_fg_0_previous = 0;
   var sub_total_fg_1_previous = 0;
   var sub_total_fg_2_previous = 0;
   var sub_total_fg_3_previous = 0;
   var sub_total_fg_4_previous = 0;
   var sub_total_fg_5_previous = 0;
   var fe_3_previous = 0;
   var fg_2_previous = 0;
   var fg_4_previous = 0;
   var fg_5_previous = 0;
   var fg_6_previous = 0;
   var fg_7_previous = 0;
   var fg_8_previous = 0;
   var sub_total_fg_6_previous = 0;
   var sub_total_fg_7_previous = 0;
   var sub_total_fg_8_previous = 0;
   var sub_total_fg_9_previous = 0;
   var sub_total_fg_10_previous = 0;
   var sub_total_fg_11_previous = 0;
   var total_fg_previous = 0;
   if (previous) {
      sub_total_fg_0_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AJ")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AK")));
      sub_total_fg_1_previous = Banana.SDecimal.add(sub_total_fg_0_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AL")));
      sub_total_fg_2_previous = Banana.SDecimal.add(sub_total_fg_1_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AM")));
      sub_total_fg_3_previous = Banana.SDecimal.add(sub_total_fg_2_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("AN")));
      sub_total_fg_4_previous = Banana.SDecimal.subtract(sub_total_fg_3_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FG1")));
      sub_total_fg_5_previous = Banana.SDecimal.add(sub_total_fg_4_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FD6")));
      fe_3_previous = Banana.SDecimal.add(Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FE3"))), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FE3")));
      fg_2_previous = Banana.SDecimal.add(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FG2")), Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FG2"))));
      fg_4_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FG4")));
      fg_5_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FG5")));
      fg_6_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FG6")));
      fg_7_previous = Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FG7"));
      fg_8_previous = Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCurrentAmountFormatted("FG8"));
      sub_total_fg_6_previous = Banana.SDecimal.subtract(sub_total_fg_5_previous, fe_3_previous);
      sub_total_fg_7_previous = Banana.SDecimal.subtract(sub_total_fg_6_previous, fg_2_previous);
      sub_total_fg_8_previous = Banana.SDecimal.subtract(sub_total_fg_7_previous, fg_4_previous);
      sub_total_fg_9_previous = Banana.SDecimal.subtract(sub_total_fg_8_previous, fg_5_previous);
      sub_total_fg_10_previous = Banana.SDecimal.subtract(sub_total_fg_9_previous, fg_6_previous);
      sub_total_fg_11_previous = Banana.SDecimal.subtract(sub_total_fg_10_previous, fg_7_previous);
      total_fg_previous = Banana.SDecimal.subtract(sub_total_fg_11_previous, fg_8_previous);
      total_fg_previous = Banana.SDecimal.subtract(total_fg_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FG6")));
   }
   tableRow.addCell("FG", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fg), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fg_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FH */
   tableRow = table.addRow();
   var sub_total_fh_0 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FH1")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FH2")));
   var sub_total_fh_1 = Banana.SDecimal.subtract(sub_total_fh_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FH3")));
   var total_fh = Banana.SDecimal.subtract(sub_total_fh_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FH4")));
   total_fh = Banana.SDecimal.add(total_fh, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FH2")));

   var sub_total_fh_0_previous = 0;
   var sub_total_fh_1_previous = 0;
   var total_fh_previous = 0;
   if (previous) {
      sub_total_fh_0_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FH1")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FH2")));
      sub_total_fh_1_previous = Banana.SDecimal.subtract(sub_total_fh_0_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FH3")));
      total_fh_previous = Banana.SDecimal.subtract(sub_total_fh_1_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FH4")));
      total_fh_previous = Banana.SDecimal.add(total_fh_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FH2")));
   }
   tableRow.addCell("FH", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fh), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fh_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FI */
   tableRow = table.addRow();
   var sub_total_fi_0 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FI2")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FI1")));
   var sub_total_fi_1 = Banana.SDecimal.add(sub_total_fi_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FI1")));
   var sub_total_fi_2 = Banana.SDecimal.subtract(sub_total_fi_1, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FA1"))));
   var sub_total_fi_3 = Banana.SDecimal.subtract(sub_total_fi_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FI3")));
   var total_fi = Banana.SDecimal.add(Banana.SDecimal.invert(sub_total_fi_3), Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FI3")));
   
   var sub_total_fi_0_previous = 0;
   var sub_total_fi_1_previous = 0;
   var sub_total_fi_2_previous = 0;
   var sub_total_fi_3_previous = 0;
   var total_fi_previous = 0;
   if (previous) {
      sub_total_fi_0_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FI2")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FI1")));
      sub_total_fi_1_previous = Banana.SDecimal.add(sub_total_fi_0_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FI1")));
      sub_total_fi_2_previous = Banana.SDecimal.subtract(sub_total_fi_1_previous, Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FA1"))));
      sub_total_fi_3_previous = Banana.SDecimal.subtract(sub_total_fi_2_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FI3")));
      total_fi_previous = Banana.SDecimal.add(Banana.SDecimal.invert(sub_total_fi_3_previous), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FI3")));
   }
   
   tableRow.addCell("FI", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FI"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fi), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fi_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FJ */
   tableRow = table.addRow();
   var sub_total_fj_0 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FJ1")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FJ2")));
   var sub_total_fj_1 = Banana.SDecimal.add(sub_total_fj_0, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FJ2")));
   var sub_total_fj_2 = Banana.SDecimal.add(sub_total_fj_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("AS")));
   var sub_total_fj_3 = Banana.SDecimal.subtract(sub_total_fj_2, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FH3")));
   var total_fj = Banana.SDecimal.subtract(Banana.SDecimal.invert(sub_total_fj_3), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FH4")));
   
   var sub_total_fj_0_previous = 0;
   var sub_total_fj_1_previous = 0;
   var sub_total_fj_2_previous = 0;
   var sub_total_fj_3_previous = 0;
   var total_fj_previous = 0;
   if (previous) {
      sub_total_fj_0_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FJ1")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FJ2")));
      sub_total_fj_1_previous = Banana.SDecimal.add(sub_total_fj_0_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FJ2")));
      sub_total_fj_2_previous = Banana.SDecimal.add(sub_total_fj_1_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("AS")));
      sub_total_fj_3_previous = Banana.SDecimal.subtract(sub_total_fj_2_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FH3")));
      total_fj_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(sub_total_fj_3_previous), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FH4")));
   }
   tableRow.addCell("FJ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FJ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fj), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fj_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* ZC */
   tableRow = table.addRow();
   var zc_result_0 = Banana.SDecimal.subtract(Banana.SDecimal.invert(total_ff), total_fg);
   var zc_result_1 = Banana.SDecimal.subtract(zc_result_0, total_fh);
   var zc_result_2 = Banana.SDecimal.add(zc_result_1, total_fi);
   var zc_result = Banana.SDecimal.add(zc_result_2, total_fj);

   var zc_result_0_previous = 0;
   var zc_result_1_previous = 0;
   var zc_result_2_previous = 0;
   var zc_result_previous = 0;
   if (previous) {
      zc_result_0_previous = Banana.SDecimal.subtract(Banana.SDecimal.invert(total_ff_previous), total_fg_previous);
      zc_result_1_previous = Banana.SDecimal.subtract(zc_result_0_previous, total_fh_previous);
      zc_result_2_previous = Banana.SDecimal.add(zc_result_1_previous, total_fi_previous);
      zc_result_previous = Banana.SDecimal.add(zc_result_2_previous, total_fj_previous);
   }
   tableRow.addCell("ZC", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZC"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(zc_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(zc_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /*  */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Flux de trésorerie provenant du financement par les capitaux propres", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;background-color:#C0C0C0;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FK */
   tableRow = table.addRow();
   var total_fk = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FE4")));
   var total_fk_previous = 0;
   if (previous) {
      total_fk_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FE4"))); 
   }
   tableRow.addCell("FK", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FK"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fk), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fk_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FL */
   tableRow = table.addRow();
   var total_fl = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FL")));
   var total_fl_previous = 0;
   if (previous) {
      total_fl_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FL")));
   }
   tableRow.addCell("FL", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FL"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fl), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fl_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FM */
   tableRow = table.addRow();
   var total_fm = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FE6")));
   var total_fm_previous = 0;
   if (previous) {
      total_fm_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FE6")));
   }
   tableRow.addCell("FM", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FM"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fm), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fm_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FN */
   tableRow = table.addRow();
   var total_fn = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FE7")));
   var total_fn_previous = 0;
   if (previous) {
      total_fn_previous = Banana.SDecimal.invert(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FE7")));
   }
   tableRow.addCell("FN", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FN"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fn), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fn_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* ZD */
   tableRow = table.addRow();
   var zd_result_0 = Banana.SDecimal.add(total_fk, total_fl);
   var zd_result_1 = Banana.SDecimal.subtract(zd_result_0, total_fm);
   var zd_result = Banana.SDecimal.subtract(zd_result_1, total_fn);

   var zd_result_0_previous = 0;
   var zd_result_1_previous = 0;
   var zd_result_previous = 0;
   if (previous) {
      zd_result_0_previous = Banana.SDecimal.add(total_fk_previous, total_fl_previous);
      zd_result_1_previous = Banana.SDecimal.subtract(zd_result_0_previous, total_fm_previous);
      zd_result_previous = Banana.SDecimal.subtract(zd_result_1_previous, total_fn_previous);
   }
   tableRow.addCell("ZD", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZD"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(zd_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(zd_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /*  */
   tableRow = table.addRow();
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("Trésorerie provenant du financement par les capitaux étrangers", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;background-color:#C0C0C0;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell("", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");

   /* FO */
   tableRow = table.addRow();
   var sub_total_fo_1 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FO1")), Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FO2")));
   var total_fo = Banana.SDecimal.subtract(sub_total_fo_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FO3")));
   
   var sub_total_fo_1_previous = 0;
   var total_fo_previous = 0;
   if (previous) {
      sub_total_fo_1_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FO1")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FO2")));
      total_fo_previous = Banana.SDecimal.subtract(sub_total_fo_1_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FO3")));
   }
   tableRow.addCell("FO", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FO"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FO"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fo), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fo_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FP */
   tableRow = table.addRow();
   tableRow.addCell("FP", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FP"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FP"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectCurrentAmountFormatted("FP"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(bReport.getObjectPreviousAmountFormatted("FP"), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* FQ */
   tableRow = table.addRow();
   var sub_total_fq_1 = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReport.getObjectDebitAmountFormatted("FO1")), Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FO2")));
   var total_fq = Banana.SDecimal.subtract(sub_total_fq_1, Banana.Converter.toInternalNumberFormat(bReport.getObjectCreditAmountFormatted("FO3")));
   
   var sub_total_fq_1_previous = 0;
   var total_fq_previous = 0;
   if (previous) {
      sub_total_fq_1_previous = Banana.SDecimal.subtract(Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectDebitAmountFormatted("FO1")), Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FO2")));
      total_fq_previous = Banana.SDecimal.subtract(sub_total_fq_1_previous, Banana.Converter.toInternalNumberFormat(bReportPrevious.getObjectCreditAmountFormatted("FO3")));
   }
   tableRow.addCell("FQ", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("FQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectNote("FQ"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(formatValues(total_fq), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(total_fq_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* ZE */
   tableRow = table.addRow();
   var ze_result_0 = Banana.SDecimal.add(total_fo, Banana.Converter.toInternalNumberFormat(bReport.getObjectCurrentAmountFormatted("FP")));
   var ze_result = Banana.SDecimal.subtract(ze_result_0, total_fq);
   
   var ze_result_0_previous = 0;
   var ze_result_previous = 0;
   if (previous) {
      ze_result_0_previous = Banana.SDecimal.add(total_fo_previous, Banana.Converter.toInternalNumberFormat(bReport.getObjectPreviousAmountFormatted("FP")));
      ze_result_previous = Banana.SDecimal.subtract(ze_result_0_previous, total_fq_previous);
   }
   tableRow.addCell("ZE", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZE"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #C0C0C0;font-weight: bold");
   tableRow.addCell(formatValues(ze_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(ze_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* ZF */
   tableRow = table.addRow();
   var zf_result = Banana.SDecimal.add(zd_result, ze_result);
   
   var zf_result_previous = 0;
   if (previous) {
      zf_result_previous = Banana.SDecimal.add(zd_result_previous, ze_result_previous);
   }
   tableRow.addCell("ZF", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZF"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(zf_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(zf_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* ZG */
   tableRow = table.addRow();
   var zg_result_0 = Banana.SDecimal.add(zb_result, zc_result);
   var zg_result = Banana.SDecimal.add(zg_result_0, zf_result);

   var zg_result_0_previous = 0;
   var zg_result_previous = 0;
   if (previous) {
      zg_result_0_previous = Banana.SDecimal.add(zb_result_previous, zc_result_previous);
      zg_result_previous = Banana.SDecimal.add(zg_result_0_previous, zf_result_previous);
   }
   tableRow.addCell("ZG", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZG"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;font-weight: bold");
   tableRow.addCell(formatValues(zg_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(zg_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   
   /* ZH */
   tableRow = table.addRow();
   var zh_result = Banana.SDecimal.add(za_result, zg_result);
   var zh_result_previous = 0;
   if (previous) {
      zh_result_previous = Banana.SDecimal.add(za_result_previous, zg_result_previous);
   }
   tableRow.addCell("ZH", "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   tableRow.addCell(bReport.getObjectDescription("ZH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(bReport.getObjectNote("ZH"), "align-left", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5p;background-color: #000000;color: #FFFFFF;font-weight: bold");
   tableRow.addCell(formatValues(zh_result), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   if (previous) {
      tableRow.addCell(formatValues(zh_result_previous), "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   } else {
      tableRow.addCell("0.00", "align-right", 1).setStyleAttributes("border-top:thin solid black;border-left:thin solid black;border-right:thin solid black;padding-bottom:2px;padding-top:5px");
   }
   

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
    currentParam.value = userParam.column ? userParam.column : 'Gr2';
    currentParam.defaultvalue = 'Gr2';
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
    userParam.column = 'Gr2';
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
 