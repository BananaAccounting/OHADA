// Copyright [2025] [Banana.ch SA - Lugano Switzerland]
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


// @id = ch.banana.africa.secondaryschool.test
// @api = 1.0
// @pubdate = 2025-03-09
// @publisher = Banana.ch SA
// @description = <TEST ch.banana.africa.secondaryschool.test.js>
// @task = app.command
// @doctype = *.*
// @docproperties = 
// @outputformat = none
// @inputdataform = none
// @includejs = ../ch.banana.africa.secondaryschool.js
// @timeout = -1



// Register test case to be executed
Test.registerTestCase(new SecondarySchoolReport());

// Here we define the class, the name of the class is not important
function SecondarySchoolReport() {

}

// This method will be called at the beginning of the test case
SecondarySchoolReport.prototype.initTestCase = function() {

}

// This method will be called at the end of the test case
SecondarySchoolReport.prototype.cleanupTestCase = function() {

}

// This method will be called before every test method is executed
SecondarySchoolReport.prototype.init = function() {

}

// This method will be called after every test method is executed
SecondarySchoolReport.prototype.cleanup = function() {

}

SecondarySchoolReport.prototype.testBananaExtension = function() {

	/**
	 * Test 1: column Gr
	 */
	var banDoc = Banana.application.openDocument("file:script/../test/testcases/example_public_secondary_school_2025.ac2");
	Test.assert(banDoc);

	var userParam = {};
  	userParam.selectionStartDate = "2025-01-01";
  	userParam.selectionEndDate = "2025-12-31";
  	userParam.title = "RAPPORT FINANCIER";
	userParam.logo = false;
	userParam.logoname = 'Logo';
	userParam.printheader = false;
	userParam.printtitle = true;
	userParam.title = '';
	userParam.column = 'Gr1';
	userParam.printcolumn = false;

	var reportStructure = createReportStructureSecondaryFinancialReport();

	const bReport = new BReport(banDoc, userParam, reportStructure);
	bReport.validateGroups(userParam.column);
	bReport.loadBalances();
	bReport.calculateTotals(["currentAmount", "previousAmount", "openingAmount"]);
	bReport.formatValues(["currentAmount", "previousAmount", "openingAmount"]);
	bReport.excludeEntries();

	var report = printfinancialreport(banDoc, userParam, bReport, "");
	Test.logger.addReport("Test 'Rapport Financier'", report);


}