/********************************************
 * REFRESH HANDLER
 * 
 ********************************************/
function refreshHandler() {
    if (window.performance)
        console.info("window.performance works fine on this browser");
    if (performance.navigation.type == 1) {
        console.info( "This page is reloaded" );
        sessionStorage.clear(); // Clear cache when page is refreshed
    } else {
        console.info( "This page is not reloaded");
    }
}