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


/* Update: 2020-10-23 */


var ID_ERR_VERSION = "ID_ERR_VERSIONE";
var ID_ERR_LICENCE_ADVANCED = "ID_ERR_LICENZA_ADVANCED";
var ID_ERR_LICENCE_PROFESSIONAL = "ID_ERR_LICENZA_PROFESSIONAL";
var ID_ERR_GRUPPO_MANCANTE = "ID_ERR_GRUPPO_MANCANTE";
var ID_ERR_GROUP_ERROR = "ID_ERR_GRUPPO_ERRATO";

/**
 * return the text error message according to error id
 */
function getErrorMessage(errorId, column, value) {
    switch (errorId) {
        case ID_ERR_VERSION:
            if (BAN_EXPM_VERSION) {
                return "L'extension nécessite au minimum la version Banana Comptabilité Plus " + BAN_VERSION + "." + BAN_EXPM_VERSION;
            }
            else {
                return "L'extension nécessite au minimum la version Banana Comptabilité Plus " + BAN_VERSION;
            }
        case ID_ERR_GROUP_ERROR:
            //grColumn, riga, valore
            return "colonne <" + column + ">, valeur <"+ value +"> Code de groupe saisi incorrect. Modifier le code de groupe dans le tableau Comptes.";
    
        case ID_ERR_LICENCE_ADVANCED:
            return "L'extension nécessite le plan avancé.";

        case ID_ERR_LICENCE_PROFESSIONAL:
            return "L'extension nécessite le plan Professionnel.";
    }
    return "";
}