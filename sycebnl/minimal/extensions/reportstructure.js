// Copyright [2020] [Banana.ch SA - Lugano Switzerland]
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


/* Update: 2024-01-11 */


/**
 * Creates the report structure for each report type.
 * - "id" used as GR/GR1 and to identify the object
 * - "type" used to define the type of data (group, title or total)
 * - "indent" used to define the indent level for the print
 * - "bclass" used to define the bclass of the group
 * - "description" used to define the description text used for the print
 * - "sum" used to define how to calculate the total
 */


// Balance sheet 
function createReportStructureBalanceSheet() {
    var reportStructure = [];

    /* ACTIVE */
    reportStructure.push({"id":"GA", "type":"group", "note":"1", "bclass":"1", "description":"Immobilisations"});
    reportStructure.push({"id":"GB", "type":"group", "note":"2", "bclass":"1", "description":"Stocks"});
    reportStructure.push({"id":"GC", "type":"group", "note":"3", "bclass":"1", "description":"Adhérents, Clients-Usages et Autres Débiteurs"});
    reportStructure.push({"id":"GD", "type":"group", "note":"4", "bclass":"1", "description":"Caisses"});
    reportStructure.push({"id":"GE", "type":"group", "note":"4", "bclass":"1", "description":"Banques"});
    reportStructure.push({"id":"GZ", "type":"total", "note":"", "description":"TOTAL ACTIF (somme GA à GE)", "sum":"GA;GB;GC;GD;GE"});
    
    // To get CC, we sum up products and subtract by charges
    reportStructure.push({"id":"KA", "type":"group", "note":"4", "bclass":"4", "description":"Revenus encaissés"});
    reportStructure.push({"id":"KB", "type":"group", "note":"4", "bclass":"4", "description":"Autres recettes sur activités"});
    reportStructure.push({"id":"JA", "type":"group", "note":"14", "bclass":"3", "description":"Dépenses sur achat"});
    reportStructure.push({"id":"JB", "type":"group", "note":"14", "bclass":"3", "description":"Dépenses sur loyers"});
    reportStructure.push({"id":"JC", "type":"group", "note":"4", "bclass":"3", "description":"Dépenses sur Salaires"});
    reportStructure.push({"id":"JD", "type":"group", "note":"15", "bclass":"3", "description":"Dépenses sur impôts et Taxes"});
    reportStructure.push({"id":"JE", "type":"group", "note":"16", "bclass":"3", "description":"Charges d'intérêts"});
    reportStructure.push({"id":"JF", "type":"group", "note":"17", "bclass":"3", "description":"Autres dépenses sur activités"});
    reportStructure.push({"id":"VA", "type":"group", "note":"", "bclass":"3", "description":"+ Variation des stocks sur achats [N-(N-1)]"});
    reportStructure.push({"id":"JG", "type":"group", "note":"", "bclass":"3", "description":"-DOTATIONS AUX AMORTISSEMENTS"});

    /* PASSIVE */
    reportStructure.push({"id":"HA", "type":"group", "note":"8", "bclass":"2", "description":"Dotations"});
    reportStructure.push({"id":"HBT", "type":"group", "note":"", "bclass":"2", "description":"Résultat de l'Exercice (en + ou en )"});
    reportStructure.push({"id":"HB", "type":"group", "note":"", "description":"Résultat de l'Exercice (en + ou en )", "sum":"HBT;KA;KB;-JA;-JB;-JC;-JD;-JE;-JF;-VA;-JG"});
    reportStructure.push({"id":"HC", "type":"group", "note":"", "bclass":"2", "description":"Autres fonds propres"});
    reportStructure.push({"id":"HD", "type":"group", "note":"9", "bclass":"2", "description":"Fournisseurs et autres créditeurs"});
    reportStructure.push({"id":"HZ", "type":"total", "note":"", "description":"TOTAL PASSIF (somme HA à HD)", "sum":"HA;HB;HC;HD"});
    
    return reportStructure;
}


// Profit & Loss statement
function createReportStructureProfitLoss() {
    var reportStructure = [];

    reportStructure.push({"id":"GC", "type":"group", "note":"3", "bclass":"1", "description":"Adhérents, Clients-Usages et Autres Débiteurs"});

    reportStructure.push({"id":"HD", "type":"group", "note":"9", "bclass":"2", "description":"Fournisseurs et autres créditeurs"});

    reportStructure.push({"id":"KA", "type":"group", "note":"4", "bclass":"4", "description":"Revenus encaissés"});
    reportStructure.push({"id":"KB", "type":"group", "note":"4", "bclass":"4", "description":"Autres recettes sur activités"});
    reportStructure.push({"id":"KX", "type":"total", "note":"", "description":"REVENUS ENCAISSES (A)", "sum":"KA;KB"});
    reportStructure.push({"id":"JA", "type":"group", "note":"14", "bclass":"3", "description":"Dépenses sur achat"});
    reportStructure.push({"id":"JB", "type":"group", "note":"14", "bclass":"3", "description":"Dépenses sur loyers"});
    reportStructure.push({"id":"JC", "type":"group", "note":"4", "bclass":"3", "description":"Dépenses sur Salaires"});
    reportStructure.push({"id":"JD", "type":"group", "note":"15", "bclass":"3", "description":"Dépenses sur impôts et Taxes"});
    reportStructure.push({"id":"JE", "type":"group", "note":"16", "bclass":"3", "description":"Charges d'intérêts"});
    reportStructure.push({"id":"JF", "type":"group", "note":"17", "bclass":"3", "description":"Autres dépenses sur activités"});
    reportStructure.push({"id":"JX", "type":"total", "note":"", "description":"TOTAL DEPENSES SUR CHARGES (B)", "sum":"JA;JB;JC;JD;JE;JF"});
    reportStructure.push({"id":"KZ", "type":"total", "note":"", "description":"SOLDE: Excédent (+) ou Insuffisance (-) de recettes (C= A-B)", "sum":"KX;-JX"});
    reportStructure.push({"id":"VA", "type":"group", "note":"", "bclass":"3", "description":"+ Variation des stocks sur achats [N-(N-1)]"});
    reportStructure.push({"id":"VB", "type":"group", "note":"", "bclass":"3", "description":"+ Variation des créances [N-(N-1)]"});
    reportStructure.push({"id":"VC", "type":"group", "note":"", "bclass":"3", "description":"- Variation des dettes d'exploitation [N-(N-1)]"});
    reportStructure.push({"id":"JG", "type":"group", "note":"", "bclass":"3", "description":"-DOTATIONS AUX AMORTISSEMENTS"});
    reportStructure.push({"id":"KZC", "type":"total", "note":"", "description":"RESULTAT DE L'EXERCICE", "sum":"VA;VB;VC;JG;KZ"});

    
    return reportStructure;


    // CC = CCT + Total Products - Total Charges
}

