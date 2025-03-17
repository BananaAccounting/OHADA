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
    reportStructure.push({"id":"RFF1", "type":"group", "bclass":"4", "description":"Frais d'appui à la supervision (Ecoles Primaires Privées)"});
    reportStructure.push({"id":"RFF2", "type":"group", "bclass":"4", "description":"Frais d'appui à la supervision (Ecoles Secondaires Publiques et Privées)"});
    reportStructure.push({"id":"RFF3", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Trésor publique"});
    reportStructure.push({"id":"A", "type":"total", "description":"Total frais Fonctionnement (RFF1+RFF2+RFF3)", "sum":"RFF1;RFF2;RFF3"});
    reportStructure.push({"id":"REX1", "type":"group", "bclass":"4", "description":"Participation Préliminaire Autodidactes"});
    reportStructure.push({"id":"REX2", "type":"group", "bclass":"4", "description":"Vente des formules Examen d'Etat E01"});
    reportStructure.push({"id":"REX3", "type":"group", "bclass":"4", "description":"Participation candidats Hors session"});
    reportStructure.push({"id":"REX4", "type":"group", "bclass":"4", "description":"Participation candidats session ordinaire"});
    reportStructure.push({"id":"B", "type":"total", "description":"Total Recette Examens d'Etat (Somme RX1 à RX4)", "sum":"REX1;REX2;REX3;REX4"});
    reportStructure.push({"id":"RTENA01", "type":"group", "bclass":"4", "description":"Quotité TENASOSP Province"});
    reportStructure.push({"id":"RTENA02", "type":"group", "bclass":"4", "description":"Versement reçu pour la hiérarchie pour la Coordination"});
    reportStructure.push({"id":"RTENA03", "type":"group", "bclass":"4", "description":"Versement reçu pour l'échelon national"});
    reportStructure.push({"id":"RTENA04", "type":"group", "bclass":"4", "description":"Versement reçu pour l'échelon provincial"});
    reportStructure.push({"id":"RTENA05", "type":"group", "bclass":"4", "description":"Appui reçu à l'ENAFEP"});
    reportStructure.push({"id":"C", "type":"total", "description":"TOTAL TENASOSP", "sum":"RTENA01;RTENA02;RTENA03;RTENA04;RTENA05"});
    reportStructure.push({"id":"RDLS", "type":"group", "bclass":"4", "description":"Dons, Legs et Subvention"});
    reportStructure.push({"id":"RAUTO", "type":"group", "bclass":"4", "description":"Autofinancement"});
    reportStructure.push({"id":"RDLSA", "type":"total", "description":"TOTAL DONS LEGS ET SUBVENTIONS = RDLS+RAUTO", "sum":"RDLS;RAUTO"});
    reportStructure.push({"id":"D", "type":"total", "description":"TOTAL GENERAL RECETTES (SI+A+B+C+RDLSA)", "sum":"SI;A;B;C;RDLSA"});

    reportStructure.push({"id":"DFF1", "type":"group", "bclass":"3", "description":"Fournitures de bureau"});
    reportStructure.push({"id":"DFF2", "type":"group", "bclass":"3", "description":"Intrants informatiques"});
    reportStructure.push({"id":"DFF3", "type":"group", "bclass":"3", "description":"Forfait internet"});
    reportStructure.push({"id":"DFF4", "type":"group", "bclass":"3", "description":"Communication/Presse"});
    reportStructure.push({"id":"DFF5", "type":"group", "bclass":"3", "description":"Formule d'exploitation"});
    reportStructure.push({"id":"DFF6", "type":"group", "bclass":"3", "description":"Formation"});
    reportStructure.push({"id":"DFF7", "type":"group", "bclass":"3", "description":"Entretien et Réparation véhicule"});
    reportStructure.push({"id":"DFF8", "type":"group", "bclass":"3", "description":"Entretien et Réparation matériels et mobiliers"});
    reportStructure.push({"id":"DFF9", "type":"group", "bclass":"3", "description":"Acquisition matériels et mobiliers"});
    reportStructure.push({"id":"DFF10", "type":"group", "bclass":"3", "description":"Interventions sociales"});
    reportStructure.push({"id":"DFF11", "type":"group", "bclass":"3", "description":"Collation pour ordre de service"});
    reportStructure.push({"id":"DFF12", "type":"group", "bclass":"3", "description":"Cafetariat et rafraichissement "});
    reportStructure.push({"id":"DFF13", "type":"group", "bclass":"3", "description":"Rencontres locales"});
    reportStructure.push({"id":"DFF14", "type":"group", "bclass":"3", "description":"Constructions et aménagement des Bâtiments"});
    reportStructure.push({"id":"E", "type":"total", "description":"TOTAL DEPENSES F F (Somme de DFF1 à DFF14)", "sum":"DFF1;DFF2;DFF3;DFF4;DFF5;DFF6;DFF7;DFF8;DFF9;DFF10;DFF11;DFF12;DFF13;DFF14"});
    
    reportStructure.push({"id":"DEX11", "type":"group", "bclass":"3", "description":"Retrait et conditionnement préliminaire"});
    reportStructure.push({"id":"DEX12", "type":"group", "bclass":"3", "description":"Rencontre de sensibilisation et suivi du comité provincial"});
    reportStructure.push({"id":"DEX13", "type":"group", "bclass":"3", "description":"Distribution des colis"});
    reportStructure.push({"id":"DEX14", "type":"group", "bclass":"3", "description":"Passation "});
    reportStructure.push({"id":"DEX15", "type":"group", "bclass":"3", "description":"Correction et finalisation"});
    reportStructure.push({"id":"DEX16", "type":"group", "bclass":"3", "description":"Rapport final"});
    reportStructure.push({"id":"DEX17", "type":"group", "bclass":"3", "description":"Fournitures"});
    reportStructure.push({"id":"F", "type":"total", "description":"TOTAL DEPENSES Préliminaire (Somme de DEX11 à DEX17)", "sum":"DEX11;DEX12;DEX13;DEX14;DEX15;DEX16;DEX17"});
    
    reportStructure.push({"id":"DEX21", "type":"group", "bclass":"3", "description":"Retrait et conditionnement"});
    reportStructure.push({"id":"DEX22", "type":"group", "bclass":"3", "description":"Distribution et dépôt"});
    reportStructure.push({"id":"DEX23", "type":"group", "bclass":"3", "description":"Contrôle et traitement"});
    reportStructure.push({"id":"DEX24", "type":"group", "bclass":"3", "description":"Rencontre de sensibilisation et suivi du comité Provincial"});
    reportStructure.push({"id":"DEX25", "type":"group", "bclass":"3", "description":"Intrants, travaux et maintenance informatique"});
    reportStructure.push({"id":"DEX26", "type":"group", "bclass":"3", "description":"Supervision de la province administrative"});
    reportStructure.push({"id":"DEX27", "type":"group", "bclass":"3", "description":"Supervision provinciale autre"});
    reportStructure.push({"id":"G", "type":"total", "description":"TOTAL DEPENSES FORMULES EXEMAN D'ETAT (Somme de DEX21 à DEX27)", "sum":"DEX21;DEX22;DEX23;DEX24;DEX25;DEX26;DEX27"});
    
    reportStructure.push({"id":"DEX310", "type":"group", "bclass":"3", "description":"Retrait et conditionnement"});
    reportStructure.push({"id":"DEX311", "type":"group", "bclass":"3", "description":"Distribution des colis"});
    reportStructure.push({"id":"DEX312", "type":"group", "bclass":"3", "description":"Passation"});
    reportStructure.push({"id":"DEX313", "type":"group", "bclass":"3", "description":"Correction et finalisation"});
    reportStructure.push({"id":"DEX314", "type":"group", "bclass":"3", "description":"Rencontre de sensibilisation et suivi du cp"});
    reportStructure.push({"id":"DEX315", "type":"group", "bclass":"3", "description":"Intrants, travaux et maintenance informatique"});
    reportStructure.push({"id":"DEX316", "type":"group", "bclass":"3", "description":"Rapport final"});
    reportStructure.push({"id":"DEX317", "type":"group", "bclass":"3", "description":"Supervision de la province administrative"});
    reportStructure.push({"id":"DEX318", "type":"group", "bclass":"3", "description":"Supervision provinciale autre"});
    reportStructure.push({"id":"H", "type":"total", "description":"TOTAL DEPENSES EXEMAN D'ETAT HORS SESSION (Somme de DEX310 à DEX318)", "sum":"DEX310;DEX311;DEX312;DEX313;DEX314;DEX315;DEX316;DEX317;DEX318"});
    
    reportStructure.push({"id":"DEX410", "type":"group", "bclass":"3", "description":"Retrait et conditionnement"});
    reportStructure.push({"id":"DEX411", "type":"group", "bclass":"3", "description":"Distribution des colis"});
    reportStructure.push({"id":"DEX412", "type":"group", "bclass":"3", "description":"Passation"});
    reportStructure.push({"id":"DEX413", "type":"group", "bclass":"3", "description":"Traitement et finalisation des documents et rapports"});
    reportStructure.push({"id":"DEX414", "type":"group", "bclass":"3", "description":"Rencontre de sensibilisation et suivi du CP"});
    reportStructure.push({"id":"DEX415", "type":"group", "bclass":"3", "description":"Intrants, travaux et maintenance informatique"});
    reportStructure.push({"id":"DEX416", "type":"group", "bclass":"3", "description":"Appui logistique a d'autres services"});
    reportStructure.push({"id":"DEX417", "type":"group", "bclass":"3", "description":"Rapport final session"});
    reportStructure.push({"id":"DEX418", "type":"group", "bclass":"3", "description":"Supervision de la province administrative"});
    reportStructure.push({"id":"DEX419", "type":"group", "bclass":"3", "description":"Supervision provinciale autre"});
    reportStructure.push({"id":"DEX420", "type":"group", "bclass":"3", "description":"Imprévus et Divers"});
    reportStructure.push({"id":"I", "type":"total", "description":"TOTAL DEPENSES EXEMAN D'ETAT SESSION ORDINAIRE (Somme de DEX410 à DEX420)", "sum":"DEX410;DEX411;DEX412;DEX413;DEX414;DEX415;DEX416;DEX417;DEX418;DEX419;DEX420"});
    reportStructure.push({"id":"J", "type":"total", "description":"TOTAL DEPENSES GENERAL EXAMEN D'ETAT = (F+G+H+I)", "sum":"F;G;H;I"});
    reportStructure.push({"id":"DTENA01", "type":"group", "bclass":"3", "description":"Sensibilisation de la communauté éducationnelle sur TENASOSP"});
    reportStructure.push({"id":"DTENA02", "type":"group", "bclass":"3", "description":"Appui Psychopédagogiques aux Gestionnaires"});
    reportStructure.push({"id":"DTENA03", "type":"group", "bclass":"3", "description":"Commission Provinciale d'Etudes et conception TENASOSP"});
    reportStructure.push({"id":"DTENA04", "type":"group", "bclass":"3", "description":"Lancement de la Passation"});
    reportStructure.push({"id":"DTENA05", "type":"group", "bclass":"3", "description":"Montage de Différentes batteries de Test "});
    reportStructure.push({"id":"DTENA06", "type":"group", "bclass":"3", "description":"Gestion de la caisse"});
    reportStructure.push({"id":"DTENA07", "type":"group", "bclass":"3", "description":"Evaluation des acquis scolaires"});
    reportStructure.push({"id":"DTENA08", "type":"group", "bclass":"3", "description":"Supervision administratif et technique"});
    reportStructure.push({"id":"DTENA09", "type":"group", "bclass":"3", "description":"Commission Provinciale d'orientation"});
    reportStructure.push({"id":"DTENA10", "type":"group", "bclass":"3", "description":"Appui ENAFEP"});
    reportStructure.push({"id":"DTENA11", "type":"group", "bclass":"3", "description":"Versement Echelon National"});    
    reportStructure.push({"id":"K", "type":"total", "description":"TOTAL DEPENSES TENASOSP = Somme de DTENA 01 à DTENA 11", "sum":"DTENA01;DTENA02;DTENA03;DTENA04;DTENA05;DTENA06;DTENA07;DTENA08;DTENA09;DTENA10;DTENA11"});
    reportStructure.push({"id":"DDLS", "type":"group", "bclass":"3", "description":"Dépenses tirées sur dons, legs et subventions"});
    reportStructure.push({"id":"DAUT", "type":"group", "bclass":"3", "description":"Dépenses tirées sur Autofinancement"});
    reportStructure.push({"id":"DDLSA", "type":"total", "description":"TOTAL DEPENSES DONS, LEGS ET SUBVENTIONS ET AUTOFINANCEMENT = DDLS+DAUT", "sum":"DDLS;DAUT"});
    reportStructure.push({"id":"L", "type":"total", "description":"TOTAL GENERAL DEPENSES = (E+F+G+H+I)", "sum":"E;F;G;H;I"});
    reportStructure.push({"id":"M", "type":"total", "description":"SOLDE FRAIS DE FONCTIONNEMENT = A-E", "sum":"A;-E"});
    reportStructure.push({"id":"N", "type":"total", "description":"SOLDE EXAMENS D'ETAT = B-J", "sum":"B;-J"});
    reportStructure.push({"id":"O", "type":"total", "description":"SOLDE TENASOSP = C-K", "sum":"C;-K"});
    reportStructure.push({"id":"P", "type":"total", "description":"SOLDE DONS, LEGS, SUBVENTION ET AUTOFINANCEMENT = RDLSA -DDLSA", "sum":"RDLSA;-DDLSA"});
    reportStructure.push({"id":"Q", "type":"total", "description":"SOLDE GENERAL = (D-L)", "sum":"D;-L"});


    return reportStructure;
}

// 
function createReportStructureFinancialReportSecondaryPool() {
    var reportStructure = [];

    reportStructure.push({"id":"SI", "type":"group", "bclass":"4", "description":"Solde Initial"});
    reportStructure.push({"id":"RFF1", "type":"group", "bclass":"4", "description":"Frais d'appui à la supervision (Ecoles Primaires Privées)"});
    reportStructure.push({"id":"RFF2", "type":"group", "bclass":"4", "description":"Frais d'appui à la supervision (Ecoles Secondaires Publiques et Privées)"});
    reportStructure.push({"id":"RFF3", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Trésor publique"});
    reportStructure.push({"id":"A", "type":"total", "description":"Total frais Fonctionnement (RFF1+RFF2+RFF3)", "sum":"RFF1;RFF2;RFF3"});
    reportStructure.push({"id":"RTENA", "type":"group", "bclass":"4", "description":"Participation Candidat TENASOSP"});
    reportStructure.push({"id":"RE01", "type":"group", "bclass":"4", "description":"Perception des Fiche E01"});
    reportStructure.push({"id":"RHS", "type":"group", "bclass":"4", "description":"Participation candidat Hors Session"});
    reportStructure.push({"id":"RSO", "type":"group", "bclass":"4", "description":"Participation candidat Session ordinaire"});
    reportStructure.push({"id":"B", "type":"total", "description":"Total RECETTES EVALUATION CERTIFICATIVE (RTNA à RSO)", "sum":"RTENA;RE01;RHS;RSO"});
    reportStructure.push({"id":"RDLS", "type":"group", "bclass":"4", "description":" Dons, Legs et Subventions de PTF"});
    reportStructure.push({"id":"RAUT", "type":"group", "bclass":"4", "description":" Autofinancement"});
    reportStructure.push({"id":"RDLSA", "type":"total", "description":"RECETTES DONS,LEGS, SUBVENTIONS ET AUTOFINANCEMENT", "sum":"RDLS;RAUT"});
    reportStructure.push({"id":"C", "type":"total", "description":"TOTAL GENERAL RECETTES (SI+A+B+RDLSA)", "sum":"SI;A;B;RDLSA"});

    reportStructure.push({"id":"DFF1", "type":"group", "bclass":"3", "description":"Fournitures de bureau"});
    reportStructure.push({"id":"DFF2", "type":"group", "bclass":"3", "description":"Intrants informatiques"});
    reportStructure.push({"id":"DFF3", "type":"group", "bclass":"3", "description":"Forfait internet"});
    reportStructure.push({"id":"DFF4", "type":"group", "bclass":"3", "description":"Communication/Presse"});
    reportStructure.push({"id":"DFF5", "type":"group", "bclass":"3", "description":"Formule d'exploitation"});
    reportStructure.push({"id":"DFF6", "type":"group", "bclass":"3", "description":"Formation"});
    reportStructure.push({"id":"DFF7", "type":"group", "bclass":"3", "description":"Entretien et Réparation véhicule"});
    reportStructure.push({"id":"DFF8", "type":"group", "bclass":"3", "description":"Entretien et Réparation matériels et mobiliers"});
    reportStructure.push({"id":"DFF9", "type":"group", "bclass":"3", "description":"Acquisition matériels et mobiliers"});
    reportStructure.push({"id":"DFF10", "type":"group", "bclass":"3", "description":"Interventions sociales"});
    reportStructure.push({"id":"DFF11", "type":"group", "bclass":"3", "description":"Collation pour ordre de service"});
    reportStructure.push({"id":"DFF12", "type":"group", "bclass":"3", "description":"Cafetariat et rafraichissement "});
    reportStructure.push({"id":"DFF13", "type":"group", "bclass":"3", "description":"Rencontres locales"});
    reportStructure.push({"id":"DFF14", "type":"group", "bclass":"3", "description":"Constructions et aménagement des Bâtiments"});
    reportStructure.push({"id":"D", "type":"total", "description":"TOTAL DEPENSES F F (Somme de DFF1 à DFF14)", "sum":"DFF1;DFF2;DFF3;DFF4;DFF5;DFF6;DFF7;DFF8;DFF9;DFF10;DFF11;DFF12;DFF13;DFF14"});
    
    reportStructure.push({"id":"DTENA01", "type":"group", "bclass":"3", "description":"Appui à la hiérarchie pour la Coordination"});
    reportStructure.push({"id":"DTENA02", "type":"group", "bclass":"3", "description":"Versement à l'échelon national"});
    reportStructure.push({"id":"DTENA03", "type":"group", "bclass":"3", "description":"Versement à l'échelon provincial"});
    reportStructure.push({"id":"DTENA04", "type":"group", "bclass":"3", "description":"Appui à l'ENAFEP"});
    reportStructure.push({"id":"DTENA05", "type":"group", "bclass":"3", "description":"Rétrocession aux écoles"});
    reportStructure.push({"id":"DTENA06", "type":"group", "bclass":"3", "description":"Appui psycho-technique"});
    reportStructure.push({"id":"DTENA07", "type":"group", "bclass":"3", "description":"Préparation technique"});
    reportStructure.push({"id":"DTENA08", "type":"group", "bclass":"3", "description":"Distribution des colis dans les centres"});
    reportStructure.push({"id":"DTENA09", "type":"group", "bclass":"3", "description":"Recouvrement"});
    reportStructure.push({"id":"DTENA10", "type":"group", "bclass":"3", "description":"Centre d'administration"});
    reportStructure.push({"id":"DTENA11", "type":"group", "bclass":"3", "description":"Permanence"});
    reportStructure.push({"id":"DTENA12", "type":"group", "bclass":"3", "description":"Supervision"});
    reportStructure.push({"id":"DTENA13", "type":"group", "bclass":"3", "description":"Dépouillement et codification"});
    reportStructure.push({"id":"DTENA14", "type":"group", "bclass":"3", "description":"Planification de la correction"});
    reportStructure.push({"id":"DTENA15", "type":"group", "bclass":"3", "description":"Correction proprement dite"});
    reportStructure.push({"id":"DTENA16", "type":"group", "bclass":"3", "description":"Transcription des résultats"});
    reportStructure.push({"id":"DTENA17", "type":"group", "bclass":"3", "description":"Délibération des résultats"});
    reportStructure.push({"id":"DTENA18", "type":"group", "bclass":"3", "description":"Profilage"});
    reportStructure.push({"id":"DTENA19", "type":"group", "bclass":"3", "description":"Publication des résultats"});
    reportStructure.push({"id":"DTENA20", "type":"group", "bclass":"3", "description":"Rédaction des brevets"});
    reportStructure.push({"id":"E", "type":"total", "description":"TOTAL DEPENSES TENASOSP = (Somme de DTENA01 à DTENA20)", "sum":"DTENA01;DTENA02;DTENA03;DTENA04;DTENA05;DTENA06;DTENA07;DTENA08;DTENA09;DTENA10;DTENA11;DTENA12;DTENA13;DTENA14;DTENA15;DTENA16;DTENA17;DTENA18;DTENA19;DTENA20"});
    reportStructure.push({"id":"DE01", "type":"group", "bclass":"3", "description":"Versement Recettes des Fiche E01"});
    reportStructure.push({"id":"DHS", "type":"group", "bclass":"3", "description":"Versement Frais de participation Hors Session"});
    reportStructure.push({"id":"DSO", "type":"group", "bclass":"3", "description":"Versement Frais de participation Session ordinaire"});
    reportStructure.push({"id":"F", "type":"total", "description":"TOTAL DEPENSES EXEMEN D'ETAT = DE01+DHS+DSO)", "sum":"DE01;DHS;DSO"});
    reportStructure.push({"id":"DDLS", "type":"group", "bclass":"3", "description":"Dépenses tirées sur dons, legs et subventions"});
    reportStructure.push({"id":"DAUT", "type":"group", "bclass":"3", "description":"Dépenses tirées sur Autofinancement"});
    reportStructure.push({"id":"DDLSA", "type":"total", "description":"DEPENSES SUR DONS, LEGS ET SUBVENTIONS ET AUTOFIN", "sum":"DDLS;DAUT"});
    reportStructure.push({"id":"G", "type":"total", "description":"TOTAL GENERAL DEPENSES = (D+E+F)", "sum":"D;E;F"});
    reportStructure.push({"id":"H", "type":"total", "description":"SOLDE FRAIS DE FONCTIONNEMENT = A-D", "sum":"A;-D"});
    reportStructure.push({"id":"I", "type":"total", "description":"SOLDE TENASOSP = RTENA-E", "sum":"RTENA;-E"});
    reportStructure.push({"id":"J", "type":"total", "description":"SOLDES EXAMENS D'ETAT =(RE01+RHS+RSO) -(F)", "sum":"RE01;RHS;RSO;-F"});
    reportStructure.push({"id":"K", "type":"total", "description":"SOLDE DONS, LEGS, SUBV. ET AUTOFINANCEMENT = RDLSA-DDLSA", "sum":"RDLSA;-DDLSA"});
    reportStructure.push({"id":"L", "type":"total", "description":"SOLDE GENERAL = (C-G)", "sum":"C;-G"});


    return reportStructure;
}

//
function createReportStructureFinancialReportPrimaryPool() {
    var reportStructure = [];

    reportStructure.push({"id":"SI", "type":"group", "bclass":"4", "description":"Solde Initial"});
    reportStructure.push({"id":"RFF1", "type":"group", "bclass":"4", "description":"Frais d'appui à la supervision (Ecoles Primaires Privées)"});
    reportStructure.push({"id":"RFF2", "type":"group", "bclass":"4", "description":"Frais d'appui à la supervision (Ecoles Secondaires Publiques et Privées)"});
    reportStructure.push({"id":"RFF3", "type":"group", "bclass":"4", "description":"Frais Fonctionnement Trésor publique"});
    reportStructure.push({"id":"A", "type":"total", "description":"Total frais Fonctionnement (RFF1+RFF2+RFF3)", "sum":"RFF1;RFF2;RFF3"});
    reportStructure.push({"id":"RDLS", "type":"group", "bclass":"4", "description":" Dons, Legs et Subventions de PTF"});
    reportStructure.push({"id":"RAUT", "type":"group", "bclass":"4", "description":" Autofinancement"});
    reportStructure.push({"id":"RDLSA", "type":"total", "description":"RECETTES DONS,LEGS, SUBVENTIONS ET AUTOFINANCEMENT", "sum":"RDLS;RAUT"});
    reportStructure.push({"id":"B", "type":"total", "description":"TOTAL GENERAL RECETTES (SI+A+RDLSA)", "sum":"SI;A;RDLSA"});

    reportStructure.push({"id":"DFF1", "type":"group", "bclass":"3", "description":"Fournitures de bureau"});
    reportStructure.push({"id":"DFF2", "type":"group", "bclass":"3", "description":"Intrants informatiques"});
    reportStructure.push({"id":"DFF3", "type":"group", "bclass":"3", "description":"Forfait internet"});
    reportStructure.push({"id":"DFF4", "type":"group", "bclass":"3", "description":"Communication/Presse"});
    reportStructure.push({"id":"DFF5", "type":"group", "bclass":"3", "description":"Formule d'exploitation"});
    reportStructure.push({"id":"DFF6", "type":"group", "bclass":"3", "description":"Formation"});
    reportStructure.push({"id":"DFF7", "type":"group", "bclass":"3", "description":"Entretien et Réparation véhicule"});
    reportStructure.push({"id":"DFF8", "type":"group", "bclass":"3", "description":"Entretien et Réparation matériels et mobiliers"});
    reportStructure.push({"id":"DFF9", "type":"group", "bclass":"3", "description":"Acquisition matériels et mobiliers"});
    reportStructure.push({"id":"DFF10", "type":"group", "bclass":"3", "description":"Interventions sociales"});
    reportStructure.push({"id":"DFF11", "type":"group", "bclass":"3", "description":"Collation pour ordre de service"});
    reportStructure.push({"id":"DFF12", "type":"group", "bclass":"3", "description":"Cafetariat et rafraichissement "});
    reportStructure.push({"id":"DFF13", "type":"group", "bclass":"3", "description":"Rencontres locales"});
    reportStructure.push({"id":"DFF14", "type":"group", "bclass":"3", "description":"Constructions et aménagement des Batiments"});
    reportStructure.push({"id":"C", "type":"total", "description":"TOTAL DEPENSES F F (Somme de DFF1 à DFF14)", "sum":"DFF1;DFF2;DFF3;DFF4;DFF5;DFF6;DFF7;DFF8;DFF9;DFF10;DFF11;DFF12;DFF13;DFF14"});
    reportStructure.push({"id":"DDLS", "type":"group", "bclass":"3", "description":"Dépenses tirées sur dons, legs et subventions"});
    reportStructure.push({"id":"DAUT", "type":"group", "bclass":"3", "description":"Dépenses tirées sur Autofinancement"});
    reportStructure.push({"id":"DDLSA", "type":"total", "description":"DEPENSES SUR DONS, LEGS ET SUBVENTIONS ET AUTOFIN", "sum":"DDLS;DAUT"});
    reportStructure.push({"id":"D", "type":"total", "description":"TOTAL GENERAL DEPENSES = (C+DDLSA)", "sum":"C;DDLSA"});
    reportStructure.push({"id":"SFF", "type":"total", "description":"SOLDE FRAIS DE FONCTIONNEMENT = A-C", "sum":"A;-C"});
    reportStructure.push({"id":"SRDLSA", "type":"total", "description":"SOLDE DONS, LEGES ET AUTOFINACEMENT = RDLSA-DDLSA", "sum":"RDLSA;-DDLSA"});
    reportStructure.push({"id":"S", "type":"total", "description":"SOLDE GENERAL = B-D", "sum":"B;-D"});


    return reportStructure;
}

