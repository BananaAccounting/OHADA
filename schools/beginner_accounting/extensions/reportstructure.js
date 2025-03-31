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


/* Update: 2025-03-25 */


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
    reportStructure.push({"id":"AF", "type":"group", "note":"", "bclass":"1", "description":"Brevets, licences et logiciels"});
    reportStructure.push({"id":"AG", "type":"group", "note":"", "bclass":"1", "description":"Fonds commercial"});
    reportStructure.push({"id":"AD", "type":"total", "note":"", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AF;AG"});

    reportStructure.push({"id":"AJ", "type":"group", "note":"", "bclass":"1", "description":"Terrains"});    
    reportStructure.push({"id":"AK", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments"});
    reportStructure.push({"id":"AM", "type":"group", "note":"", "bclass":"1", "description":"Matériel et mobiliers"});
    reportStructure.push({"id":"AN", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"AI", "type":"total", "note":"", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AJ;AK;AM;AN"});

    reportStructure.push({"id":"AZ", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AD;AI"});

    reportStructure.push({"id":"BB1", "type":"group", "note":"", "bclass":"1", "description":"Marchandises"});
    reportStructure.push({"id":"BB2", "type":"group", "note":"", "bclass":"1", "description":"Matières premières"});
    reportStructure.push({"id":"BB3", "type":"group", "note":"", "bclass":"1", "description":"Emballages"});
    reportStructure.push({"id":"BB", "type":"total", "note":"", "description":"STOCKS", "sum":"BB1;BB2;BB3"});

    reportStructure.push({"id":"BI", "type":"group", "note":"", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BJ", "type":"group", "note":"", "bclass":"1", "description":"Débiteurs divers"});
    reportStructure.push({"id":"BG", "type":"total", "note":"", "description":"CREANCES", "sum":"BI;BJ"});

    reportStructure.push({"id":"BK", "type":"total", "note":"", "description":"ACTIF CIRCULANT", "sum":"BB;BG"});

    reportStructure.push({"id":"BS1", "type":"group", "note":"", "bclass":"1", "description":"Banque"});
    reportStructure.push({"id":"BS2", "type":"group", "note":"", "bclass":"1", "description":"Caisse"});
    reportStructure.push({"id":"BT", "type":"total", "note":"", "description":"TOTAL TRESORERIE ACTIF= BS1+BS2", "sum":"BS1;BS2"});

    reportStructure.push({"id":"BZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZ;BK;BT"});

    // To get CJ, we sum up products and subtract by charges
    reportStructure.push({"id":"TA", "type":"group", "note":"", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"TB", "type":"group", "note":"", "bclass":"4", "description":"Ventes de produits fabriqués"});
    reportStructure.push({"id":"TC", "type":"group", "note":"", "bclass":"4", "description":"Travaux, services vendus"});
    reportStructure.push({"id":"TD", "type":"group", "note":"", "bclass":"4", "description":"Produits accessoires"});
    reportStructure.push({"id":"TE", "type":"group", "note":"", "bclass":"4", "description":"Production stockée (ou déstockage)"});
    reportStructure.push({"id":"TF", "type":"group", "note":"", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TG", "type":"group", "note":"", "bclass":"4", "description":"Subventions d'exploitation"});
    reportStructure.push({"id":"TH", "type":"group", "note":"", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TI", "type":"group", "note":"", "bclass":"4", "description":"Transferts de charges d'exploitation"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"", "bclass":"4", "description":"Reprises d'amortissements, provisions et dépréciations"});
    reportStructure.push({"id":"TK", "type":"group", "note":"", "bclass":"4", "description":"Revenus financiers et assimilés"});
    
    reportStructure.push({"id":"RA", "type":"group", "note":"", "bclass":"3", "description":"Achats de marchandises"});
    reportStructure.push({"id":"RB", "type":"group", "note":"", "bclass":"3", "description":"Variation de stocks de marchandises"});
    reportStructure.push({"id":"RC", "type":"group", "note":"", "bclass":"3", "description":"Achats de matières premières et fournitures liées"});
    reportStructure.push({"id":"RD", "type":"group", "note":"", "bclass":"3", "description":"Variation de stocks de matières premières et fournitures liées"});
    reportStructure.push({"id":"RE", "type":"group", "note":"", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"RF", "type":"group", "note":"", "bclass":"3", "description":"Variation de stocks d'autres approvisionnements"});
    reportStructure.push({"id":"RG", "type":"group", "note":"", "bclass":"3", "description":"Transports"});
    reportStructure.push({"id":"RH", "type":"group", "note":"", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"RI", "type":"group", "note":"", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"RJ", "type":"group", "note":"", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RK", "type":"group", "note":"", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"RL", "type":"group", "note":"", "bclass":"3", "description":"Dotations aux amortissements"});
    reportStructure.push({"id":"RM", "type":"group", "note":"", "bclass":"3", "description":"Frais financiers et charges assimilées"});

    /* PASSIVE */
    reportStructure.push({"id":"CA", "type":"group", "note":"", "bclass":"2", "description":"Capital"});
    reportStructure.push({"id":"CJT", "type":"group", "note":"", "bclass":"2", "description":"Résultat net (bénéfice + ou perte -)"});
    reportStructure.push({"id":"CJ", "type":"group", "note":"", "bclass":"1", "description":"Résultat net (bénéfice + ou perte -)", 
                            "sum":"CJT;TA;TB;TC;TD;TE;TF;TG;TH;TJ;TK;-RA;-RB;-RC;-RD;-RE;-RF;-RG;-RH;-RI;-RJ;-RK;-RL;-RM"});
    reportStructure.push({"id":"CP", "type":"total", "note":"", "description":"TOTAL CAPITAUX PROPRES ET RESSOURCES = CA + CJ", "sum":"CA;CJ"});
    reportStructure.push({"id":"DA", "type":"group", "note":"", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DD", "type":"total", "note":"", "description":"TOTAL DETTES FINANCIERES", "sum":"DA"});
    reportStructure.push({"id":"DF", "type":"total", "note":"", "description":"TOTAL RESSOURCES STABLES = CP + DD", "sum":"CP;DD"});
    reportStructure.push({"id":"DJ", "type":"group", "note":"", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DK1", "type":"group", "note":"", "bclass":"2", "description":"Etat"});
    reportStructure.push({"id":"DK2", "type":"group", "note":"", "bclass":"2", "description":"Organismes sociaux"});
    reportStructure.push({"id":"DM", "type":"group", "note":"", "bclass":"2", "description":"Créditeurs divers"});
    
    reportStructure.push({"id":"DP", "type":"total", "note":"", "description":"TOTAL PASSIF CIRCULANT", "sum":"DJ;DK1;DK2;DM"});
    reportStructure.push({"id":"DR", "type":"group", "note":"", "bclass":"2", "description":"Banques, crédits de trésorerie"});
    reportStructure.push({"id":"DQ", "type":"group", "note":"", "bclass":"2", "description":"Banques, crédits d'escompte"});
    reportStructure.push({"id":"DT", "type":"total", "note":"", "description":"TOTAL TRESORERIE PASSIF", "sum":"DQ;DR"});

    reportStructure.push({"id":"DZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"DF;DP;DT"});

    return reportStructure;
}


// Profit & Loss statement
function createReportStructureProfitLoss() {
    var reportStructure = [];

    reportStructure.push({"id":"RA", "type":"group", "note":"", "bclass":"3", "description":"Achats de marchandises"});
    reportStructure.push({"id":"RB", "type":"group", "note":"", "bclass":"3", "description":"Variation de stocks de marchandises"});
    reportStructure.push({"id":"RC", "type":"group", "note":"", "bclass":"3", "description":"Achats de matières premières"});
    reportStructure.push({"id":"RD", "type":"group", "note":"", "bclass":"3", "description":"Variation de stocks de matières premières"});
    reportStructure.push({"id":"RE", "type":"group", "note":"", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"RF", "type":"group", "note":"", "bclass":"3", "description":"Variation de stocks d'autres approvisionnements"});
    reportStructure.push({"id":"RG", "type":"group", "note":"", "bclass":"3", "description":"Transports"});
    reportStructure.push({"id":"RH", "type":"group", "note":"", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"RI", "type":"group", "note":"", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"RJ", "type":"group", "note":"", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RK", "type":"group", "note":"", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"RL", "type":"group", "note":"", "bclass":"3", "description":"Dotations aux amortissements"});
    reportStructure.push({"id":"RM", "type":"group", "note":"", "bclass":"3", "description":"Frais financiers et charges assimilées"});
    

    reportStructure.push({"id":"TA", "type":"group", "note":"", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"TB", "type":"group", "note":"", "bclass":"4", "description":"Ventes de produits fabriqués"});
    reportStructure.push({"id":"TC", "type":"group", "note":"", "bclass":"4", "description":"Travaux, services vendus"});
    reportStructure.push({"id":"TD", "type":"group", "note":"", "bclass":"4", "description":"Produits accessoires"});
    reportStructure.push({"id":"TE", "type":"group", "note":"", "bclass":"4", "description":"Production stockée (ou déstockage)"});
    reportStructure.push({"id":"TF", "type":"group", "note":"", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TG", "type":"group", "note":"", "bclass":"4", "description":"Subventions d'exploitation"});
    reportStructure.push({"id":"TH", "type":"group", "note":"", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"", "bclass":"4", "description":"Reprises d'amortissements"});
    reportStructure.push({"id":"TK", "type":"group", "note":"", "bclass":"4", "description":"Revenus financiers et assimilés"});
    
    reportStructure.push({"id":"TOTAL PRODUITS", "type":"total", "note":"", "description":"TOTAL", "sum":"TA;TB;TC;TD;TE;TF;TG;TH;TJ;TK"});

    reportStructure.push({"id":"TOTAL CHARGES", "type":"total", "note":"", "description":"TOTAL", "sum":"RA;RB;RC;RD;RE;RF;RG;RH;RI;RJ;RK;RL;RM"});
    
    return reportStructure;


    // CJ = CJ + Total Products - Total Charges
}

