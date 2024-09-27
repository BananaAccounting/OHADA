// Copyright [2024] [Banana.ch SA - Lugano Switzerland]
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//


// @id = ch.banana.africa.cashflow.test
// @api = 1.0
// @pubdate = 2024-08-05
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.africa.cashflow.test.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.africa.cashflow.js
// @timeout = -1



// Register test case to be executed
Test.registerTestCase(new CashFlowReport());

// Here we define the class, the name of the class is not important
function CashFlowReport() {

}

// This method will be called at the beginning of the test case
CashFlowReport.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
CashFlowReport.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
CashFlowReport.prototype.init = function() {

}

// This method will be called after every test method is executed
CashFlowReport.prototype.cleanup = function() {

}

CashFlowReport.prototype.testBananaExtension = function() {

	/**
	 * Test 1: column Gr
	 */
	var banDoc = Banana.application.openDocument("file:script/../test/testcases/enterprise_syscohada_test_2023.ac2");
    var previous = Banana.application.openDocument("file:script/../test/testcases/enterprise_syscohada_test_2022.ac2");
	
    Test.assert(banDoc);
    Test.assert(previous);

	var userParam = {};
  	userParam.selectionStartDate = "2023-01-01";
  	userParam.selectionEndDate = "2023-12-31";
  	userParam.title = "BILAN 2023";
	userParam.logo = false;
	userParam.logoname = 'Logo';
	userParam.printheader = false;
	userParam.printtitle = true;
	userParam.title = '';
	userParam.column = 'Gr2';
	userParam.printcolumn = false;

    var userParamPrevious = {};
    userParamPrevious.selectionStartDate = "2022-01-01";
    userParamPrevious.selectionEndDate = "2022-12-31";
    userParamPrevious.title = "BILAN 2022";
	userParamPrevious.logo = false;
	userParamPrevious.logoname = 'Logo';
	userParamPrevious.printheader = false;
	userParamPrevious.printtitle = true;
	userParamPrevious.title = '';
	userParamPrevious.column = 'Gr2';
	userParamPrevious.printcolumn = false;

	var reportStructure = createReportStructureCashFlow();
    var reportStructurePrev = createReportStructureCashFlow();

	const bReport = new BReport(banDoc, userParam, reportStructure);
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

	var report = printCashFlow(banDoc, previous, userParam, bReport, bReportPrevious);
	Test.logger.addReport("Test 'Cash Flow'", report);


}