
/********************************************
 * FORMAT TIME VALUE TWO DIGITS
 * 
 * Fonction qui formatte la valeur de temps
 * (heure ou minute) en s'assurant que la
 * valeur retournée contient au moins deux
 * chiffres. Si la valeur du paramètre
 * effectif contint un seul chiffre, un
 * zéro est inséré au début.
 * 
 ********************************************/
function formatTimeValueTwoDigits(timeValue) {
    return ("0" + timeValue).slice(-2);
}

/********************************************
 * GET CURRENT DATE WITH ADDED MINUTES
 * 
 * Fonction qui retourne la temps courant en y
 * ajoutant le nombre de minute spécifié, et ce
 * sous le format « hhmm »
 * 
 ********************************************/
function getCurrentDateWithAddedMinutes(minutesToAdd) {
    const now = new Date();
    const nbMsInOneMin = 60000;
    const nowWithMinutesBeforeArrival = new Date(now.getTime() + minutesToAdd * nbMsInOneMin);
    const hours = nowWithMinutesBeforeArrival.getHours();
    const minutes = nowWithMinutesBeforeArrival.getMinutes();

    return formatTimeValueTwoDigits(hours) + formatTimeValueTwoDigits(minutes);
}

/********************************************
 * Constructeur de Arrival
 ********************************************/
function Arrival(rawValue) {
    this.rawValue = rawValue,
        this.isRealTime = function () {
            return rawValue.length != 4;
        },
        this.hhmmFormattedValue = "";
    this.displayValue = function () {
        return this.hhmmFormattedValue[0] + this.hhmmFormattedValue[1] + " h " +
            this.hhmmFormattedValue[2] + this.hhmmFormattedValue[3]
    }
}

// Définition d'une propriété « hhmmFormattedValue »
Object.defineProperty(Arrival.prototype, "hhmmFormattedValue", {
    get: function () {
        var formattedValue;

        if (this.isRealTime()) {
            const minutesBeforeArrival = this.rawValue;
            formattedValue = getCurrentDateWithAddedMinutes(minutesBeforeArrival);
        } else {
            formattedValue = this.rawValue;
        }
        return formattedValue;
    }
});