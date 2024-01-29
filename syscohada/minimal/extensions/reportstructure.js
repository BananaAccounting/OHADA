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


/* Update: 2020-01-14 */


/**
 * Creates the report structure for each report type.
 * - "id" used as GR/GR1 and to identify the object
 * - "type" used to define the type of data (group, title or total)
 * - "indent" used to define the indent level for the print
 * - "bclass" used to define the bclass of the group
 * - "description" used to define the description text used for the print
 * - "sum" used to define how to calculate the total
 */



// Balance Sheet
function createReportStructure() {
    var reportStructure = [];

    /* ACTIVE */
    reportStructure.push({"id":"1", "type":"group", "note":"1", "bclass":"1", "description":"Immobilisations"});
    reportStructure.push({"id":"2", "type":"group", "note":"2", "bclass":"1", "description":"Stocks"});
    reportStructure.push({"id":"3", "type":"group", "note":"3", "bclass":"1", "description":"Clients et débiteurs divers"});
    reportStructure.push({"id":"4", "type":"group", "note":"", "bclass":"1", "description":"Caisse"});
    reportStructure.push({"id":"5", "type":"group", "note":"", "bclass":"1", "description":"Banque (en + ou en -)"});
    reportStructure.push({"id":"A", "type":"total", "note":"", "description":"Total actif", "sum":"1;2;3;4;5"});

    /* PASSIVE */
    reportStructure.push({"id":"6", "type":"group", "note":"", "bclass":"2", "description":"Compte d'exploitant"});
    reportStructure.push({"id":"7", "type":"total", "note":"", "description":"Résultat exercice","sum": "11;12;-13;-14;-15;-16;-17;-18;-19;-30"});
    reportStructure.push({"id":"8", "type":"group", "note":"", "bclass":"2", "description":"Emprunt"});
    reportStructure.push({"id":"9", "type":"group", "note":"3", "bclass":"2", "description":"Fournisseurs et créditeurs divers"});
    reportStructure.push({"id":"10", "type":"group", "note":"", "bclass":"2", "description":"Impôt dû"});
    reportStructure.push({"id":"P", "type":"total", "note":"", "description":"Total passif", "sum":"6;7;8;9;10"});

    reportStructure.push({"id":"AP", "type":"total", "note":"", "description":"Difference Active-Passive", "sum":"A;P"});

    /* PROFIT & LOSS */
    reportStructure.push({"id":"11", "type":"group", "note":"4", "bclass":"4", "description":"Recettes sur ventes ou prestations de services"});
    reportStructure.push({"id":"12", "type":"group", "note":"4", "bclass":"4", "description":"Autres recettes sur activités"});
    reportStructure.push({"id":"RP", "type":"total", "note":"A", "description":"TOTAL DES RECETTES SUR PRODUITS", "sum":"11;12"});
    reportStructure.push({"id":"13", "type":"group", "note":"4", "bclass":"3", "description":"Dépenses sur achats"});
    reportStructure.push({"id":"14", "type":"group", "note":"4", "bclass":"3", "description":"Dépenses sur loyers"});
    reportStructure.push({"id":"15", "type":"group", "note":"4", "bclass":"3", "description":"Dépenses sur salaires"});
    reportStructure.push({"id":"16", "type":"group", "note":"4", "bclass":"3", "description":"Dépenses sur impôts et taxes"});
    reportStructure.push({"id":"17", "type":"group", "note":"", "bclass":"3", "description":"Charges d'intérêts"});
    reportStructure.push({"id":"18", "type":"group", "note":"4", "bclass":"3", "description":"Autres dépenses sur activités"});
    reportStructure.push({"id":"B", "type":"total", "note":"B", "description":"TOTAL DÉPENSES SUR CHARGES", "sum":"13;14;15;16;17;18"});
    reportStructure.push({"id":"C", "type":"total", "note":"C", "description":"SOLDE: Excédent (+) ou insuffisance (-) de recettes (C=A-B)", "sum":"RP;-B"});
    reportStructure.push({"id":"19", "type":"group", "note":"2", "bclass":"3", "description":"- Variations des stocks N / N-1"});
    reportStructure.push({"id":"20", "type":"group", "note":"3", "bclass":"3", "description":"- Variations des créances N / N-1", "sum":"3"});
    reportStructure.push({"id":"21", "type":"group", "note":"3", "bclass":"3", "description":"+ Variations des dettes d'exploitation N / N-1", "sum":"9;10"});
    reportStructure.push({"id":"D", "type":"total", "note":"D", "description":"VARIATION A COURT TERME", "sum":"19;20;21"});
    reportStructure.push({"id":"22", "type":"group", "note":"", "bclass":"3", "description":"Acquisition des Immobilisations"});
    reportStructure.push({"id":"23", "type":"group", "note":"", "bclass":"3", "description":"Apport en Numéraire"});
    reportStructure.push({"id":"24", "type":"group", "note":"", "bclass":"3", "description":"Prélèvement"});
    reportStructure.push({"id":"28", "type":"group", "note":"", "bclass":"3", "description":"Emprunt"});
    reportStructure.push({"id":"29", "type":"group", "note":"", "bclass":"3", "description":"Remboursement des Emprunts"});
    reportStructure.push({"id":"E", "type":"total", "note":"E", "description":"VARIATION A LONG TERME", "sum":"22;23;24;28;29"});
    reportStructure.push({"id":"30", "type":"group", "note":"F", "bclass":"3", "description":"DOTATIONS AMORTISSEMENTS"});
    reportStructure.push({"id":"G", "type":"group", "note":"G", "description":"RESULTAT EXERCICE (G=C-D+E-F)", "sum":"C;-D;E;-30"});



    return reportStructure;
}
    