
function fillStopInfo(lineNumber, directionLetter) {
  var normalizedDirectionLetter;
  if(directionLetter.toLowerCase() === "sud") {
    normalizedDirectionLetter = "S";
  }
  if(directionLetter.toLowerCase() === "nord") {
    normalizedDirectionLetter = "N";
  }
  if(directionLetter.toLowerCase() === "est") {
    normalizedDirectionLetter = "E";
  }
  if(directionLetter.toLowerCase() === "ouest") {
    normalizedDirectionLetter = "W";
  }
  console.log("fillStop started!" + "lineNumber: " + lineNumber + " direction letter: " + normalizedDirectionLetter)
  var stopId = lineNumber + "-" + normalizedDirectionLetter
  //stopId = 10-N
  var stopsInfo = stops[stopId];

  const table = document.getElementById("arrets");

  const oldBody = table.getElementsByTagName("tbody")[0];
  const newBody = document.createElement("tbody");
  for (const stop of stopsInfo) {
    if (stop.accessible) {
      var newStopElement = document.createElement("tr");

      const stopNameTd = document.createElement("td");
      stopNameTd.className = "text-left";
      stopNameTd.textContent = stop.name;

      const stopIdTd = document.createElement("td");
      stopIdTd.className = "text-left";
      stopIdTd.textContent = stop.id;

      const stopLinkTd = document.createElement("td");
      stopLinkTd.className = "text-left";
      const stopLink = document.createElement("button");
      stopLink.textContent = "Prochains passages";
      stopLink.onclick = function () {
        const stopName = stop.name;
        const stopLineNumberDirection = stopId.split('-');
        const lineNumber = stopLineNumberDirection[0];
        const directionLetter = stopLineNumberDirection[1];
        const stopCode = stop.id;
        updateArrivalsInterval(stopName, lineNumber, directionLetter, stopCode);
        document.getElementById("arrivals").scrollIntoView();
      };
      stopLinkTd.appendChild(stopLink);

      const stopFavoriteTd = document.createElement("td");
      stopFavoriteTd.className = "text-left";
      stopFavoriteTd.textContent = "+";

      newStopElement.appendChild(stopNameTd);
      newStopElement.appendChild(stopIdTd);
      newStopElement.appendChild(stopLinkTd);
      newStopElement.appendChild(stopFavoriteTd);

      newBody.appendChild(newStopElement);
    }
  }

  table.removeChild(oldBody);
  table.appendChild(newBody);
}


