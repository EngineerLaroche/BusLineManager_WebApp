var arrivalsInterval;

function updateArrivalsInterval(stopName, lineNumber, directionLetter, stopId) {
    function getTenNextArrivals() {
        const stopKey = Object.keys(arrivals).find(key => {
            const keySplitted = key.split('-');
    
            return keySplitted[0] == lineNumber && keySplitted[1] == directionLetter && keySplitted[2] == stopId;
        });
    
        const currentTime = getFormattedCurrentTime();
        const sortedArrivals = arrivals[stopKey].sort(function(arrival1, arrival2) {
            return arrival1 - arrival2;
        });
    
        var startIndex = sortedArrivals.findIndex(arrival => {
            return arrival > currentTime
        });
        if (startIndex == -1) { // Aucun index de passage trouvé, car il est trop tard
            startIndex = 0;
        }
        const endIndex = startIndex + 10;
        const extra = sortedArrivals.length - endIndex;

        if (extra < 0) {
            return sortedArrivals.slice(startIndex, sortedArrivals.length)
                .concat(sortedArrivals.slice(0, Math.min(Math.abs(extra), startIndex)));
        } else {
            return sortedArrivals.slice(startIndex, endIndex);
        }
    }

    function getFormattedCurrentTime() {
        const currentDate = new Date();
        var currentHours = currentDate.getHours();
        var currentMinutes = currentDate.getMinutes();
        const formatTimeValue = value => {
            return ("0" + value).slice(-2);
        }
    
        return formatTimeValue(currentHours) + formatTimeValue(currentMinutes)
    }

    function removeChildren(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function showTenNextArrivals() {
        const arrivalsTable = document.getElementById("arrivals");
        const arrivalsTableBody = arrivalsTable.getElementsByTagName("tbody")[0];
    
        function setNoArrivalErrorVisibility(visible) {
            const errorNode = document.getElementById("arrivals-empty-error");
            
            errorNode.style.display = visible ? "block" : "none";
            arrivalsTable.style.display = visible ? "none" : "table";
        }
    
        const tenNextArrivals = getTenNextArrivals();
        
        if (tenNextArrivals.length > 0) {
            setNoArrivalErrorVisibility(false);
    
            document.getElementById("arrival-stop-name").innerHTML = stopName;
    
            removeChildren(arrivalsTableBody);
            tenNextArrivals.forEach(arrival => {
                const td = document.createElement("td");
                const tr = document.createElement("tr");

                td.textContent = arrival[0] + arrival[1] + " h " + arrival[2] + arrival[3];
                tr.appendChild(td);
                arrivalsTableBody.appendChild(tr);
            });
        } else {
            setNoArrivalErrorVisibility(true);
        }
    }

    if (arrivalsInterval != null) {
        clearInterval(arrivalsInterval);
    }

    showTenNextArrivals();
    arrivalsInterval = setInterval(function() {
        showTenNextArrivals();
    }, 5000);
}