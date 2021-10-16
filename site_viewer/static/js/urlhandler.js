const endpoint = "xdxd"

function getModels (url) {
    const siteId = getParams(url);
    const out = JSON.parse(httpGet(siteId));
    const title = out.title;
    const qrReference = ou

}

function getParams (url) {
    const urlParams = new URLSearchParams(url);
    return urlParams.get('id');
}

function httpGet(siteId)
{
    let constUrl = endpoint + "api/site/" + siteId
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
