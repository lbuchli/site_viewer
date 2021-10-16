export function idGET(url) {
    const urlParams = new URLSearchParams(url);
    return urlParams.get('id');
}

export function getSite(siteId) {
    let url = "/api/site/" + siteId
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false); // false for synchronous request
    return xmlHttp.responseText;
}

export function postSite(pos, model) {
    let url = "/api/site/"
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", url, false); // false for synchronous request
    xmlHttp.send({'qr_relative': pos, 'model': model});
    return xmlHttp.responseText;
}
