const minutesLeftForNotification = 5;
const refreshRate = 60* 2 * 1000;

setInterval(function() {
  console.log("here yesgsgsg");
  console.log(favorisStops);
  if (Object.keys(favorisStops).length !== 0) {
    for (var key in favorisStops) {
      const stopName = favorisStops[key][0];
      const line = favorisStops[key][2];
      const direction = favorisStops[key][3];
      const stopCode = favorisStops[key][1];
		console.log("test2");
		console.log(stopCode);
      arrivals.requestStops(line, direction, stopCode)
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
            errorMesage(`autobus ${line} pour arrêt ${stopCode} direction ${direction} (${stopName}): arrivée imminente`);
            console.log("here");
          }
        })
        .catch(err => console.log(err));
    }
  }
}, refreshRate);
