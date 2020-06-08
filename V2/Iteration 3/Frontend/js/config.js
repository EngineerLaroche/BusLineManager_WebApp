
var stopUrl = new URL(`http://localhost:8000/stops`);
var arrivalUrl = new URL(`http://localhost:8000/arrivals`);
var lineUrl = new URL(`http://localhost:8000/lines`);
var busUrl = new URL(`http://localhost:8000/busPosition`);
var usrerUrl = new URL('http://localhost:8000/users')

  /************************************************
   * CONSTRUCT URL 
   * modifie l'url pour mettre les bons parametres
   ************************************************/
function constructURL(url, route, direction, stopCode, apiKey) {
	var query_string = url.search;

	let search_params = new URLSearchParams(query_string);
	
	search_params.append('line', route);
	
	search_params.append('direction', direction);
	
	search_params.append('stopCode', stopCode);

	search_params.append('userId', apiKey);
	
	var finalURL;
	
	finalURL = url.origin + url.pathname + '?' + search_params.toString();
	
	return finalURL;
}
    