# sails-hook-restful-promise
Sails JS hook to communicate with RESTful APIs (HTTP/HTTPS) and returns a Promise.

All this **without even a single external dependency**

## Usage

````
sails.hooks.restful
            .send(options)
            .then(function (response) {
                console.log("response", response);
            })
            .catch(function (err) {
                console.error(err);
            });
````
Where `options` is an `Object`, which can have the following keys (all optional):
* **`protocol`**: (`String`) `http` or `https` (Default is `http`)
* **`host`**: (`String`) The API endpoint (Default is `localhost`)
* **`port`**: (`Number`) The API port (Default is `80` for `http` and `443` for `https`)
* **`path`**: (`String`) The API Path (Default is empty path)
* **`body`**: (`String`) The API request body (if any) (Default is empty body)
* **`qs`**: (`Object`) The Query String in key value notation. e.g.: `{q:'foo',s='bar'}` means `?q=foo&s=bar`
* **`method`**: (`String`) The HTTP Method (Defaults to `GET`)
* **`headers`**: (`Object`) Any custom HTTP Headers to send in key value notation. e.g.: `{'Content-Type': 'application/json'}`
* **`timeout`**: (`Number`) The HTTP API call timeout in milliseconds (Defaults to `0`, which means no timeout)
* **`returnHeaders`**: (`Boolean`) Weather to return HTTP Headers as received from the API Response. Default is `false`

