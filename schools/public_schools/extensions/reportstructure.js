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


/* Update: 2025-03-09 */


/**
 * Creates the report structure for each report type.
 * - "id" used as GR/GR1 and to identify the object
 * - "type" used to define the type of data (group, title or total)
 * - "indent" used to define the indent level for the print
 * - "bclass" used to define the bclass of the group
 * - "description" used to define the description text used for the print
 * - "sum" used to define how to calculate the total
 */


// Report structure for the financial report
function createReportStructurePrimaryFinancialReport() {
    var reportStructure = [];

    reportStructure.push({"id":"SI", "type":"group", "bclass":"4", "description":"Solde Initial"});
    reportStructure.push({"id":"RFF", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Trésor publique"});
    reportStructure.push({"id":"RDLS", "type":"group", "bclass":"4", "description":"Dons, Legs et Subventions de PTF"});
    reportStructure.push({"id":"RAUT", "type":"group", "bclass":"4", "description":"Autofinancement"});
    reportStructure.push({"id":"R", "type":"total", "description":"TOTAL RECETTES", "sum":"SI;RFF;RDLS;RAUT"});

    reportStructure.push({"id":"DFF01", "type":"group", "bclass":"3", "description":"Equipements Divers"});
    reportStructure.push({"id":"DFF02", "type":"group", "bclass":"3", "description":"Entretien et Réparation"});
    reportStructure.push({"id":"DFF03", "type":"group", "bclass":"3", "description":"Interventions Ponctuelles"});
    reportStructure.push({"id":"DFF04", "type":"group", "bclass":"3", "description":"Fournitures du Bureau"});
    reportStructure.push({"id":"DFF05", "type":"group", "bclass":"3", "description":"Trousse Médicale"});
    reportStructure.push({"id":"DFF06", "type":"group", "bclass":"3", "description":"Hygiène et Salubrité"});
    reportStructure.push({"id":"DFF", "type":"total", "description":"DEPENSES FONCTIONNEMENT  = Somme de DFF1 à DFF6", "sum":"DFF01;DFF02;DFF03;DFF04;DFF05;DFF06"});
    reportStructure.push({"id":"DDLS", "type":"group", "bclass":"3", "description":"Dépenses tirées sur dons, legs et subventions"});
    reportStructure.push({"id":"DAUT", "type":"group", "bclass":"3", "description":"Dépenses tirées sur Autofinancement"});
    reportStructure.push({"id":"DDLSA", "type":"total", "description":"DEPENSES SUR DONS, LEGS ET SUBVENTIONS ET AUTOFIN", "sum":"DDLS;DAUT"});
    reportStructure.push({"id":"D", "type":"total", "description":"TOTAL DEPENSES = DFF+DDLSA", "sum":"DFF;DDLSA"});
    reportStructure.push({"id":"SFF", "type":"total", "description":"SOLDES = RFF-DFF", "sum":"RFF;-DFF"});
    reportStructure.push({"id":"SDLSA", "type":"total", "description":"SOLDE DONS, LEGS, SUBVENTIONS ET AUTOFINACEMENT = (RDLS+RAUT)-(DDLSA)", "sum":"RDLS;RAUT;-DDLSA"});
    reportStructure.push({"id":"S", "type":"total", "description":"SOLDE GENERAL = R-D", "sum":"R;-D"});

    return reportStructure;
}

// 
function createReportStructureSecondaryFinancialReport() {
    var reportStructure = [];

    reportStructure.push({"id":"SI", "type":"group", "bclass":"4", "description":"Solde Initial"});
    reportStructure.push({"id":"RAF", "type":"group", "bclass":"4", "description":"PERCEPTION DE FRAIS D'APPUI AU FONCTIONNEMENT"});
    reportStructure.push({"id":"RFF", "type":"group", "bclass":"4", "description":"Recettes de Frais de Fonctionnement trésor public"});
    reportStructure.push({"id":"TOT_RFF", "type":"total", "description":"TOTAL RECETTE FONCTIONNEMENT = RAF + RFF", "sum":"RAF;RFF"});
    reportStructure.push({"id":"RCP", "type":"group", "bclass":"4", "description":"CONTRIBUTION DES PARENTS AUX BESOINS DES ENSEIGNANTS"});
    reportStructure.push({"id":"RFORD", "type":"group", "bclass":"4", "description":"RECETTES FRAIS POUR ORDRE"});
    reportStructure.push({"id":"RDLS", "type":"group", "bclass":"4", "description":"Dons, Legs et Subventions de PTF"});
    reportStructure.push({"id":"RAUT", "type":"group", "bclass":"4", "description":"Autofinancement"});
    reportStructure.push({"id":"RDLSA", "type":"total", "description":"RECETTES DONS,LEGS, SUBVENTIONS ET AUTOFINANCEMENT", "sum":"RDLS;RAUT"});
    reportStructure.push({"id":"R", "type":"total", "description":"TOTAL RECETTES = SI+RAF+RCP+RFF+RFORD+RDLSA", "sum":"SI;RAF;RCP;RFF;RFORD;RDLSA"});

    reportStructure.push({"id":"DAF01", "type":"group", "bclass":"3", "description":"EQUIPEMENTS DIVERS"});
    reportStructure.push({"id":"DAF02", "type":"group", "bclass":"3", "description":"ENTRETIENS ET REPARATIONS"});
    reportStructure.push({"id":"DAF03", "type":"group", "bclass":"3", "description":"ACHATS MANUELS SCOLAIRES ET INVESTISSEMENT"});
    reportStructure.push({"id":"DAF04", "type":"group", "bclass":"3", "description":"INTERVENTIONS SOCIALES"});
    reportStructure.push({"id":"DAF05", "type":"group", "bclass":"3", "description":"FABRICATION BANCS"});
    reportStructure.push({"id":"DAF06", "type":"group", "bclass":"3", "description":"FOURNITURES BUREAUX"});
    reportStructure.push({"id":"DAF07", "type":"group", "bclass":"3", "description":"RENCONTRES LOCALES"});
    reportStructure.push({"id":"DAF08", "type":"group", "bclass":"3", "description":"FONCTIONEMENT DE L'ADMINISTRATION SCOLAIRE"});
    reportStructure.push({"id":"DAF09", "type":"group", "bclass":"3", "description":"ACTIVITES SPORTIVES ET CULTURELLES"});
    reportStructure.push({"id":"DAF10", "type":"group", "bclass":"3", "description":"CARTE DE L'ELEVE"});
    reportStructure.push({"id":"DAF11", "type":"group", "bclass":"3", "description":"ASSAINISSEMENT"});
    reportStructure.push({"id":"DAF", "type":"total", "description":"TOTAL DEPENSES APPUI FONCTIONNEMENT = Somme de DAF01 à DAF11", "sum":"DAF01;DAF02;DAF03;DAF04;DAF05;DAF06;DAF07;DAF08;DAF09;DAF10;DAF11"});
    
    reportStructure.push({"id":"PRIME_ENS", "type":"group", "bclass":"3", "description":"PRIMES MOTIVATION PROFESSEURS ENSEIGNANTS"});
    reportStructure.push({"id":"DSUP", "type":"group", "bclass":"3", "description":"APPUI A LA SUPERVISION"});
    reportStructure.push({"id":"DCP", "type":"group", "bclass":"3", "description":"TOTAL DEPENSES CONTRIBUTIONS PARENTS = (PRIMES ENS + DSUP)"});
    reportStructure.push({"id":"DFORD", "type":"group", "bclass":"3", "description":"DEPENSES POUR FRAIS ORDRE"});
    reportStructure.push({"id":"DDLS", "type":"group", "bclass":"3", "description":"Dépenses tirées sur dons, legs et subventions"});
    reportStructure.push({"id":"DAUT", "type":"group", "bclass":"3", "description":"Dépenses tirées sur Autofinancement"});
    reportStructure.push({"id":"DDLSA", "type":"total", "description":"DEPENSES SUR DONS, LEGS ET SUBVENTIONS ET AUTOFIN", "sum":"DDLS;DAUT"});
    reportStructure.push({"id":"D", "type":"total", "description":"TOTAL GENERAL DEPENSES = (DAF + DCP + DFORD + DDLSA)", "sum":"DAF;DCP;DFORD;DDLSA"});
    reportStructure.push({"id":"SAF", "type":"total", "description":"SOLDE APPUI FONCTIONNEMENT = TOT RFF - Somme de DAF1 à DAF11", "sum":"TOT_RFF;-DAF"});
    reportStructure.push({"id":"SCP", "type":"total", "description":"SOLDE CONTRIBUTION PARENTS = RCP - DCP", "sum":"RCP;-DCP"});
    reportStructure.push({"id":"SRFORD", "type":"total", "description":"SOLDE RECETTES POUR ORDRE = RFORD-DFORD", "sum":"RFORD;-DFORD"});
    reportStructure.push({"id":"SDLSA", "type":"total", "description":"SOLDE DONS, LEGS, SUBVENTION ET AUTOFINANCEMENT = RDLSA - DDLSA", "sum":"RDLSA;-DDLSA"});
    reportStructure.push({"id":"S", "type":"total", "description":"TOTAL SOLDES = R - D", "sum":"R;-D"});


    return reportStructure;
}
