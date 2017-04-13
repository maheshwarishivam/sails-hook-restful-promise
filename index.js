module.exports = function RESTful(sails) {

    return {

        defaults: {
            __configKey__: {
                protocol: 'http',
                hostname: 'localhost',
                portHTTP: 80,
                portHTTPS: 443,
                path: '',
                body: '',
                qs: {},
                method: 'GET',
                headers: {},
                timeout: 0, //If positive, in milliseconds. 0 means don't set timeout
                returnHeaders: false
            }
        },


        /**
         * Sends a HTTP(s) Request and returns a promise
         *
         * @param options (Object)
         *      {
         *          `protocol`: (`String`) `http` or `https` (Default is `http`)
         *          `host`: (`String`) The API endpoint (Default is `localhost`)
         *          `port`: (`Number`) The API port (Default is `80` for `http` and `443` for `https`)
         *          `path`: (`String`) The API Path (Default is empty path)
         *          `body`: (`String`) The API request body (if any) (Default is empty body)
         *          `qs`: (`Object`) The Query String in key value notation. e.g.: `{q:'foo',s='bar'}` means `?q=foo&s=bar`
         *          `method`: (`String`) The HTTP Method (Defaults to `GET`)
         *          `headers`: (`Object`) Any custom HTTP Headers to send in key value notation. e.g.: `{'Content-Type': 'application/json'}`
         *          `timeout`: (`Number`) The HTTP API call timeout in milliseconds (Defaults to `0`, which means no timeout)
         *          `returnHeaders`: (`Boolean`) Weather to return HTTP Headers as received from the API Response. Default is `false`
         *      }
         */
        send: function (options) {
            //Clone Options. Node: This will only work if options can be JOSNified (which will always be the case here)
            var opt = options instanceof Object ? options : {};
            opt = JSON.parse(JSON.stringify(opt));

            var timeout = sails.config[this.configKey].timeout;
            var protocol = sails.config[this.configKey].protocol;
            var qs = sails.config[this.configKey].qs;
            var returnHeaders = sails.config[this.configKey].returnHeaders;


            if (opt.protocol && (opt.protocol == 'http' || opt.protocol == 'https')) protocol = opt.protocol;
            if (opt.timeout) timeout = opt.timeout;
            if (opt.qs) qs = opt.qs;
            if (opt.returnHeaders) returnHeaders = opt.returnHeaders;

            delete opt.protocol;
            delete opt.timeout;
            delete opt.qs;

            if (!opt.hostname) opt['hostname'] = sails.config[this.configKey].hostname;
            if (!opt.port) opt['port'] = protocol == 'http' ? sails.config[this.configKey].portHTTP : sails.config[this.configKey].portHTTPS;
            if (!opt.path) opt['path'] = sails.config[this.configKey].path;
            if (!opt.body) opt['body'] = sails.config[this.configKey].body;
            if (!opt.method) opt['method'] = sails.config[this.configKey].method;
            if (!opt.headers) opt['headers'] = sails.config[this.configKey].headers;

            //TODO: Parse Query String
            var queryString = '';
            for (var key in qs) {
                queryString += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(qs[key]).replace(/'/g, '%27');
            }

            if (queryString) opt.path += ('?' + queryString.substr(1));

            // return new pending promise
            return new Promise((resolve, reject) => {
                // select http or https module, depending on the request protocol
                const lib = require(protocol);

                const request = lib.request(opt, (response) => {

                    // handle http errors
                    // if (response.statusCode < 200 || response.statusCode > 299) {
                    //     reject(new Error('Failed to load page, status code: ' + response.statusCode));
                    // }
                    // temporary data holder
                    const body = [];
                    // on every content chunk, push it to the data array
                    response.on('data', (chunk) => body.push(chunk));
                    // we are done, resolve promise with those joined chunks
                    response.on('end', () => {
                        var retValue = {
                            body: body.join('')
                        };
                        if (returnHeaders) retValue['headers'] = response.headers;
                        resolve(retValue);
                    });
                });

                // Set request body (if required)
                if (opt.body) request.write(opt.body);

                //Set Request Timeout
                if (timeout > 0) {
                    request.setTimeout(timeout, function () {
                        request.abort();
                        reject(new Error('API Timeout within ' + timeout + ' ms: '
                            + opt.method + ' '
                            + protocol + '://'
                            + opt.hostname
                            + (protocol == 'http' && opt.port != 80 ? ':' + opt.port : (protocol == 'https' && opt.port != 443 ? ':' + opt.port : ''))
                            + (opt.path ? '/' + opt.path : '')
                        ));
                    });
                }

                // handle connection errors of the request
                request.on('error', (err) => reject(err));

                request.end();
            });

        }

    };
};
