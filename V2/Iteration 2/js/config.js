
var stopUrl = new URL(`https://teaching-api.juliengs.ca/gti525/STMStops.py?apikey=01AM30750`);
var arrivalUrl = new URL(`http://teaching-api.juliengs.ca/gti525/STMArrivals.py?apikey=01AM30750`);
var lineUrl = new URL(`http://teachings-api.juliengs.ca/gti525/STMLines.py?apikey=01AM30750`);
var busUrl = new URL(`https://teaching-api.juliengs.ca/gti525/STMPositions.py?apikey=01AM30750`);

  /************************************************
   * CONSTRUCT URL 
   * modifie l'url pour mettre les bons parametres
   ************************************************/
function constructURL(url, route, direction, stopCode) {
	var query_string = url.search;

	let search_params = new URLSearchParams(query_string);
	
	search_params.append('route', route);
	
	search_params.append('direction', direction);
	
	search_params.append('stopCode', stopCode);
	
	var finalURL;
	
	finalURL = url.origin + url.pathname + '?' + search_params.toString();
	
	return finalURL;
}
    