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


/* Update: 2023-12-16 */


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
    reportStructure.push({"id":"AA", "type":"total", "note":"5", "description":"IMMOBILISATIONS NON RECUES, DESTINEES A LA VENTE, PROVENANT DE DONS ET LEGS ET URSUFRUIT TEMPORAIRE", "sum":"AB;AC"});
    reportStructure.push({"id":"AA-A", "type":"total", "note":"5", "description":"IMMOBILISATIONS NON RECUES, DESTINEES A LA VENTE, PROVENANT DE DONS ET LEGS ET URSUFRUIT TEMPORAIRE", "sum":"AB-A;AC-A"});
    reportStructure.push({"id":"AA-(AA-A)", "type":"total", "note":"5", "description":"IMMOBILISATIONS NON RECUES, DESTINEES A LA VENTE, PROVENANT DE DONS ET LEGS ET URSUFRUIT TEMPORAIRE", "sum":"AA;AA-A"});

    reportStructure.push({"id":"AB", "type":"group", "note":"", "bclass":"1", "description":"Immobilisations incorporelles"});
    reportStructure.push({"id":"AB-A", "type":"group", "note":"", "bclass":"1", "description":"Immobilisations incorporelles"});
    reportStructure.push({"id":"AB-(AB-A)", "type":"group", "note":"", "description":"Immobilisations incorporelles", "sum":"AB;AB-A"});

    reportStructure.push({"id":"AC", "type":"group", "note":"", "bclass":"1", "description":"Immobilisations corporelles et financières"});
    reportStructure.push({"id":"AC-A", "type":"group", "note":"", "bclass":"1", "description":"Immobilisations corporelles et financières"});
    reportStructure.push({"id":"AC-(AC-A)", "type":"group", "note":"", "description":"Immobilisations corporelles et financières", "sum":"AC;AC-A"});

    reportStructure.push({"id":"AD", "type":"total", "note":"5", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AE;AF;AG"});
    reportStructure.push({"id":"AD-A", "type":"total", "note":"5", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AE-A;AF-A;AG-A"});
    reportStructure.push({"id":"AD-(AD-A)", "type":"total", "note":"", "description":"IMMOBILISATIONS INCORPORELLES", "sum":"AD;AD-A"});

    reportStructure.push({"id":"AE", "type":"group", "note":"", "bclass":"1", "description":"Brevet, licences, logiciels et droits similaires"});
    reportStructure.push({"id":"AE-A", "type":"group", "note":"", "bclass":"1", "description":"Brevet, licences, logiciels et droits similaires"});
    reportStructure.push({"id":"AE-(AE-A)", "type":"group", "note":"", "description":"Brevet, licences, logiciels et droits similaires", "sum":"AE;AE-A"});

    reportStructure.push({"id":"AF", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations incorporelles"});
    reportStructure.push({"id":"AF-A", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations incorporelles"});
    reportStructure.push({"id":"AF-(AF-A)", "type":"group", "note":"", "description":"Autres immobilisations incorporelles", "sum":"AF;AF-A"});

    reportStructure.push({"id":"AG", "type":"group", "note":"", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations incorporelles"});
    reportStructure.push({"id":"AG-A", "type":"group", "note":"", "bclass":"1", "description":"Avances et acomptes versés sur immobilisations incorporelles"});
    reportStructure.push({"id":"AG-(AG-A)", "type":"group", "note":"", "description":"Avances et acomptes versés sur immobilisations incorporelles", "sum":"AG;AG-A"});

    reportStructure.push({"id":"AH", "type":"total", "note":"5", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AI;AJ;AK;AL;AM;AN"});
    reportStructure.push({"id":"AH-A", "type":"total", "note":"5", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AI-A;AJ-A;AK-A;AL-A;AM-A;AN-A"});
    reportStructure.push({"id":"AH-(AH-A)", "type":"total", "note":"", "description":"IMMOBILISATIONS CORPORELLES", "sum":"AH;AH-A"});

    reportStructure.push({"id":"AI", "type":"group", "note":"", "bclass":"1", "description":"Terrains"});
    reportStructure.push({"id":"AI-A", "type":"group", "note":"", "bclass":"1", "description":"Terrains"});
    reportStructure.push({"id":"AI-(AI-A)", "type":"group", "note":"", "description":"Terrains", "sum":"AI;AI-A"});

    reportStructure.push({"id":"AJ", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments"});
    reportStructure.push({"id":"AJ-A", "type":"group", "note":"", "bclass":"1", "description":"Bâtiments"});
    reportStructure.push({"id":"AJ-(AJ-A)", "type":"group", "note":"", "description":"Bâtiments", "sum":"AJ;AJ-A"});

    reportStructure.push({"id":"AK", "type":"group", "note":"", "bclass":"1", "description":"Aménagements, agencements et installations"});
    reportStructure.push({"id":"AK-A", "type":"group", "note":"", "bclass":"1", "description":"Aménagements, agencements et installations"});
    reportStructure.push({"id":"AK-(AK-A)", "type":"group", "note":"", "description":"Aménagements, agencements et installations", "sum":"AK;AK-A"});

    reportStructure.push({"id":"AL", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AL-A", "type":"group", "note":"", "bclass":"1", "description":"Matériel, mobilier et actifs biologiques"});
    reportStructure.push({"id":"AL-(AL-A)", "type":"group", "note":"", "description":"Matériel, mobilier et actifs biologiques", "sum":"AL;AL-A"});

    reportStructure.push({"id":"AM", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"AM-A", "type":"group", "note":"", "bclass":"1", "description":"Matériel de transport"});
    reportStructure.push({"id":"AM-(AM-A)", "type":"group", "note":"", "description":"Matériel de transport", "sum":"AM;AM-A"});

    reportStructure.push({"id":"AN", "type":"group", "note":"", "bclass":"1", "description":"Avances et acomptes verses sur immobilisations corporelles"});
    reportStructure.push({"id":"AN-A", "type":"group", "note":"", "bclass":"1", "description":"Avances et acomptes verses sur immobilisations corporelles"});
    reportStructure.push({"id":"AN-(AN-A)", "type":"group", "note":"", "description":"Avances et acomptes verses sur immobilisations corporelles", "sum":"AN;AN-A"});

    reportStructure.push({"id":"AO", "type":"total", "note":"6", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AX;AY"});
    reportStructure.push({"id":"AO-A", "type":"total", "note":"6", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AX-A;AY-A"});
    reportStructure.push({"id":"AO-(AO-A)", "type":"total", "note":"6", "description":"IMMOBILISATIONS FINANCIERES", "sum":"AO;AO-A"});

    reportStructure.push({"id":"AX", "type":"group", "note":"", "bclass":"1", "description":"Titres de participation"});
    reportStructure.push({"id":"AX-A", "type":"group", "note":"", "bclass":"1", "description":"Titres de participation"});
    reportStructure.push({"id":"AX-(AX-A)", "type":"group", "note":"", "description":"Titres de participation", "sum":"AX;AX-A"});

    reportStructure.push({"id":"AY", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations financières"});
    reportStructure.push({"id":"AY-A", "type":"group", "note":"", "bclass":"1", "description":"Autres immobilisations financières"});
    reportStructure.push({"id":"AY-(AY-A)", "type":"group", "note":"", "description":"Autres immobilisations financières", "sum":"AY;AY-A"});

    reportStructure.push({"id":"AZ", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AA;AD;AH;AO"});
    reportStructure.push({"id":"AZ-A", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AA-A;AD-A;AH-A;AO-A"});
    reportStructure.push({"id":"AZ-(AZ-A)", "type":"total", "note":"", "description":"TOTAL ACTIF IMMOBILISE", "sum":"AZ;AZ-A"});

    reportStructure.push({"id":"BA", "type":"group", "note":"7", "bclass":"1", "description":"Actif circulant HAO"});
    reportStructure.push({"id":"BA-A", "type":"group", "note":"7", "bclass":"1", "description":"Actif circulant HAO"});
    reportStructure.push({"id":"BA-(BA-A)", "type":"group", "note":"7", "description":"Actif circulant HAO", "sum":"BA;BA-A"});

    reportStructure.push({"id":"BB", "type":"group", "note":"8", "bclass":"1", "description":"Stocks et encours"});
    reportStructure.push({"id":"BB-A", "type":"group", "note":"8", "bclass":"1", "description":"Stocks et encours"});
    reportStructure.push({"id":"BB-(BB-A)", "type":"group", "note":"8", "description":"Stocks et encours", "sum":"BB;BB-A"});

    reportStructure.push({"id":"BC", "type":"group", "note":"19", "bclass":"1", "description":"Fournisseurs débiteurs"});
    reportStructure.push({"id":"BC-A", "type":"group", "note":"19", "bclass":"1", "description":"Fournisseurs débiteurs"});
    reportStructure.push({"id":"BC-(BC-A)", "type":"group", "note":"19", "description":"Fournisseurs débiteurs", "sum":"BC;BC-A"});

    reportStructure.push({"id":"BD", "type":"group", "note":"9", "bclass":"1", "description":"Adhérents, clients-usagers"});
    reportStructure.push({"id":"BD-A", "type":"group", "note":"9", "bclass":"1", "description":"Adhérents, clients-usagers"});
    reportStructure.push({"id":"BD-(BD-A)", "type":"group", "note":"9", "description":"Adhérents, clients-usagers", "sum":"BD;BD-A"});

    reportStructure.push({"id":"BE", "type":"group", "note":"10", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BE-A", "type":"group", "note":"10", "bclass":"1", "description":"Autres créances"});
    reportStructure.push({"id":"BE-(BE-A)", "type":"group", "note":"10", "description":"Autres créances", "sum":"BE;BE-A"});

    reportStructure.push({"id":"BT", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BA;BB;BC;BD;BE"});
    reportStructure.push({"id":"BT-A", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BA-A;BB-A;BC-A;BD-A;BE-A"});
    reportStructure.push({"id":"BT-(BT-A)", "type":"total", "note":"", "description":"TOTAL ACTIF CIRCULANT", "sum":"BT;BT-A"});

    reportStructure.push({"id":"BU", "type":"group", "note":"11", "bclass":"1", "description":"Titres de placement"});
    reportStructure.push({"id":"BU-A", "type":"group", "note":"11", "bclass":"1", "description":"Titres de placement"});
    reportStructure.push({"id":"BU-(BU-A)", "type":"group", "note":"11", "description":"Titres de placement", "sum":"BU;BU-A"});

    reportStructure.push({"id":"BV", "type":"group", "note":"12", "bclass":"1", "description":"Valeurs à encaisser"});
    reportStructure.push({"id":"BV-A", "type":"group", "note":"12", "bclass":"1", "description":"Valeurs à encaisser"});
    reportStructure.push({"id":"BV-(BV-A)", "type":"group", "note":"12", "description":"Valeurs à encaisser", "sum":"BV;BV-A"});

    reportStructure.push({"id":"BW", "type":"group", "note":"13", "bclass":"1", "description":"Banques, établissements financiers, caisse et assimiles"});
    reportStructure.push({"id":"BW-A", "type":"group", "note":"13", "bclass":"1", "description":"Banques, établissements financiers, caisse et assimiles"});
    reportStructure.push({"id":"BW-(BW-A)", "type":"group", "note":"13", "description":"Banques, établissements financiers, caisse et assimiles", "sum":"BW;BW-A"});
    
    reportStructure.push({"id":"BX", "type":"total", "note":"", "description":"TOTAL TRESORERIE ACTIF", "sum":"BU;BV;BW"});
    reportStructure.push({"id":"BX-A", "type":"total", "note":"", "description":"TOTAL TRESORERIE ACTIF", "sum":"BU-A;BV-A;BW-A"});
    reportStructure.push({"id":"BX-(BX-A)", "type":"total", "note":"", "description":"TOTAL TRESORERIE ACTIF", "sum":"BX;BX-A"});

    reportStructure.push({"id":"BY", "type":"group", "note":"14", "bclass":"1", "description":"Ecart de conversion-Actif "});
    reportStructure.push({"id":"BY-A", "type":"group", "note":"14", "bclass":"1", "description":"Ecart de conversion-Actif "});
    reportStructure.push({"id":"BY-(BY-A)", "type":"group", "note":"14", "description":"Ecart de conversion-Actif ", "sum":"BY;BY-A"});

    reportStructure.push({"id":"BZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZ;BT;BX;BY"});
    reportStructure.push({"id":"BZ-A", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"AZ-A;BT-A;BX-A;BY-A"});
    reportStructure.push({"id":"BZ-(BZ-A)", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"BZ;BZ-A"});

    // To get CH, we sum up products and subtract by charges
    reportStructure.push({"id":"TA", "type":"group", "note":"24", "bclass":"4", "description":"Achats de biens et services liés à l'activité"});
    reportStructure.push({"id":"TB", "type":"group", "note":"24", "bclass":"4", "description":"Variation de stocks des achats de biens et services liés à l'activite"});
    reportStructure.push({"id":"TC", "type":"group", "note":"24", "bclass":"4", "description":"Achats de marchandises et matières premières"});
    reportStructure.push({"id":"TD", "type":"group", "note":"24", "bclass":"4", "description":"Autres achats"});
    reportStructure.push({"id":"TE", "type":"group", "note":"8", "bclass":"4", "description":"Variation de stocks de marchandises, de matières premières et autres"});
    reportStructure.push({"id":"TF", "type":"group", "note":"25", "bclass":"4", "description":"Transport"});
    reportStructure.push({"id":"TG", "type":"group", "note":"26", "bclass":"4", "description":"Services extérieurs"});
    reportStructure.push({"id":"TH", "type":"group", "note":"27", "bclass":"4", "description":"Impôts et taxes"});
    reportStructure.push({"id":"TI", "type":"group", "note":"28", "bclass":"4", "description":"Autres charges"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"29", "bclass":"4", "description":"Charges de personnel"});
    reportStructure.push({"id":"TK", "type":"group", "note":"31", "bclass":"4", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"TL", "type":"group", "note":"5D&30", "bclass":"4", "description":"Dotations aux amortissements, aux provissions, aux dépréciations et autres"});
    reportStructure.push({"id":"TM", "type":"group", "note":"32", "bclass":"4", "description":"Produits H.A.O"});
    reportStructure.push({"id":"TN", "type":"group", "note":"32", "bclass":"4", "description":"Charges H.A.O"});
    reportStructure.push({"id":"RA", "type":"group", "note":"23", "bclass":"3", "description":"Cotisation"});
    reportStructure.push({"id":"RB", "type":"group", "note":"23", "bclass":"3", "description":"Dotation consomptibles transférées au compte de résultat"});
    reportStructure.push({"id":"RC", "type":"group", "note":"23", "bclass":"3", "description":"Revenus liés à la générosité"});
    reportStructure.push({"id":"RD", "type":"group", "note":"23", "bclass":"3", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"RE", "type":"group", "note":"23", "bclass":"3", "description":"Ventes de service et produits finis"});
    reportStructure.push({"id":"RF", "type":"group", "note":"23", "bclass":"3", "description":"Subventions d'exploitation"});
    reportStructure.push({"id":"RG", "type":"group", "note":"23", "bclass":"3", "description":"Autres produits et transferts de charges"});
    reportStructure.push({"id":"RH", "type":"group", "note":"23", "bclass":"3", "description":"Reprises de provisions, dépréciations, subventions et autres reprises"});

    /* PASSIVE */
    reportStructure.push({"id":"CA", "type":"group", "note":"15", "bclass":"2", "description":"Dotation non consomptible sans droit reprise"});
    reportStructure.push({"id":"CB", "type":"group", "note":"15", "bclass":"2", "description":"Dotation non consomptible avec droit reprise"});
    reportStructure.push({"id":"CC", "type":"group", "note":"15", "bclass":"2", "description":"Droit d'entrée"});
    reportStructure.push({"id":"CD", "type":"group", "note":"15", "bclass":"2", "description":"Dotation consomptible"});
    reportStructure.push({"id":"CE", "type":"group", "note":"5F", "bclass":"2", "description":"Ecarts de réévaluation"});
    reportStructure.push({"id":"CF", "type":"group", "note":"16", "bclass":"2", "description":"Réserves"});
    reportStructure.push({"id":"CG", "type":"group", "note":"16", "bclass":"2", "description":"Report à nouveau (+ ou-)"});
    reportStructure.push({"id":"CHT", "type":"group", "note":"", "bclass":"2", "description":"Résultat net de l'exercice (excédent + ou déficit -)"});
    reportStructure.push({"id":"CH", "type":"group", "note":"", "description":"Résultat net de l'exercice (excédent + ou déficit -)", 
                            "sum":"-RA;-RB;-RC;-RD;-RE;-RF;-RG;-RH;TA;TB;TC;TD;TE;TF;TG;TH;TI;TJ;TK;TL;TM;TN;CHT"});
    reportStructure.push({"id":"CI", "type":"group", "note":"17A", "bclass":"2", "description":"Subventions d'investissement"});
    reportStructure.push({"id":"CJ", "type":"group", "note":"17A", "bclass":"2", "description":"Provisions réglementées"});
    reportStructure.push({"id":"CK", "type":"total", "note":"", "description":"TOTAL FONDS PROPRES ET ASSIMILES", "sum":"CA;CB;CC;CD;CE;CF;CG;CH;CI;CJ"});
    reportStructure.push({"id":"CW", "type":"group", "note":"17B", "bclass":"2", "description":"Fonds affectés et provenant de dons et legs d'immobilisations"});
    reportStructure.push({"id":"CX", "type":"group", "note":"17B", "bclass":"2", "description":"Fonds reportés"});
    reportStructure.push({"id":"CY", "type":"total", "note":"", "description":"TOTAL FONDS AFFECTES ET REPORTES", "sum":"CW;CX"});
    reportStructure.push({"id":"CZT", "type":"total", "note":"", "description":"TOTAL RESSOURCES PROPRES ET ASSIMILEES",});
    reportStructure.push({"id":"CZ", "type":"total", "note":"", "description":"TOTAL RESSOURCES PROPRES ET ASSIMILEES", "sum":"CK;CY"});
    reportStructure.push({"id":"DA", "type":"group", "note":"18A", "bclass":"2", "description":"Emprunts et dettes financières diverses"});
    reportStructure.push({"id":"DB", "type":"group", "note":"18A", "bclass":"2", "description":"Dettes de location acquisition"});
    reportStructure.push({"id":"DC", "type":"group", "note":"18A", "bclass":"2", "description":"Provisions pour risques et charges"});
    reportStructure.push({"id":"DD", "type":"total", "note":"", "description":"TOTAL DETTES FINANCIERES ET RESSOURCES ASSIMILEES", "sum":"DA;DB;DC"});
    reportStructure.push({"id":"DE", "type":"total", "note":"", "description":"TOTAL RESSOURCES STABLES", "sum":"CZ;DD"});
    reportStructure.push({"id":"DF", "type":"group", "note":"7", "bclass":"2", "description":"Dettes circulantes HAO"});
    reportStructure.push({"id":"DG", "type":"group", "note":"9", "bclass":"2", "description":"Adhérents, clients-usagers créditeurs"});
    reportStructure.push({"id":"DH", "type":"group", "note":"19", "bclass":"2", "description":"Fournisseurs"});
    reportStructure.push({"id":"DI", "type":"group", "note":"20&21", "bclass":"2", "description":"Autres dettes"});
    reportStructure.push({"id":"DV", "type":"total", "note":"", "description":"TOTAL PASSIF CIRCULANT", "sum":"DF;DG;DH;DI"});
    reportStructure.push({"id":"DW", "type":"group", "note":"22", "bclass":"2", "description":"Banques, établissements financiers et crédits de trésorerie"});
    reportStructure.push({"id":"DX", "type":"total", "note":"", "description":"TOTAL TRESORERIE-PASSIF", "sum":"DW"});
    reportStructure.push({"id":"DY", "type":"group", "note":"14", "bclass":"2", "description":"Ecart de conversion-Passif"})
    reportStructure.push({"id":"DZ", "type":"total", "note":"", "description":"TOTAL GENERAL", "sum":"DE;DV;DX;DY"});

    return reportStructure;
}


// Profit & Loss statement
function createReportStructureProfitLoss() {
    var reportStructure = [];

    reportStructure.push({"id":"RA", "type":"group", "note":"23", "bclass":"4", "description":"Cotisation"});
    reportStructure.push({"id":"RB", "type":"group", "note":"23", "bclass":"4", "description":"Dotation consomptibles transférées au compte de résultat"});
    reportStructure.push({"id":"RC", "type":"group", "note":"23", "bclass":"4", "description":"Revenus liés à la générosité"});
    reportStructure.push({"id":"RD", "type":"group", "note":"23", "bclass":"4", "description":"Ventes de marchandises"});
    reportStructure.push({"id":"RE", "type":"group", "note":"23", "bclass":"4", "description":"Ventes de service et produits finis"});
    reportStructure.push({"id":"RF", "type":"group", "note":"23", "bclass":"4", "description":"Subventions d'exploitation"});
    reportStructure.push({"id":"RG", "type":"group", "note":"23", "bclass":"4", "description":"Autres produits et transferts de charges"});
    reportStructure.push({"id":"RH", "type":"group", "note":"23", "bclass":"4", "description":"Reprises de provisions, dépréciations, subventions et autres reprises"});
    reportStructure.push({"id":"XA", "type":"total", "note":"", "description":"REVENUS DES ACTIVITES ORDINAIRES (Somme RA à RH)", "sum":"RA;RB;RC;RD;RE;RF;RG;RH"});
    reportStructure.push({"id":"TA", "type":"group", "note":"24", "bclass":"3", "description":"Achats de biens et services liés à l'activité"});
    reportStructure.push({"id":"TB", "type":"group", "note":"24", "bclass":"3", "description":"Variation de stocks des achats de biens et services liés à l'activite"});
    reportStructure.push({"id":"TC", "type":"group", "note":"24", "bclass":"3", "description":"Achats de marchandises et matières premières"});
    reportStructure.push({"id":"TD", "type":"group", "note":"24", "bclass":"3", "description":"Autres achats"});
    reportStructure.push({"id":"TE", "type":"group", "note":"8", "bclass":"3", "description":"Variation de stocks de marchandises, de matières premières et autres"});
    reportStructure.push({"id":"TF", "type":"group", "note":"25", "bclass":"3", "description":"Transport"});
    reportStructure.push({"id":"TG", "type":"group", "note":"26", "bclass":"3", "description":"Services extérieurs"});
    reportStructure.push({"id":"TH", "type":"group", "note":"27", "bclass":"3", "description":"Impôts et taxes"});
    reportStructure.push({"id":"TI", "type":"group", "note":"28", "bclass":"3", "description":"Autres charges"});
    reportStructure.push({"id":"TJ", "type":"group", "note":"29", "bclass":"3", "description":"Charges de personnel"});
    reportStructure.push({"id":"TK", "type":"group", "note":"31", "bclass":"3", "description":"Frais financiers et charges assimilées"});
    reportStructure.push({"id":"TL", "type":"group", "note":"5D&30", "bclass":"3", "description":"Dotations aux amortissements, aux provissions, aux dépréciations et autres"});
    reportStructure.push({"id":"XB", "type":"total", "note":"", "description":"CHARGES DES ACTIVITES ORDINAIRES (Somme TA a TL)", "sum":"TA;TB;TC;TD;TE;TF;TG;TH;TI;TJ;TK;TL"});
    reportStructure.push({"id":"XC", "type":"total", "note":"", "description":"RESULTAT DES ACTIVITES ORDINAIRES (XA - XB)", "sum":"XA;-XB"});
    reportStructure.push({"id":"TM", "type":"group", "note":"32", "bclass":"3", "description":"Produits H.A.O"});
    reportStructure.push({"id":"TN", "type":"group", "note":"32", "bclass":"3", "description":"Charges H.A.O"});
    reportStructure.push({"id":"XD", "type":"total", "note":"", "description":"RESULTAT H.A.O (TM - TN)", "sum":"TM;-TN"});
    reportStructure.push({"id":"XE", "type":"total", "note":"", "description":"RESULTAT NET (+ excédent, - déficit) (XC + XD)", "sum":"XC;XD"});
    
    return reportStructure;


    // CJ = CJ + Total Products - Total Charges
}

