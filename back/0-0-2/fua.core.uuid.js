module.exports = (function (closure_args) {

    function Uuid(args, callback) {
        args = args || {};
        callback = callback || ((err, uuid) => {
            return uuid;
        });
        let
            _cache = [],
            _nb = "core.uuid",
            _path = "fua.core.uuid",
            _config = undefined, // !!!
            rid_i_ = 0,
            //
            properties_ = {},
            self_ = null
        ;

        //DEPRECIATED
        // //TODO: nach bigbang noch sichtbar...
        // // und überhaupt: warum gibt es keine Init(config). wie sonst auch!!!
        // properties_['config'] = {
        //     'enumeration': true,
        //     'configurable': true,
        //     'value': function (args, callback) {
        //         callback = callback || function (err, result) {
        //                 return result;
        //             };
        //         var
        //             result_ = {'s': true, 'scope': (_path + ".config"), 'report': []}
        //             ;
        //         if (_config === undefined) {
        //             _config = args;
        //             delete self_['config'];
        //         } else {
        //             result_['s'] = false;
        //             result_['m'] = "Config (" + _nb + ") is already set.";
        //         } // if ()
        //         return callback(null, result_)
        //     } // value
        // }; // properties['config']

        properties_['nb'] = {
            'enumeration': true,
            'value': "uuid"
        }; // properties['nb']

        properties_['get'] = {
            'enumeration': true,
            'value': (args) => {
                //
                // let
                //     result_
                //     ;

                if (_cache.length > 0) {
                    // result_ = _cache.shift();
                    return _cache.shift();
                } else {
                    return _uuid_get();
                } // if ()

                // return result_;
            } // value
        }; // properties['get']

        properties_['nid'] = {
            'enumeration': true,
            'value': (ns) => {

                //TODO: what the hell is default namespace?!?
                // now: '800' > general mandant namespace
                ns = (ns) ? ("ns=" + ns + ";s=") : "ns=800;s=";

                let
                    result_
                ;

                if (_cache.length > 0) {
                    result_ = ns + _cache.shift();
                } else {
                    result_ = ns + _uuid_get();
                } // if ()

                return result_;
            } // value
        }; // properties['nid']

        properties_['rid'] = {
            'enumeration': true,
            'value': (ns) => {
                return `ns=${(ns) ? ns : "77"};i=${rid_i_++}`;
            }
        };

        function _propagade_uuid_get() {
            return (u && u['agent'] && u['agent']['uuid'] && (typeof u['agent']['uuid']['get'] === 'function'))
                ?
                u['agent']['uuid']['get']
                :
                () => {
                    return (Math.random() + "-" + Math.random() + "-" + Math.random()).replace(/0./g, "");
                }
        } // _propagade_uuid_get

        let
            _uuid_get = _propagade_uuid_get()
        ;

        properties_['Init'] = {
            'enumeration': true,
            'configurable': true,
            'writable': false,
            'value': (config, callback) => {
                callback = callback || ((err, result) => {
                    return result;
                });
                let
                    result_ = {'s': true, 'report': []}
                ;
                if (_config === undefined) {
                    _config = config;
                    _uuid_get = _propagade_uuid_get();
                    delete self_['Init'];
                } else {
                    result_['s'] = false;
                    result_['m'] = "Config (" + _nb + ") is already set.";
                    return callback(null, result_)
                } // if ()
            } // value
        }; // properties['Init']

        self_ = Object.create(null, properties_);

        return callback(null, self_);

    } // Uuid

    try {
        if (u['core']['value']) {
            u['core']['value']['uuid'] = Uuid({}, undefined);
        } else {
            u['core']['uuid'] = Uuid({}, undefined);
        } // try
        return;
    } catch (jex) {
        return Uuid({}, undefined);
    } // try

}({})); // closure UUID