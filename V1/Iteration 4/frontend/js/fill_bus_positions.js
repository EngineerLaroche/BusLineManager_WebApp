/********************************************
 * FETCH BUS POSITIONS (API)
 *
 * Fonction qui permet de recuperer les positions
 * de bus de l'API avec un 'parser' JSON
 * selon la ligne et la direction choisi par l'utilisateur,
 * on appel l'API pour récupérer la position
 * des bus.
 *
 ********************************************/
function fetchBusPositions(line, direction, cancellationToken) {
  const url = `http://localhost:8000/bus_positions?line=${line}&direction=${direction}`;
  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();
    cancellationToken.cancel = function() {
      xhr.abort();
    };
    xhr.open("GET", url);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };
    xhr.timeout = defaultTimeout;
    xhr.ontimeout = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    }
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };
    xhr.send();
  });
}
