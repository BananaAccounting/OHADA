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


/* Update: 2025-03-08 */


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
function createReportStructureFinancialReport() {
    var reportStructure = [];

    reportStructure.push({"id":"SI", "type":"group", "bclass":"4", "description":"Solde Initial"});
    reportStructure.push({"id":"RFF1", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Appuis Parents"});
    reportStructure.push({"id":"RFF2", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Trésor public"});
    reportStructure.push({"id":"A", "type":"total", "description":"Total frais Fonctionnement (RFF1+RFF2)", "sum":"RFF1;RFF2"});
    reportStructure.push({"id":"REX1", "type":"group", "bclass":"4", "description":"Participation Préliminaire Autodidactes"});
    reportStructure.push({"id":"REX2", "type":"group", "bclass":"4", "description":"Vente des formules Examen d'Etat"});
    reportStructure.push({"id":"REX3", "type":"group", "bclass":"4", "description":"Participation candidats Hors session"});
    reportStructure.push({"id":"REX4", "type":"group", "bclass":"4", "description":"Participation candidats  session"});
    reportStructure.push({"id":"B", "type":"total", "description":"Total Frais Examens d'Etat (Somme RX1 à RX4)", "sum":"REX1;REX2;REX3;REX4"});
    reportStructure.push({"id":"RTENASOS", "type":"group", "bclass":"4", "description":"Versement Comité local TENASOSP"});
    reportStructure.push({"id":"C", "type":"total", "description":"Versement Comité local TENASOSP", "sum":"RTENASOS"});
    reportStructure.push({"id":"D", "type":"total", "description":"TOTAL GENERAL RECETTES (SI+A+B+C)", "sum":"SI;A;B;C"});

    reportStructure.push({"id":"DFF1", "type":"group", "bclass":"3", "description":"FOURNITURES DES BUREAUX"});
    reportStructure.push({"id":"DFF2", "type":"group", "bclass":"3", "description":"INTRANTS INFORMATIQUES"});
    reportStructure.push({"id":"DFF3", "type":"group", "bclass":"3", "description":"FORFAIT INTERNET"});
    reportStructure.push({"id":"DFF4", "type":"group", "bclass":"3", "description":"COMMUNICATION/INFORMATION"});
    reportStructure.push({"id":"DFF5", "type":"group", "bclass":"3", "description":"FORMULE D'EXPLOITATION"});
    reportStructure.push({"id":"DFF6", "type":"group", "bclass":"3", "description":"FORMATION"});
    reportStructure.push({"id":"DFF7", "type":"group", "bclass":"3", "description":"GESTION VEHICULES"});
    reportStructure.push({"id":"DFF8", "type":"group", "bclass":"3", "description":"GESTION MATERIEL/INFORMATIQUE"});
    reportStructure.push({"id":"DFF9", "type":"group", "bclass":"3", "description":"RENOUVELEMENT MOBILIERS"});
    reportStructure.push({"id":"DFF10", "type":"group", "bclass":"3", "description":"INTERVENTIONS SOCIALES"});
    reportStructure.push({"id":"DFF11", "type":"group", "bclass":"3", "description":"MISSION DE SERVICE"});
    reportStructure.push({"id":"DFF12", "type":"group", "bclass":"3", "description":"RAFFRAICHISSEMENT BUREAUX"});
    reportStructure.push({"id":"DFF13", "type":"group", "bclass":"3", "description":"RENCONTRES LOCALES"});
    reportStructure.push({"id":"DFF14", "type":"group", "bclass":"3", "description":"IMPREVUS"});
    reportStructure.push({"id":"E", "type":"total", "description":"TOTAL DEPENSES F F (Somme de DFF1 à DFF14)", "sum":"DFF1;DFF2;DFF3;DFF4;DFF5;DFF6;DFF7;DFF8;DFF9;DFF10;DFF11;DFF12;DFF13;DFF14"});
    
    reportStructure.push({"id":"DEX11", "type":"group", "bclass":"3", "description":"RETRAIT ET CONDITIONNEMENT"});
    reportStructure.push({"id":"DEX12", "type":"group", "bclass":"3", "description":"RENCONTRE DE SENSIBILISATION ET SUIVI DU CP"});
    reportStructure.push({"id":"DEX13", "type":"group", "bclass":"3", "description":"DISTRIBUTION DES COLIS"});
    reportStructure.push({"id":"DEX14", "type":"group", "bclass":"3", "description":"PASSATION"});
    reportStructure.push({"id":"DEX15", "type":"group", "bclass":"3", "description":"CORRECTION ET FINALISATION"});
    reportStructure.push({"id":"DEX16", "type":"group", "bclass":"3", "description":"RAPPORT FINAL"});
    reportStructure.push({"id":"DEX17", "type":"group", "bclass":"3", "description":"FOURNITURES"});
    reportStructure.push({"id":"DEX18", "type":"group", "bclass":"3", "description":"IMPREVUS"});
    reportStructure.push({"id":"F", "type":"total", "description":"TOTAL DEPENSES Préliminaire (Somme de DEX11 à DEX18)", "sum":"DEX11;DEX12;DEX13;DEX14;DEX15;DEX16;DEX17;DEX18"});
    
    reportStructure.push({"id":"DEX21", "type":"group", "bclass":"3", "description":"RETRAIT ET CONDITIONNEMENT"});
    reportStructure.push({"id":"DEX22", "type":"group", "bclass":"3", "description":"DISTRIBUTION  ET DEPÔT"});
    reportStructure.push({"id":"DEX23", "type":"group", "bclass":"3", "description":"CONTRÔLE ET TRAITEMENT"});
    reportStructure.push({"id":"DEX24", "type":"group", "bclass":"3", "description":"RENCONTRE DE SENSIBILISATION ET SUIVI DU CP"});
    reportStructure.push({"id":"DEX25", "type":"group", "bclass":"3", "description":"INTRANTS, TRAVAUX ET MAINTENANCE INFORMATIQUE"});
    reportStructure.push({"id":"DEX26", "type":"group", "bclass":"3", "description":"SUPERVISION DE LA PROVINCE ADMINISTRATIVE"});
    reportStructure.push({"id":"DEX27", "type":"group", "bclass":"3", "description":"SUPERVISION  PROVINCIALE AUTRE"});
    reportStructure.push({"id":"DEX28", "type":"group", "bclass":"3", "description":"IMPREVUS"});
    reportStructure.push({"id":"G", "type":"total", "description":"TOTAL DEPENSES FORMULES EXEMAN D'ETAT (Somme de DEX21 à DEX29)", "sum":"DEX21;DEX22;DEX23;DEX24;DEX25;DEX26;DEX27;DEX28"});
    
    reportStructure.push({"id":"DEX310", "type":"group", "bclass":"3", "description":"RETRAIT ET CONDITIONNEMENT"});
    reportStructure.push({"id":"DEX311", "type":"group", "bclass":"3", "description":"DISTRIBUTION DES COLIS"});
    reportStructure.push({"id":"DEX312", "type":"group", "bclass":"3", "description":"PASSATION"});
    reportStructure.push({"id":"DEX313", "type":"group", "bclass":"3", "description":"CORRECTION ET FINALISATION"});
    reportStructure.push({"id":"DEX314", "type":"group", "bclass":"3", "description":"RENCONTRE DE SENSIBILISATION ET SUIVI DU CP"});
    reportStructure.push({"id":"DEX315", "type":"group", "bclass":"3", "description":"INTRANTS, TRAVAUX ET MAINTENANCE INFORMATIQUE"});
    reportStructure.push({"id":"DEX316", "type":"group", "bclass":"3", "description":"RAPPORT FINAL"});
    reportStructure.push({"id":"DEX317", "type":"group", "bclass":"3", "description":"SUPERVISION DE LA PROVINCE ADMINISTRATIVE"});
    reportStructure.push({"id":"DEX318", "type":"group", "bclass":"3", "description":"SUPERVISION DE LA PROVINCIALE AUTRE"});
    reportStructure.push({"id":"DEX319", "type":"group", "bclass":"3", "description":"IMPREVUS"});
    reportStructure.push({"id":"H", "type":"total", "description":"TOTAL DEPENSES EXEMAN D'ETAT HORS SESSION (Somme de DEX310 à DEX319)", "sum":"DEX310;DEX311;DEX312;DEX313;DEX314;DEX315;DEX316;DEX317;DEX318;DEX319"});
    
    reportStructure.push({"id":"DEX410", "type":"group", "bclass":"3", "description":"RETRAIT ET CONDITIONNEMENT"});
    reportStructure.push({"id":"DEX411", "type":"group", "bclass":"3", "description":"DISTRIBUTION DES COLIS"});
    reportStructure.push({"id":"DEX412", "type":"group", "bclass":"3", "description":"PASSATION"});
    reportStructure.push({"id":"DEX413", "type":"group", "bclass":"3", "description":"CORRECTION ET FINALISATION"});
    reportStructure.push({"id":"DEX414", "type":"group", "bclass":"3", "description":"RENCONTRE DE SENSIBILISATION ET SUIVI DU CP"});
    reportStructure.push({"id":"DEX415", "type":"group", "bclass":"3", "description":"INTRANTS, TRAVAUX ET MAINTENANCE INFORMATIQUE"});
    reportStructure.push({"id":"DEX416", "type":"group", "bclass":"3", "description":"APPUI LOGISTIQUE A LA HIERARCHIE"});
    reportStructure.push({"id":"DEX417", "type":"group", "bclass":"3", "description":"RAPPORT FINAL SESSION"});
    reportStructure.push({"id":"DEX418", "type":"group", "bclass":"3", "description":"SUPERVISION DE LA PROVINCE ADMINISTRATIVE"});
    reportStructure.push({"id":"DEX419", "type":"group", "bclass":"3", "description":"SUPERVISION  PROVINCIALE AUTRE"});
    reportStructure.push({"id":"DEX420", "type":"group", "bclass":"3", "description":"IMPREVUS"});
    reportStructure.push({"id":"I", "type":"total", "description":"TOTAL DEPENSES EXEMAN D'ETAT SESSION ORDINAIRE (Somme de DEX410 à DEX421)", "sum":"DEX410;DEX411;DEX412;DEX413;DEX414;DEX415;DEX416;DEX417;DEX418;DEX419;DEX420"});
    reportStructure.push({"id":"J", "type":"total", "description":"TOTAL GENERAL DEPENSES = (E+F+G+H+I)", "sum":"E;F;G;H;I"});
    reportStructure.push({"id":"K", "type":"total", "description":"SOLDE FRAIS DE FONCTIONNEMENT = (RFF1+RFF2) - (Somme de DFF1 à DFF14)", "sum":"A;-E"});
    reportStructure.push({"id":"L", "type":"total", "description":"SOLDE PRELIMINAIRE EXETAT = (REX1) - (Somme de DEX11 à DEX18)", "sum":"REX1;-F"});
    reportStructure.push({"id":"M", "type":"total", "description":"SOLDES FORMULE EXETAT = (REX2) - (Somme de DEX21 à DEX29)", "sum":"REX2;-G"});
    reportStructure.push({"id":"N", "type":"total", "description":"SOLDE HORS SESSION EXETAT = (REX3 - (Somme de DEX311 à DEX320)", "sum":"REX3;-H"});
    reportStructure.push({"id":"O", "type":"total", "description":"SOLDE SESSION EXETAT = (REX4 - (Somme de DEX410 à DEX421)", "sum":"REX4;-I"});
    reportStructure.push({"id":"P", "type":"total", "description":"SOLDE GENERAL = (D-J)", "sum":"D;-J"});


    return reportStructure;
}

// 
function createReportStructureFinancialReportSecondaryPool() {
    var reportStructure = [];

    reportStructure.push({"id":"SI", "type":"group", "bclass":"4", "description":"Solde Initial"});
    reportStructure.push({"id":"RFF1", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Appuis Parents"});
    reportStructure.push({"id":"RFF2", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Trésor public"});
    reportStructure.push({"id":"A", "type":"total", "description":"Total frais Fonctionnement (RFF1+RFF2)", "sum":"RFF1;RFF2"});
    reportStructure.push({"id":"TENASOSP", "type":"group", "bclass":"4", "description":"Participation Candidat TENASOSP"});
    reportStructure.push({"id":"B", "type":"total", "description":"Total TENASOSP", "sum":"A;TENASOSP"});
    reportStructure.push({"id":"C", "type":"total", "description":"TOTAL GENERAL RECETTES (SI+A+B)", "sum":"SI;A;B"});

    reportStructure.push({"id":"DFF1", "type":"group", "bclass":"3", "description":"FOURNITURES DES BUREAUX"});
    reportStructure.push({"id":"DFF2", "type":"group", "bclass":"3", "description":"INTRANTS INFORMATIQUES"});
    reportStructure.push({"id":"DFF3", "type":"group", "bclass":"3", "description":"FORFAIT INTERNET"});
    reportStructure.push({"id":"DFF4", "type":"group", "bclass":"3", "description":"COMMUNICATION/INFORMATION"});
    reportStructure.push({"id":"DFF5", "type":"group", "bclass":"3", "description":"FORMULE D'EXPLOITATION"});
    reportStructure.push({"id":"DFF6", "type":"group", "bclass":"3", "description":"FORMATION"});
    reportStructure.push({"id":"DFF7", "type":"group", "bclass":"3", "description":"GESTION VEHICULES"});
    reportStructure.push({"id":"DFF8", "type":"group", "bclass":"3", "description":"GESTION MATERIEL/INFORMATIQUE"});
    reportStructure.push({"id":"DFF9", "type":"group", "bclass":"3", "description":"RENOUVELEMENT MOBILIERS"});
    reportStructure.push({"id":"DFF10", "type":"group", "bclass":"3", "description":"INTERVENTIONS SOCIALES"});
    reportStructure.push({"id":"DFF11", "type":"group", "bclass":"3", "description":"MISSION DE SERVICE"});
    reportStructure.push({"id":"DFF12", "type":"group", "bclass":"3", "description":"RAFFRAICHISSEMENT BUREAUX"});
    reportStructure.push({"id":"DFF13", "type":"group", "bclass":"3", "description":"RENCONTRES LOCALES"});
    reportStructure.push({"id":"DFF14", "type":"group", "bclass":"3", "description":"DIVERS"});
    reportStructure.push({"id":"D", "type":"total", "description":"TOTAL DEPENSES F F (Somme de DFF1 à DFF14)", "sum":"DFF1;DFF2;DFF3;DFF4;DFF5;DFF6;DFF7;DFF8;DFF9;DFF10;DFF11;DFF12;DFF13;DFF14"});
    
    reportStructure.push({"id":"DTENA01", "type":"group", "bclass":"3", "description":"Appui à la hiérarchie"});
    reportStructure.push({"id":"DTENA02", "type":"group", "bclass":"3", "description":"Versement à l'échelon national"});
    reportStructure.push({"id":"DTENA03", "type":"group", "bclass":"3", "description":"Versement à l'échelon provincial"});
    reportStructure.push({"id":"DTENA04", "type":"group", "bclass":"3", "description":"Appui à l'ENAFEP"});
    reportStructure.push({"id":"DTENA05", "type":"group", "bclass":"3", "description":"Rétrocession aux écoles"});
    reportStructure.push({"id":"DTENA06", "type":"group", "bclass":"3", "description":"Appui psycho-technique"});
    reportStructure.push({"id":"DTENA07", "type":"group", "bclass":"3", "description":"Distribution des colis dans les centres"});
    reportStructure.push({"id":"DTENA08", "type":"group", "bclass":"3", "description":"Recouvrement"});
    reportStructure.push({"id":"DTENA09", "type":"group", "bclass":"3", "description":"Centre d'administration"});
    reportStructure.push({"id":"DTENA10", "type":"group", "bclass":"3", "description":"Permanence"});
    reportStructure.push({"id":"DTENA11", "type":"group", "bclass":"3", "description":"Supervision"});
    reportStructure.push({"id":"DTENA12", "type":"group", "bclass":"3", "description":"Dépouillement et codification"});
    reportStructure.push({"id":"DTENA13", "type":"group", "bclass":"3", "description":"Planification de la correction"});
    reportStructure.push({"id":"DTENA14", "type":"group", "bclass":"3", "description":"Correction"});
    reportStructure.push({"id":"E", "type":"total", "description":"TOTAL DEPENSES TENASOSP = (Somme de DTENA01 à DTENA14)", "sum":"DTENA01;DTENA02;DTENA03;DTENA04;DTENA05;DTENA06;DTENA07;DTENA08;DTENA09;DTENA10;DTENA11;DTENA12;DTENA13;DTENA14"});

    reportStructure.push({"id":"F", "type":"total", "description":"TOTAL GENERAL DEPENSES = (D+E)", "sum":"D;E"});
    reportStructure.push({"id":"G", "type":"total", "description":"SOLDE FRAIS DE FONCTIONNEMENT = (RFF1+RFF2) - (Somme de DFF1 à DFF14)", "sum":"A;-D"});
    reportStructure.push({"id":"H", "type":"total", "description":"SOLDE TENASOSP = (RTENA) - (Somme de DTENA01 à DTENA14)", "sum":"B;-E"});
    reportStructure.push({"id":"I", "type":"total", "description":"SOLDE GENERAL = C-F", "sum":"C;-F"});


    return reportStructure;
}
