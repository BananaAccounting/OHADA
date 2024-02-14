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


/* Update: 2020-07-06 */


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
    reportStructure.push({"id":"AD", "type":"total", "note":"3", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AF"});
    reportStructure.push({"id":"ADA", "type":"total", "note":"3", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AFA"});
    reportStructure.push({"id":"AD-(ADA)", "type":"total", "note":"3", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AD;ADA"});

    reportStructure.push({"id":"AE", "type":"group", "note":"", "bclass":"1", "description":"Frais de développement et de prospection"});

    reportStructure.push({"id":"AF", "type":"group", "note":"3", "bclass":"1", "description":"Brevets, licences, logiciels, et  droits similaires"});
    reportStructure.push({"id":"AFA", "type":"group", "note":"", "bclass":"1", "description":"Brevets, licences, logiciels, et  droits similaires"});
    reportStructure.push({"id":"AF-(AFA)", "type":"total", "note":"", "description":"Brevets, licences, logiciels, et  droits similaires", "sum":"AF;AFA"});

    reportStructure.push({"id":"AG", "type":"group", "note":"", "bclass":"1", "description":"Fonds commercial et droit au bail"});
    reportStructure.push({"id":"AH", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisation incorporelles"});

    reportStructure.push({"id":"AI", "type":"total", "note":"3", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AJ;AK;AM;AN;AP"}); 
    reportStructure.push({"id":"AIA", "type":"total", "note":"3", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AKA;AMA;ANA;APA"});
    reportStructure.push({"id":"AI-(AIA)", "type":"total", "note":"3", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AI;AIA"});

    reportStructure.push({"id":"AJ", "type":"group", "note":"", "bclass":"1", "description":"Terrains (1) dont Placement en  Net......./......."});    

    reportStructure.push({"id":"AK", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments (1) dont Placement en  Net......./......."});
    reportStructure.push({"id":"AKA", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments (1) dont Placement en  Net......./......."});
    reportStructure.push({"id":"AK-(AKA)", "type":"total", "note":"", "description":"Bâtiments (1) dont Placement en  Net......./.......", "sum":"AK;AKA"});

    reportStructure.push({"id":"AL", "type":"group", "note":"", "bclass":"1", "description":"Aménagements, agencements et installations"});

    reportStructure.push({"id":"AM", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AMA", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AM-(AMA)", "type":"total", "note":"", "description":"Matériel, mobilier et actifs biologiques", "sum":"AM;AMA"});

    reportStructure.push({"id":"AN", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"ANA", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"AN-(ANA)", "type":"total", "note":"", "description":"Matériel de transport", "sum":"AN;ANA"});

    reportStructure.push({"id": "AP1", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations"});
    reportStructure.push({"id": "AP1A", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations"});
    reportStructure.push({"id": "AP2", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations"});
    reportStructure.push({"id": "AP2A", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations"});
    reportStructure.push({"id":"AP", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations", "sum":"AP1;AP2"});
    reportStructure.push({"id":"APA", "type":"group", "note":"3", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations", "sum":"AP1A;AP2A"});
    reportStructure.push({"id":"AP-(APA)", "type":"total", "note":"3", "description":"Avances et acomptes versés sur immobilisations", "sum":"AP;APA"});

    reportStructure.push({"id":"AQ", "type":"total", "note":"4", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AR;AS"});
    reportStructure.push({"id":"AQA", "type":"total", "note":"4", "description":"IMMOBILISATIONS FINANCIERES", "sum":""});
    reportStructure.push({"id":"AQ-(AQA)", "type":"total", "note":"4", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AQ"});

    reportStructure.push({"id":"AR", "type":"group", "note":"", "bclass":"1", "description":"Titres de participation"});
    reportStructure.push({"id":"AS", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations financières"});

    reportStructure.push({"id":"AZ", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AD;AI;AQ"});
    reportStructure.push({"id":"AZA", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"ADA;AIA"});
    reportStructure.push({"id":"AZ-(AZA)", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AZ;AZA"});

    reportStructure.push({"id":"BA", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO", "sum":"BA1;BA2;BA3"});
    reportStructure.push({"id":"BA1", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});
    reportStructure.push({"id":"BA2", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});
    reportStructure.push({"id":"BA3", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});

    reportStructure.push({"id":"BB", "type":"group", "note":"6", "bclass":"1", "description":"STOCKS ET ENCOURS"});
    reportStructure.push({"id":"BBA", "type":"group", "note":"6", "bclass":"1", "description":"STOCKS ET ENCOURS"});
    reportStructure.push({"id":"BB-(BBA)", "type":"total", "note":"6", "description":"STOCKS ET ENCOURS", "sum":"BB;BBA"});

    reportStructure.push({"id":"BG", "type":"total", "note":"", "description":"CREANCES ET EMPLOIS ASSIMILES", "sum":"BH;BI;BJ"});
    reportStructure.push({"id":"BGA", "type":"total", "note":"", "description":"CREANCES ET EMPLOIS ASSIMILES", "sum":"BHA;BIA;BJA"});
    reportStructure.push({"id":"BG-(BGA)", "type":"total", "note":"", "description":"CREANCES ET EMPLOIS ASSIMILES", "sum":"BG;BGA"});

    reportStructure.push({"id":"BH", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs avances versées"});
    reportStructure.push({"id":"BHA", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs avances versées"});
    reportStructure.push({"id":"BH-(BHA)", "type":"total", "note":"17", "description":"Fournisseurs avances versées", "sum":"BH;BHA"});

    reportStructure.push({"id":"BI", "type":"group", "note":"7", "bclass":"1", "description":"Clients", "sum":"BI1;BI2;BI3"});
    reportStructure.push({"id":"BI1", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BI2", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BI3", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BIA", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BI-(BIA)", "type":"total", "note":"7", "description":"Clients", "sum":"BI;BIA"});

    reportStructure.push({"id":"BJ", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances", "sum":"BJ1;BJ2;BJ3;BJ4;BJ5;BJ6;BJ7;BJ8;BJ9;BJ10;BJ11;BJ12;BJ13"});
    reportStructure.push({"id":"BJ1", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ2", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ3", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ4", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ5", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ6", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ7", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ8", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ9", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ10", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ11", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ12", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ13", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJA", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ-(BJA)", "type":"total", "note":"8", "description":"Autres créances", "sum":"BJ;BJA"});

    reportStructure.push({"id":"BK", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BA;BB;BG"});
    reportStructure.push({"id":"BKA", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BBA;BGA"});
    reportStructure.push({"id":"BK-(BKA)", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BK;BGA"});

    reportStructure.push({"id":"BQ", "type":"group", "note":"9", "bclass":"1", "description":"Titres de placement"});
    reportStructure.push({"id":"BR", "type":"group", "note":"10", "bclass":"1", "description":"Valeurs à encaisser"});

    reportStructure.push({"id":"BS", "type":"group", "note":"11", "bclass":"1", "description":"Banques, chèques postaux, caisse et assimilés"});
    reportStructure.push({"id":"BSA", "type":"group", "note":"11", "bclass":"1", "description":"Banques, chèques postaux, caisse et assimilés"});
    reportStructure.push({"id":"BS-(BSA)", "type":"total", "note":"11", "description":"Banques, chèques postaux, caisse et assimilés", "sum":"BS;BSA"});

    reportStructure.push({"id":"BT", "type":"total", "note":"", "description":"TOTAL TRESORERIE-ACTIF", "sum":"BR;BS"});
    reportStructure.push({"id":"BTA", "type":"total", "note":"", "description":"TOTAL TRESORERIE-ACTIF", "sum":"BSA"});
    reportStructure.push({"id":"BT-(BTA)", "type":"total", "note":"", "description":"TOTAL TRESORERIE-ACTIF", "sum":"BT;BTA"});

    reportStructure.push({"id":"BU", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif", "sum":"BU1;BU2;BU3;BU5"});
    reportStructure.push({"id":"BU1", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});
    reportStructure.push({"id":"BU2", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});
    reportStructure.push({"id":"BU3", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});
    reportStructure.push({"id":"BU5", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});

    reportStructure.push({"id":"BZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZ;BK;BT;BU"});
    reportStructure.push({"id":"BZA", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZA;BKA;BTA"});
    reportStructure.push({"id":"BZ-(BZA)", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"BZ;BZA"});

    // To get CJ, we sum up products and subtract by charges
    reportStructure.push({"id":"TA", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"TB", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de produits fabriqués"});
    reportStructure.push({"id":"TC", "type":"group", "note":"21", "bclass":"4", "description":"Travaux, services vendus"});
    reportStructure.push({"id":"TD", "type":"group", "note":"21", "bclass":"4", "description":"Produits accessoires"});
    reportStructure.push({"id":"TE", "type":"group", "note":"6", "bclass":"4", "description":"Production stockée (ou déstockage)"});
    reportStructure.push({"id":"TF1", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TF2", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TF", "type":"group", "note":"21", "bclass":"3", "description":"Production immobilisée", "sum":"TF1;TF2"});
    reportStructure.push({"id":"TG", "type":"group", "note":"21", "bclass":"4", "description":"Subventions d’exploitation"});
    reportStructure.push({"id":"TH1", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TH2", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TH", "type":"group", "note":"21", "bclass":"3", "description":"Autres produits", "sum":"TH1;TH2"});
    reportStructure.push({"id":"TI", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges d'exploitation"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"28", "bclass":"4", "description":"Reprises d’amortissements, provisions et dépréciations"});
    reportStructure.push({"id":"TL", "type":"group", "note":"28", "bclass":"4", "description":"Reprises de provisions  et dépréciations financières"});
    reportStructure.push({"id":"TM", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges financières"});
    reportStructure.push({"id":"TN1", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TN2", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TN", "type":"group", "note":"3D", "bclass":"3", "description":"Produits des cessions d'immobilisations", "sum":"TN1;TN2"});
    reportStructure.push({"id":"TO", "type":"group", "note":"30", "bclass":"4", "description":"Autres Produits HAO"});
    reportStructure.push({"id":"RA", "type":"group", "note":"22", "bclass":"3", "description":"Achats de marchandises"});
    reportStructure.push({"id":"RB", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de marchandises"});
    reportStructure.push({"id":"RC", "type":"group", "note":"22", "bclass":"3", "description":"Achats de matières premières et fournitures liées"});
    reportStructure.push({"id":"RD", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de matières premières et fournitures liées"});
    reportStructure.push({"id":"RE", "type":"group", "note":"22", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"RF", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks d’autres approvisionnements"});
    reportStructure.push({"id":"RG", "type":"group", "note":"23", "bclass":"3", "description":"Transports"});
    reportStructure.push({"id":"RH", "type":"group", "note":"24", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"RI", "type":"group", "note":"25", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"RJ1", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RJ2", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RJ", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges", "sum":"RJ1;RJ2"});
    reportStructure.push({"id":"RK", "type":"group", "note":"27", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"RL", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux amortissements, aux provisions et dépréciations"});
    reportStructure.push({"id":"RM", "type":"group", "note":"29", "bclass":"3", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"RN", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux provisions et aux dépréciations financières"});
    reportStructure.push({"id":"RO", "type":"group", "note":"3D", "bclass":"3", "description":"Valeurs comptables des cessions d'immobilisations"});
    reportStructure.push({"id":"RP", "type":"group", "note":"30", "bclass":"3", "description":"Autres Charges HAO"});
    reportStructure.push({"id":"RQ", "type":"group", "note":"30", "bclass":"3", "description":"Participation des travailleurs"});
    reportStructure.push({"id":"RS", "type":"group", "note":"", "bclass":"3", "description":"Impôts sur le résultat"});

    /* PASSIVE */
    reportStructure.push({"id":"CA", "type":"group", "note":"13", "bclass":"2", "description":"Capital"});
    reportStructure.push({"id":"CB", "type":"group", "note":"13", "bclass":"2", "description":"Apporteurs capital non appelé (-)"});
    reportStructure.push({"id":"CD", "type":"group", "note":"14", "bclass":"2", "description":"Primes liées au capital social"});
    reportStructure.push({"id":"CE1", "type":"group", "note":"3e", "bclass":"2", "description":"Ecarts de réévaluation"});
    reportStructure.push({"id":"CE2", "type":"group", "note":"3e", "bclass":"2", "description":"Ecarts de réévaluation"});
    reportStructure.push({"id":"CE", "type":"group", "note":"3e", "bclass":"1", "description":"Ecarts de réévaluation", "sum":"CE1;CE2"});
    reportStructure.push({"id":"CF", "type":"group", "note":"14", "bclass":"2", "description":"Réserves indisponibles"});
    reportStructure.push({"id":"CG", "type":"group", "note":"14", "bclass":"2", "description":"Réserves libres"});
    reportStructure.push({"id":"CH", "type":"group", "note":"14", "bclass":"2", "description":"Report à nouveau (+ ou -)"});
    reportStructure.push({"id":"CJT", "type":"group", "note":"", "bclass":"2", "description":"Résultat net de l'exercice (bénéfice + ou perte -)"});
    reportStructure.push({"id":"CJ", "type":"group", "note":"", "bclass":"1", "description":"Résultat net de l'exercice (bénéfice + ou perte -)", 
                            "sum":"CJT;TA;TB;TC;TD;TE;TF;TG;TH;TI;TJ;TL;TM;TN;TO;-RA;-RB;-RC;-RD;-RE;-RF;-RG;-RH;-RI;-RJ;-RK;-RL;-RM;-RN;-RO;-RP;-RQ;-RS"});
    reportStructure.push({"id":"CL", "type":"group", "note":"15", "bclass":"2", "description":"Subventions d'investissement"});
    reportStructure.push({"id":"CM", "type":"group", "note":"15", "bclass":"2", "description":"Provisions réglementées"});
    reportStructure.push({"id":"CP", "type":"total", "note":"", "description":"TOTAL CAPITAUX PROPRES ET RESSOURCES ASSIMILEES", "sum":"CA;CB;CD;CE;CF;CG;CH;CJ;CL;CM"});
    reportStructure.push({"id":"DA1", "type":"group", "note":"16", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DA2", "type":"group", "note":"16", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DA", "type":"group", "note":"16", "bclass":"1", "description":"Emprunts et dettes financières diverses", "sum":"DA1;DA2"});
    reportStructure.push({"id":"DB1", "type":"group", "note":"16", "bclass":"2", "description":"Dettes de location acquisition"});
    reportStructure.push({"id":"DB2", "type":"group", "note":"16", "bclass":"2", "description":"Dettes de location acquisition"});
    reportStructure.push({"id":"DB", "type":"group", "note":"16", "bclass":"1", "description":"Dettes de location acquisition", "sum":"DB1;DB2"});
    reportStructure.push({"id":"DC", "type":"group", "note":"16", "bclass":"2", "description":"Provisions pour risques et charges"});
    reportStructure.push({"id":"DD", "type":"total", "note":"", "description":"TOTAL DETTES FINANCIERES ET RESSOURCES ASSIMILEES", "sum":"DA;DB;DC"});
    reportStructure.push({"id":"DF", "type":"total", "note":"", "description":"TOTAL RESSOURCES STABLES", "sum":"CP;DD"});
    reportStructure.push({"id":"DH1", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DH2", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DH3", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DH", "type":"group", "note":"5", "bclass":"1", "description":"Dettes circulantes HAO", "sum":"DH1;DH2;DH3"});
    reportStructure.push({"id":"DI", "type":"group", "note":"7", "bclass":"2", "description":"Clients, avances reçues"});
    reportStructure.push({"id":"DJ1", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DJ2", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DJ3", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DJ", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs d'exploitation", "sum":"DJ1;DJ2;DJ3"});
    reportStructure.push({"id":"DK", "type":"group", "note":"18", "bclass":"2", "description":"Dettes fiscales et sociales"});
    reportStructure.push({"id":"DM1", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM2", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM3", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM4", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM5", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM", "type":"group", "note":"19", "bclass":"1", "description":"Autres dettes", "sum":"DM1;DM2;DM3;DM4;DM5"});
    reportStructure.push({"id":"DN", "type":"group", "note":"19", "bclass":"2", "description":"Provisions pour risques à court terme"});
    reportStructure.push({"id":"DP", "type":"total", "note":"", "description":"TOTAL PASSIF CIRCULANT", "sum":"DH;DI;DJ;DK;DM;DN"});
    reportStructure.push({"id":"DQ", "type":"group", "note":"20", "bclass":"2", "description":"Banques, crédits d'escompte"});
    reportStructure.push({"id":"DR", "type":"group", "note":"20", "bclass":"2", "description":"Banques, établissements financiers et crédits de trésorerie"});
    reportStructure.push({"id":"DT", "type":"total", "note":"", "description":"TOTAL TRESORERIE-PASSIF", "sum":"DQ;DR"});
    reportStructure.push({"id":"DV1", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV2", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV3", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV4", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV5", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Passif", "sum":"DV1;DV2;DV3;DV4;DV5"});
    reportStructure.push({"id":"DZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"DF;DP;DT;DV"});

    return reportStructure;
}


// Profit & Loss statement
function createReportStructureProfitLoss() {
    var reportStructure = [];

    reportStructure.push({"id":"TA", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"RA", "type":"group", "note":"22", "bclass":"3", "description":"Achats de marchandises"});
    reportStructure.push({"id":"RB", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de marchandises"});
    reportStructure.push({"id":"XA", "type":"total", "note":"", "description":"MARGE COMMERCIALE (Somme TA à RB)", "sum":"TA;-RA;-RB"});
    reportStructure.push({"id":"TB", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de produits fabriqués"});
    reportStructure.push({"id":"TC", "type":"group", "note":"21", "bclass":"4", "description":"Travaux, services vendus"});
    reportStructure.push({"id":"TD", "type":"group", "note":"21", "bclass":"4", "description":"Produits accessoires"});
    reportStructure.push({"id":"XB", "type":"total", "note":"", "description":"CHIFFRE D'AFFAIRES (A + B + C + D)", "sum":"TA;TB;TC;TD"});
    reportStructure.push({"id":"TE", "type":"group", "note":"6", "bclass":"4", "description":"Production stockée (ou déstockage)"});
    reportStructure.push({"id":"TF1", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TF2", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TF", "type":"group", "note":"21", "bclass":"3", "description":"Production immobilisée", "sum":"TF1;TF2"});
    reportStructure.push({"id":"TG", "type":"group", "note":"21", "bclass":"4", "description":"Subventions d’exploitation"});
    reportStructure.push({"id":"TH1", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TH2", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TH", "type":"group", "note":"21", "bclass":"3", "description":"Autres produits", "sum":"TH1;TH2"});
    reportStructure.push({"id":"TI", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges d'exploitation"});
    reportStructure.push({"id":"RC", "type":"group", "note":"22", "bclass":"3", "description":"Achats de matières premières et fournitures liées"});
    reportStructure.push({"id":"RD", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de matières premières et fournitures liées"});
    reportStructure.push({"id":"RE", "type":"group", "note":"22", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"RF", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks d’autres approvisionnements"});
    reportStructure.push({"id":"RG", "type":"group", "note":"23", "bclass":"3", "description":"Transports"});
    reportStructure.push({"id":"RH", "type":"group", "note":"24", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"RI", "type":"group", "note":"25", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"RJ1", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RJ2", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RJ", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges", "sum":"RJ1;RJ2"});
    reportStructure.push({"id":"XC", "type":"total", "note":"", "description":"VALEUR AJOUTEE (XB+RA+RB) + (somme TE à RJ)", "sum":"XB;-RA;-RB;TE;TF;TG;TH;TI;-RC;-RD;-RE;-RF;-RG;-RH;-RI;-RJ"});
    reportStructure.push({"id":"RK", "type":"group", "note":"27", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"XD", "type":"total", "note":"28", "description":"EXCEDENT BRUT D'EXPLOITATION (XC+RK)", "sum":"XC;-RK"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"28", "bclass":"4", "description":"Reprises d’amortissements, provisions et dépréciations"});
    reportStructure.push({"id":"RL", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux amortissements, aux provisions et dépréciations"});
    reportStructure.push({"id":"XE", "type":"total", "note":"", "description":"RESULTAT D'EXPLOITATION (XD+TJ+RL)", "sum":"XD;TJ;-RL"});
    reportStructure.push({"id":"TK", "type":"group", "note":"29", "bclass":"4", "description":"Revenus financiers et assimilés"});
    reportStructure.push({"id":"TL", "type":"group", "note":"28", "bclass":"4", "description":"Reprises de provisions  et dépréciations financières"});
    reportStructure.push({"id":"TM", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges financières"});
    reportStructure.push({"id":"RM", "type":"group", "note":"29", "bclass":"3", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"RN", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux provisions et aux dépréciations financières"});
    reportStructure.push({"id":"XF", "type":"total", "note":"", "description":"RESULTAT FINANCIER (somme TK à RN)", "sum":"TK;TL;TM;-RM;-RN"});
    reportStructure.push({"id":"XG", "type":"total", "note":"", "description":"RESULTAT DES ACTIVITES ORDINAIRES (XE+XF)", "sum":"XE;XF"});
    reportStructure.push({"id":"TN1", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TN2", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TN", "type":"group", "note":"3D", "bclass":"3", "description":"Produits des cessions d'immobilisations", "sum":"TN1;TN2"});
    reportStructure.push({"id":"TO", "type":"group", "note":"30", "bclass":"4", "description":"Autres Produits HAO"});
    reportStructure.push({"id":"RO", "type":"group", "note":"3D", "bclass":"3", "description":"Valeurs comptables des cessions d'immobilisations"});
    reportStructure.push({"id":"RP", "type":"group", "note":"30", "bclass":"3", "description":"Autres Charges HAO"});
    reportStructure.push({"id":"XH", "type":"total", "note":"", "description":"RESULTAT HORS ACTIVITES ORDINAIRES (somme TN à RP)", "sum":"TN;TO;-RO;-RP"});
    reportStructure.push({"id":"RQ", "type":"group", "note":"30", "bclass":"3", "description":"Participation des travailleurs"});
    reportStructure.push({"id":"RS", "type":"group", "note":"", "bclass":"3", "description":"Impôts sur le résultat"});
    reportStructure.push({"id":"XI", "type":"total", "note":"", "description":"RESULTAT NET (XG+XH+RQ+RS)", "sum":"XG;XH;-RQ;-RS"});
    
    return reportStructure;


    // CJ = CJ + Total Products - Total Charges
}

// Cash flow statement
function createReportStructureCashFlow() {
    var reportStructure = [];

    reportStructure.push({"id":"TA", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"RA", "type":"group", "note":"22", "bclass":"3", "description":"Achats de marchandises"});
    reportStructure.push({"id":"RB", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de marchandises"});
    reportStructure.push({"id":"XA", "type":"total", "note":"", "description":"MARGE COMMERCIALE (Somme TA à RB)", "sum":"TA;-RA;-RB"});
    reportStructure.push({"id":"TB", "type":"group", "note":"21", "bclass":"4", "description":"Ventes de produits fabriqués"});
    reportStructure.push({"id":"TC", "type":"group", "note":"21", "bclass":"4", "description":"Travaux, services vendus"});
    reportStructure.push({"id":"TD", "type":"group", "note":"21", "bclass":"4", "description":"Produits accessoires"});
    reportStructure.push({"id":"XB", "type":"total", "note":"", "description":"CHIFFRE D'AFFAIRES (A + B + C + D)", "sum":"TA;TB;TC;TD"});
    reportStructure.push({"id":"TE", "type":"group", "note":"6", "bclass":"4", "description":"Production stockée (ou déstockage)"});
    reportStructure.push({"id":"TF1", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TF2", "type":"group", "note":"21", "bclass":"4", "description":"Production immobilisée"});
    reportStructure.push({"id":"TF", "type":"group", "note":"21", "bclass":"3", "description":"Production immobilisée", "sum":"TF1;TF2"});
    reportStructure.push({"id":"TG", "type":"group", "note":"21", "bclass":"4", "description":"Subventions d’exploitation"});
    reportStructure.push({"id":"TH1", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TH2", "type":"group", "note":"21", "bclass":"4", "description":"Autres produits"});
    reportStructure.push({"id":"TH", "type":"group", "note":"21", "bclass":"3", "description":"Autres produits", "sum":"TH1;TH2"});
    reportStructure.push({"id":"TI", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges d'exploitation"});
    reportStructure.push({"id":"RC", "type":"group", "note":"22", "bclass":"3", "description":"Achats de matières premières et fournitures liées"});
    reportStructure.push({"id":"RD", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks de matières premières et fournitures liées"});
    reportStructure.push({"id":"RE", "type":"group", "note":"22", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"RF", "type":"group", "note":"6", "bclass":"3", "description":"Variation de stocks d’autres approvisionnements"});
    reportStructure.push({"id":"RG", "type":"group", "note":"23", "bclass":"3", "description":"Transports"});
    reportStructure.push({"id":"RH", "type":"group", "note":"24", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"RI", "type":"group", "note":"25", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"RJ1", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RJ2", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"RJ", "type":"group", "note":"26", "bclass":"3", "description":"Autres charges", "sum":"RJ1;RJ2"});
    reportStructure.push({"id":"XC", "type":"total", "note":"", "description":"VALEUR AJOUTEE (XB+RA+RB) + (somme TE à RJ)", "sum":"XB;-RA;-RB;TE;TF;TG;TH;TI;-RC;-RD;-RE;-RF;-RG;-RH;-RI;-RJ"});
    reportStructure.push({"id":"RK", "type":"group", "note":"27", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"XD", "type":"total", "note":"28", "description":"EXCEDENT BRUT D'EXPLOITATION (XC+RK)", "sum":"XC;-RK"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"28", "bclass":"4", "description":"Reprises d’amortissements, provisions et dépréciations"});
    reportStructure.push({"id":"RL", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux amortissements, aux provisions et dépréciations"});
    reportStructure.push({"id":"XE", "type":"total", "note":"", "description":"RESULTAT D'EXPLOITATION (XD+TJ+RL)", "sum":"XD;TJ;-RL"});
    reportStructure.push({"id":"TK", "type":"group", "note":"29", "bclass":"4", "description":"Revenus financiers et assimilés"});
    reportStructure.push({"id":"TL", "type":"group", "note":"28", "bclass":"4", "description":"Reprises de provisions  et dépréciations financières"});
    reportStructure.push({"id":"TM", "type":"group", "note":"12", "bclass":"4", "description":"Transferts de charges financières"});
    reportStructure.push({"id":"RM", "type":"group", "note":"29", "bclass":"3", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"RN", "type":"group", "note":"3C&28", "bclass":"3", "description":"Dotations aux provisions et aux dépréciations financières"});
    reportStructure.push({"id":"XF", "type":"total", "note":"", "description":"RESULTAT FINANCIER (somme TK à RN)", "sum":"TK;TL;TM;-RM;-RN"});
    reportStructure.push({"id":"XG", "type":"total", "note":"", "description":"RESULTAT DES ACTIVITES ORDINAIRES (XE+XF)", "sum":"XE;XF"});
    reportStructure.push({"id":"TN1", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TN2", "type":"group", "note":"3D", "bclass":"4", "description":"Produits des cessions d'immobilisations"});
    reportStructure.push({"id":"TN", "type":"group", "note":"3D", "bclass":"3", "description":"Produits des cessions d'immobilisations", "sum":"TN1;TN2"});
    reportStructure.push({"id":"TO", "type":"group", "note":"30", "bclass":"4", "description":"Autres Produits HAO"});
    reportStructure.push({"id":"RO", "type":"group", "note":"3D", "bclass":"3", "description":"Valeurs comptables des cessions d'immobilisations"});
    reportStructure.push({"id":"RP", "type":"group", "note":"30", "bclass":"3", "description":"Autres Charges HAO"});
    reportStructure.push({"id":"XH", "type":"total", "note":"", "description":"RESULTAT HORS ACTIVITES ORDINAIRES (somme TN à RP)", "sum":"TN;TO;-RO;-RP"});
    reportStructure.push({"id":"RQ", "type":"group", "note":"30", "bclass":"3", "description":"Participation des travailleurs"});
    reportStructure.push({"id":"RS", "type":"group", "note":"", "bclass":"3", "description":"Impôts sur le résultat"});
    reportStructure.push({"id":"XI", "type":"total", "note":"", "description":"RESULTAT NET (XG+XH+RQ+RS)", "sum":"XG;XH;-RQ;-RS"});

    reportStructure.push({"id":"AE", "type":"group", "note":"", "bclass":"1", "description":"Frais de développement et de prospection"});

    reportStructure.push({"id":"AF", "type":"group", "note":"3", "bclass":"1", "description":"Brevets, licences, logiciels, et  droits similaires"});

    reportStructure.push({"id":"AG", "type":"group", "note":"", "bclass":"1", "description":"Fonds commercial et droit au bail"});
    reportStructure.push({"id":"AH", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisation incorporelles"});

    reportStructure.push({"id":"AJ", "type":"group", "note":"", "bclass":"1", "description":"Terrains (1) dont Placement en  Net......./......."});    

    reportStructure.push({"id":"AK", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments (1) dont Placement en  Net......./......."});

    reportStructure.push({"id":"AL", "type":"group", "note":"", "bclass":"1", "description":"Aménagements, agencements et installations"});

    reportStructure.push({"id":"AM", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});

    reportStructure.push({"id":"AN", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});

    reportStructure.push({"id":"AR", "type":"group", "note":"", "bclass":"1", "description":"Titres de participation"});
    reportStructure.push({"id":"AS", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations financières"});

    reportStructure.push({"id":"BA", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO", "sum":"BA1;BA2;BA3"});
    reportStructure.push({"id":"BA1", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});
    reportStructure.push({"id":"BA2", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});
    reportStructure.push({"id":"BA3", "type":"group", "note":"5", "bclass":"1", "description":"ACTIF CIRCULANT HAO"});

    reportStructure.push({"id":"BB", "type":"group", "note":"6", "bclass":"1", "description":"STOCKS ET ENCOURS"});
    reportStructure.push({"id":"BBA", "type":"group", "note":"6", "bclass":"1", "description":"STOCKS ET ENCOURS"});

    reportStructure.push({"id":"BH", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs avances versées"});
    reportStructure.push({"id":"BHA", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs avances versées"});

    reportStructure.push({"id":"BI", "type":"group", "note":"7", "bclass":"1", "description":"Clients", "sum":"BI1;BI2;BI3"});
    reportStructure.push({"id":"BI1", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BI2", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BI3", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});
    reportStructure.push({"id":"BIA", "type":"group", "note":"7", "bclass":"1", "description":"Clients"});

    reportStructure.push({"id":"BJ", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances", "sum":"BJ1;BJ2;BJ3;BJ4;BJ5;BJ6;BJ7;BJ8;BJ9;BJ10;BJ11;BJ12;BJ13"});
    reportStructure.push({"id":"BJ1", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ2", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ3", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ4", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ5", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ6", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ7", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ8", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ9", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ10", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ11", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ12", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJ13", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BJA", "type":"group", "note":"8", "bclass":"1", "description":"Autres créances"});

    reportStructure.push({"id":"BQ", "type":"group", "note":"9", "bclass":"1", "description":"Titres de placement"});
    reportStructure.push({"id":"BR", "type":"group", "note":"10", "bclass":"1", "description":"Valeurs à encaisser"});
    reportStructure.push({"id":"BS", "type":"group", "note":"11", "bclass":"1", "description":"Banques, chèques postaux, caisse et assimilés"});

    reportStructure.push({"id":"BU", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif", "sum":"BU1;BU2;BU3;BU5"});
    reportStructure.push({"id":"BU1", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});
    reportStructure.push({"id":"BU2", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});
    reportStructure.push({"id":"BU3", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});
    reportStructure.push({"id":"BU5", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Actif"});

    reportStructure.push({"id":"CE1", "type":"group", "note":"3e", "bclass":"2", "description":"Ecarts de réévaluation"});
    reportStructure.push({"id":"CE2", "type":"group", "note":"3e", "bclass":"2", "description":"Ecarts de réévaluation"});
    reportStructure.push({"id":"CE", "type":"group", "note":"3e", "bclass":"1", "description":"Ecarts de réévaluation", "sum":"CE1;CE2"});

    reportStructure.push({"id":"DA1", "type":"group", "note":"16", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DA2", "type":"group", "note":"16", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DA", "type":"group", "note":"16", "bclass":"1", "description":"Emprunts et dettes financières diverses", "sum":"DA1;DA2"});
    
    reportStructure.push({"id":"DB1", "type":"group", "note":"16", "bclass":"2", "description":"Dettes de location acquisition"});
    reportStructure.push({"id":"DB2", "type":"group", "note":"16", "bclass":"2", "description":"Dettes de location acquisition"});
    reportStructure.push({"id":"DB", "type":"group", "note":"16", "bclass":"1", "description":"Dettes de location acquisition", "sum":"DB1;DB2"});

    reportStructure.push({"id":"DH1", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DH2", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DH3", "type":"group", "note":"5", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DH", "type":"group", "note":"5", "bclass":"1", "description":"Dettes circulantes HAO", "sum":"DH1;DH2;DH3"});

    reportStructure.push({"id":"DI", "type":"group", "note":"7", "bclass":"2", "description":"Clients, avances reçues"});
    reportStructure.push({"id":"DJ1", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DJ2", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DJ3", "type":"group", "note":"17", "bclass":"2", "description":"Fournisseurs d'exploitation"});
    reportStructure.push({"id":"DJ", "type":"group", "note":"17", "bclass":"1", "description":"Fournisseurs d'exploitation", "sum":"DJ1;DJ2;DJ3"});
    reportStructure.push({"id":"DK", "type":"group", "note":"18", "bclass":"2", "description":"Dettes fiscales et sociales"});
    reportStructure.push({"id":"DM1", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM2", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM3", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM4", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM5", "type":"group", "note":"19", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DM", "type":"group", "note":"19", "bclass":"1", "description":"Autres dettes", "sum":"DM1;DM2;DM3;DM4;DM5"});
    reportStructure.push({"id":"DN", "type":"group", "note":"19", "bclass":"2", "description":"Provisions pour risques à court terme"});

    reportStructure.push({"id":"DQ", "type":"group", "note":"20", "bclass":"2", "description":"Banques, crédits d'escompte"});
    reportStructure.push({"id":"DR", "type":"group", "note":"20", "bclass":"2", "description":"Banques, établissements financiers et crédits de trésorerie"});

    reportStructure.push({"id":"DV1", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV2", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV3", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV4", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV5", "type":"group", "note":"12", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DV", "type":"group", "note":"12", "bclass":"1", "description":"Ecart de conversion-Passif", "sum":"DV1;DV2;DV3;DV4;DV5"});

    reportStructure.push({"id":"ZA", "type":"total", "note":"A", "description":"ZA= Trésorerie nette au 1er janvier (Trésorerie actif N-1 - trésorerie passif N-1)", "sum":"BQ;BR;BS;-DQ;-DR"});
    reportStructure.push({"id":"FA", "type":"group", "note":"", "bclass":"1", "description":"Capacité d'Autofinancement Globale (CAFG)", "sum":"-XD;RJ1;TH1;-TK;-TL;-TM;-RM;-RN;-TO;-RP;-RQ;-RS"});
    reportStructure.push({"id":"FB", "type":"group", "note":"", "bclass":"1", "description":"(-) Variation actif circulant HAO"});
    reportStructure.push({"id":"FC", "type":"group", "note":"", "bclass":"1", "description":"(-) Variation des stocks"});
    reportStructure.push({"id":"FD", "type":"group", "note":"", "bclass":"1", "description":"(-) Variation des créances"});
    reportStructure.push({"id":"FE", "type":"group", "note":"", "bclass":"1", "description":"(+) Variation du passif circulant"});
    reportStructure.push({"id":"ZB", "type":"total", "note":"B", "description":"Flux de trésorerie provenant des activités opérationnelles (somme FA à FE)", "sum":"FB;FC;FD;FE"});
    reportStructure.push({"id":"FF", "type":"group", "note":"", "bclass":"1", "description":"(-) Décaissements liés aux acquisitions d'immobilisations incorporelles"});
    reportStructure.push({"id":"FG", "type":"group", "note":"", "bclass":"1", "description":"(-) Décaissements liés aux acquisitions d'immobilisations corporelles"});
    reportStructure.push({"id":"FH", "type":"group", "note":"", "bclass":"1", "description":"(-) Décaissements liés aux acquisitions d'immobilisations financières"});
    reportStructure.push({"id":"FI", "type":"group", "note":"", "bclass":"1", "description":"(+) Encaissements liés aux cessions d'immobilisations incorporelles et corporelles"});
    reportStructure.push({"id":"FJ", "type":"group", "note":"", "bclass":"1", "description":"(+) Encaissements liés aux cessions d'immobilisations financières"});
    reportStructure.push({"id":"ZC", "type":"total", "note":"C", "description":" Flux de trésorerie provenant des activités d'investissement (somme FF à FJ)", "sum":"BQ;BR;BS;-DQ;-DR"});
    reportStructure.push({"id":"FK", "type":"group", "note":"", "bclass":"1", "description":"(+) Augmentations de capital par apports nouveaux"});
    reportStructure.push({"id":"FL", "type":"group", "note":"", "bclass":"1", "description":"(+) Subventions d'investissement reçues"});
    reportStructure.push({"id":"FM", "type":"group", "note":"", "bclass":"1", "description":"(-) Prélèvements sur le capital "});
    reportStructure.push({"id":"FN", "type":"group", "note":"", "bclass":"1", "description":"(-) Dividendes verses"});
    reportStructure.push({"id":"ZD", "type":"total", "note":"D", "description":" Flux de trésorerie provenant des capitaux propres (somme FK à FN)", "sum":"BQ;BR;BS;-DQ;-DR"});
    reportStructure.push({"id":"FO", "type":"group", "note":"", "bclass":"1", "description":"(+) Emprunts"});
    reportStructure.push({"id":"FP", "type":"group", "note":"", "bclass":"1", "description":"(+) Autres dettes financières"});
    reportStructure.push({"id":"FQ", "type":"group", "note":"", "bclass":"1", "description":"(-) Remboursements des emprunts et autres dettes financières"});
    reportStructure.push({"id":"ZE", "type":"total", "note":"E", "description":"Flux de trésorerie provenant des capitaux étrangers (somme FO à FQ)", "sum":"BQ;BR;BS;-DQ;-DR"});
    reportStructure.push({"id":"ZF", "type":"total", "note":"F", "description":"Flux de trésorerie provenant des activités de financement (D+E)", "sum":"BQ;BR;BS;-DQ;-DR"});
    reportStructure.push({"id":"ZG", "type":"total", "note":"G", "description":"VARIATION DE LA TRESORERIE NETTE DE LA PERIODE (B+C+F)", "sum":"BQ;BR;BS;-DQ;-DR"});    
    reportStructure.push({"id":"ZH", "type":"total", "note":"H", "description":"Trésorerie nette au 31 Décembre (G+A) Contrôle : Trésorerie actif 2020 - trésorerie passif 2020 =", "sum":"BQ;BR;BS;-DQ;-DR"});

    return reportStructure;
}