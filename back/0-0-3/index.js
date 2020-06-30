module.exports = function ({mode, parameter}) {
    switch(mode) {
        //case "proxy":
        //    break;
        case "local":
        default:
            return require(`./local/fua.core.uuid.local.js`)(parameter);
            break; // default, local
    } // switch
};

//module.exports = function (args) {
//    global['u'].core = global['u'].core || {'value': {}};
//    switch(args['mode']) {
//        //case "proxy":
//        //    break;
//        case "local":
//        default:
//            require(`./local/fua.core.uuid.local.js`);
//            break;
//    } // switch
//}; //