const SERVER_LOGGING = true;

function log(str) {
    if(SERVER_LOGGING) { console.log(str) }
}

module.exports = {
    log: log
}
