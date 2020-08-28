module.exports = ({'mode': mode = "local", 'parameter': parameter = {}}) => {
    try {
        let UUIDGeneratorNode;
        switch (mode) {
            //case "proxy":
            //    break;
            case "local":
            default:
                const
                    //TODO: require eleminieren, sollte als parameter übergeben werden...
                    crypto$1      = parameter['crypto'] || (typeof require !== "undefined" && require('crypto'))
                ; // const
                UUIDGeneratorNode = (args = {'type': "default", 'prefix': ""}) => {
                    let
                        result_
                    ;
                    args = args || {'type': "default"};

                    switch (args['type']) {
                        case "scramble":
                            args['length'] = args['length'] || 8;
                            break; // scramble
                        default:
                            result_ = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ (crypto$1.randomBytes(1)[0] & (15 >> (c / 4)))).toString(16));
                            break; // default
                    } // switch (args['type'])
                    return result_;
                }; // UUIDGeneratorNode
                break; // default, local
        } // switch (mode)

        return UUIDGeneratorNode;

    } catch (jex) {
        //return UUIDGeneratorNode;
        throw jex;
    } // try

} // module.exports