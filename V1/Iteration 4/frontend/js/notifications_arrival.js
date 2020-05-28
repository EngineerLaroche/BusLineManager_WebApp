const minutesLeftForNotification = 5;
const refreshRate = 60 * 2 * 1000;

setInterval(function() {
  if (Object.keys(arretsFavoris).length !== 0) {
    for (var key in arretsFavoris) {
      const stopName = arretsFavoris[key][0];
      const line = arretsFavoris[key][2];
      const direction = arretsFavoris[key][3];
      const stopCode = arretsFavoris[key][4];

      getArrivals(line, direction, stopCode)
        .then(nextArrivals => {
          const hasImminentArrival = nextArrivals.some(arrival => {
            if (arrival < minutesLeftForNotification && arrival >= 0) {
              return true;
            } else {
              const currentDay = new Date();
              const currentTime = parseInt(
                "" + currentDay.getHours() + currentDay.getMinutes(),
              );
              if (
                arrival - currentTime < minutesLeftForNotification &&
                arrival - currentTime >= 0
              ) {
                return true;
              }
            }
          });

          if (hasImminentArrival) {
            const lineName = document.getElementById("info-ligne").innerText;
            validSnackbar(`${lineName} (${stopName}): arrivée imminente`);
          }
        })
        .catch(err => console.log(err));
    }
  }
}, refreshRate);
