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


/* Update: 2024-01-01 */


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
    reportStructure.push({"id":"AA", "type":"group", "note":"2", "bclass":"1", "description":"Immobilisations incorporelles"});
    reportStructure.push({"id":"AB", "type":"group", "note":"2", "bclass":"1", "description":"Terrains et bâtiments"});
    reportStructure.push({"id":"AC", "type":"group", "note":"2", "bclass":"1", "description":"Aménagements agencements et installations"});
    reportStructure.push({"id":"AD", "type":"group", "note":"2", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AE", "type":"group", "note":"2", "bclass":"1", "description":"Matériel de tansport"});
    reportStructure.push({"id":"AF", "type":"group", "note":"2", "bclass":"1", "description":"Avances et acomptes versées su immobilisations"});
    reportStructure.push({"id":"AG", "type":"group", "note":"2", "bclass":"1", "description":"Dépôts et cautionnements"});
    reportStructure.push({"id":"AH", "type":"group", "note":"2", "bclass":"1", "description":"Autres immobilisations corporelles et incoporelles"});
    reportStructure.push({"id":"AZ", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AA;AB;AC;AD;AE;AF;AG;AH"});
    reportStructure.push({"id":"BA", "type":"group", "note":"3", "bclass":"1", "description":"Actif circulant HAO"});
    reportStructure.push({"id":"BB", "type":"group", "note":"4", "bclass":"1", "description":"Stocks et encours"});
    reportStructure.push({"id":"BC", "type":"group", "note":"5", "bclass":"1", "description":"Fournisseurs débiteurs"});
    reportStructure.push({"id":"BD", "type":"group", "note":"5", "bclass":"1", "description":"Clients-usagers"});
    reportStructure.push({"id":"BE", "type":"group", "note":"5", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BT", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BA;BB;BC;BD;BE"});
    reportStructure.push({"id":"BV", "type":"group", "note":"6", "bclass":"1", "description":"Valeurs à encaisser"});
    reportStructure.push({"id":"BW", "type":"group", "note":"6", "bclass":"1", "description":"Banques, établissements financiers, caisse et assimiles"});
    reportStructure.push({"id":"BX", "type":"total", "note":"", "description":"TOTAL TRESORERIE ACTIF", "sum":"BV;BW"});
    reportStructure.push({"id":"BY", "type":"group", "note":"7", "bclass":"1", "description":"Ecart de conversion-Actif "});
    reportStructure.push({"id":"BZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZ;BT;BX;BY"});
    
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
    reportStructure.push({"id":"CA", "type":"group", "note":"8", "bclass":"2", "description":"Fonds affectés aux investissements"});
    reportStructure.push({"id":"CB", "type":"group", "note":"", "bclass":"2", "description":"Report à nouveau (+ou-)"});
    reportStructure.push({"id":"CCT", "type":"group", "note":"", "bclass":"2", "description":"Solde des opérations de l'exercice"});
    reportStructure.push({"id":"CC", "type":"group", "note":"", "description":"Solde des opérations de l'exercice", "sum":"CCT;TA;TB;TC;TD;TG;TH;TI;TJ;TK;TL;TM;TN;-RA;-RB;-RC;-RD;-RE"});
    reportStructure.push({"id":"CD", "type":"group", "note":"9", "bclass":"2", "description":"Subventions d'investissement"});
    reportStructure.push({"id":"CZ", "type":"total", "note":"", "description":"TOTAL RESSOURCES PROPRES ET ASSIMILEES", "sum":"CA;CB;CC;CD"});
    reportStructure.push({"id":"DA", "type":"group", "note":"10", "bclass":"2", "description":"Emprunts et dettes assimilées"});
    reportStructure.push({"id":"DB", "type":"group", "note":"10", "bclass":"2", "description":"Provisions pour risques et charges"});
    reportStructure.push({"id":"DC", "type":"total", "note":"", "description":"TOTAL DES DETTES FINANCIERES ET RESSOURCES ASSIMILEES", "sum":"DA;DB"});
    reportStructure.push({"id":"DD", "type":"total", "note":"", "description":"TOTAL DES RESSOURCES STABLES", "sum":"CZ;DC"});
    reportStructure.push({"id":"DE", "type":"group", "note":"3", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DF", "type":"group", "note":"8", "bclass":"2", "description":"Fonds d'administation"});
    reportStructure.push({"id":"DG", "type":"group", "note":"11", "bclass":"2", "description":"Fournisseurs"});
    reportStructure.push({"id":"DH", "type":"group", "note":"11", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DI", "type":"group", "note":"20", "bclass":"2", "description":"Provisions pour risques et charges à court terme"});
    reportStructure.push({"id":"DJ", "type":"total", "note":"", "description":"TOTAL PASSIF CIRCULANT", "sum":"DE;DF;DG;DH;DI"});
    reportStructure.push({"id":"DW", "type":"group", "note":"12", "bclass":"2", "description":"Banques, établissements financiers et crédits de trésorerie"});
    reportStructure.push({"id":"DX", "type":"total", "note":"", "description":"TOTAL TRESORERIE PASSIF", "sum":"DW"});
    reportStructure.push({"id":"DY", "type":"group", "note":"7", "bclass":"2", "description":"Ecart de conversion-Passif"});
    reportStructure.push({"id":"DZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"DD;DJ;DX;DY"});


    
    return reportStructure;
}


// Profit & Loss statement
function createReportStructureProfitLoss() {
    var reportStructure = [];

    reportStructure.push({"id":"RA", "type":"group", "note":"23", "bclass":"4", "description":"Fonds d'Administration consommés"});
    reportStructure.push({"id":"RB", "type":"group", "note":"23", "bclass":"4", "description":"Ventes March., Produits finis et Prestations de Services"});
    reportStructure.push({"id":"RC", "type":"group", "note":"23", "bclass":"4", "description":"Subventions d'exploitations"});
    reportStructure.push({"id":"RD", "type":"group", "note":"23", "bclass":"4", "description":"Autres Produits et Transferts  de charges"});
    reportStructure.push({"id":"RE", "type":"group", "note":"23", "bclass":"4", "description":"Reprises de Provisions"});
    reportStructure.push({"id":"XA", "type":"total", "note":"", "description":"REVENUS (Somme RA a RE)", "sum":"RA;RB;RC;RD;RE"});
    reportStructure.push({"id":"TA", "type":"group", "note":"14", "bclass":"4", "description":"Autres achats"});
    reportStructure.push({"id":"TB", "type":"group", "note":"14", "bclass":"4", "description":"Achats de biens, marchandises et matières premières et Fournitures liées"});
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
    reportStructure.push({"id":"XB", "type":"total", "note":"", "description":"Charges de fonctionnement  (Somme TA a TN)", "sum":"TA;TB;TC;TD;TG;TH;TI;TJ;TK;TL;TM;TN"});
    reportStructure.push({"id":"XC", "type":"total", "note":"", "description":"Solde des opérations de l'exercice (+excédent, -deficit) (XA + XB)", "sum":"-XA;-XB"});
    
    
    return reportStructure;


    // CC = CCT + Total Products - Total Charges
}

