module.exports = function () {
    try {
        const
            crypto$1          = typeof require !== "undefined" && require('crypto'),
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
                } // switch
                return result_;
            } // UUIDGeneratorNode
        ; // const

        //if (u['core']['value']) {
        //    u['core']['value']['uuid'] = UUIDGeneratorNode;
        //} else {
        //    u['core']['uuid'] = UUIDGeneratorNode;
        //} // if ()

        return {
            'utype': "core",
            'name':  "uuid",
            'uuid':  UUIDGeneratorNode
        };

    } catch (jex) {
        //return UUIDGeneratorNode;
        throw jex;
    } // try
};