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
    reportStructure.push({"id":"GZ", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"GA;GB;GC;GD;GE"});
    
    // To get CC, we sum up products and subtract by charges
    reportStructure.push({"id":"TA", "type":"group", "note":"14", "bclass":"4", "description":"Achats de biens, marchandises et matières premières et Fournitures liées"});
    reportStructure.push({"id":"TB", "type":"group", "note":"14", "bclass":"4", "description":"Autres achats"});
    reportStructure.push({"id":"TC", "type":"group", "note":"4", "bclass":"4", "description":"Variation de stocks des biens, marchandises et matières premières, Fournitures et autres"});
    reportStructure.push({"id":"TD", "type":"group", "note":"15", "bclass":"4", "description":"Transport"});
    reportStructure.push({"id":"TG", "type":"group", "note":"16", "bclass":"4", "description":"Services extérieurs"});
    reportStructure.push({"id":"TH", "type":"group", "note":"17", "bclass":"4", "description":"Impôts et taxes"});
    reportStructure.push({"id":"TI", "type":"group", "note":"18", "bclass":"4", "description":"Autres charges"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"19", "bclass":"4", "description":"Charges de personnel"});
    reportStructure.push({"id":"TK", "type":"group", "note":"20", "bclass":"4", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"TL", "type":"group", "note":"21", "bclass":"4", "description":"Dotations aux amortissements, aux provissions, aux dépréciations et autres"});
    reportStructure.push({"id":"TM", "type":"group", "note":"22", "bclass":"4", "description":"Produits H.A.O"});
    reportStructure.push({"id":"TN", "type":"group", "note":"22", "bclass":"4", "description":"Charges H.A.O"});
    reportStructure.push({"id":"RA", "type":"group", "note":"23", "bclass":"3", "description":"Fonds d'Administration consommés"});
    reportStructure.push({"id":"RB", "type":"group", "note":"23", "bclass":"3", "description":"Ventes March., Produits finis et Prestations de Services"});
    reportStructure.push({"id":"RC", "type":"group", "note":"23", "bclass":"3", "description":"Subventions d'exploitations"});
    reportStructure.push({"id":"RD", "type":"group", "note":"23", "bclass":"3", "description":"Autres Produits et Transferts  de charges"});
    reportStructure.push({"id":"RE", "type":"group", "note":"23", "bclass":"3", "description":"Reprises de Provisions"});

    /* PASSIVE */
    reportStructure.push({"id":"HA", "type":"group", "note":"8", "bclass":"2", "description":"Dotations"});
    reportStructure.push({"id":"HB", "type":"group", "note":"", "bclass":"2", "description":"Résultat de l'Exercice (en + ou en )"});
    reportStructure.push({"id":"HCT", "type":"group", "note":"", "bclass":"2", "description":"Autres fonds propres"});
    reportStructure.push({"id":"HC", "type":"group", "note":"", "description":"Autres fonds propres", "sum":"HCT;TA;TB;TC;TD;TG;TH;TI;TJ;TK;TL;TM;TN;-RA;-RB;-RC;-RD;-RE"});
    reportStructure.push({"id":"HD", "type":"group", "note":"9", "bclass":"2", "description":"Fournisseurs et autres créditeurs"});
    reportStructure.push({"id":"CZ", "type":"total", "note":"", "description":"TOTAL RESSOURCES PROPRES ET ASSIMILEES", "sum":"HA;HB;HC;HD"});
    
    return reportStructure;
}


// Profit & Loss statement
function createReportStructureProfitLoss() {
    var reportStructure = [];

    reportStructure.push({"id":"KA", "type":"group", "note":"4", "bclass":"4", "description":"Revenus encaissés"});
    reportStructure.push({"id":"KB", "type":"group", "note":"4", "bclass":"4", "description":"Autres recettes sur activités"});
    reportStructure.push({"id":"XA", "type":"total", "note":"", "description":"REVENUS ENCAISSES (A)", "sum":"KA;KB"});
    reportStructure.push({"id":"JA", "type":"group", "note":"14", "bclass":"4", "description":"Dépenses sur achat"});
    reportStructure.push({"id":"JB", "type":"group", "note":"14", "bclass":"4", "description":"Dépenses sur loyers"});
    reportStructure.push({"id":"JC", "type":"group", "note":"4", "bclass":"4", "description":"Dépenses sur Salaires"});
    reportStructure.push({"id":"JD", "type":"group", "note":"15", "bclass":"4", "description":"Dépenses sur impôts et Taxes"});
    reportStructure.push({"id":"JE", "type":"group", "note":"16", "bclass":"4", "description":"Charges d'intérêts"});
    reportStructure.push({"id":"JF", "type":"group", "note":"17", "bclass":"4", "description":"Autres dépenses sur activités"});
    reportStructure.push({"id":"JX", "type":"total", "note":"", "description":"TOTAL DEPENSES SUR CHARGES (B)", "sum":"TA;TB;TC;TD;TG;TH;TI;TJ;TK;TL;TM;TN"});
    reportStructure.push({"id":"KZ", "type":"total", "note":"", "description":"SOLDE: Excédent (+) ou Insuffisance (-) de recettes (C= A-B)", "sum":"-XA;-XB"});
    reportStructure.push({"id":"VA", "type":"group", "note":"", "bclass":"4", "description":"+ Variation des stocks sur achats [N-(N-1)]"});
    reportStructure.push({"id":"VA", "type":"group", "note":"", "bclass":"4", "description":"+ Variation des créances [N-(N-1)]"});
    reportStructure.push({"id":"VA", "type":"group", "note":"", "bclass":"4", "description":"- Variation des dettes d'exploitation [N-(N-1)]"});
    reportStructure.push({"id":"VA", "type":"group", "note":"", "bclass":"4", "description":"-DOTATIONS AUX AMORTISSEMENTS"});
    reportStructure.push({"id":"KZ", "type":"total", "note":"", "description":"RESULTAT DE L'EXERCICE", "sum":"-XA;-XB"});

    
    return reportStructure;


    // CC = CCT + Total Products - Total Charges
}

