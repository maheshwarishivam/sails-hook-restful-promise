# sails-hook-restful-promise
Sails JS hook to communicate with RESTful APIs (HTTP/HTTPS) and returns a Promise.

All this **without even a single external dependency**

## Installation

````
npm install --save sails-hook-restful-promise
````

## Usage

````
sails.hooks.RESTful
            .send(options)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (err) {
                console.error(err);
            });
````
Where `options` is an `Object`, which can have the following keys (all optional):
* **`protocol`**: (`String`) `http` or `https` (Default is `http`)
* **`hostname`**: (`String`) The API endpoint (Default is `localhost`)
* **`port`**: (`Number`) The API port (Default is `80` for `http` and `443` for `https`)
* **`path`**: (`String`) The API Path (Default is empty path)
* **`body`**: (`String`) The API request body (if any) (Default is empty body)
* **`qs`**: (`Object`) The Query String in key value notation. e.g.: `{q:'foo',s='bar'}` means `?q=foo&s=bar`
* **`method`**: (`String`) The HTTP Method (Defaults to `GET`)
* **`headers`**: (`Object`) Any custom HTTP Headers to send in key value notation. e.g.: `{'Content-Type': 'application/json'}`
* **`timeout`**: (`Number`) The HTTP API call timeout in milliseconds (Defaults to `0`, which means no timeout)
* **`returnHeaders`**: (`Boolean`) Weather to return HTTP Headers as received from the API Response. Default is `false`

## Response format

If the API call is successful (no matter what the HTTP Status or the response is), the promise resolves with the response object in the following format:

````
{
    status: 200,
    body: 'The exact body returned by the API Response in String format'
    headers: {
        //Key: 'Value' pairs of all headers retirned by the server.
    }
}
````

**Note:** `headers` is only available when `returnHeaders` is set to true in `request.options`.

## Defining Defaults
Following `options` can be defined as defaults from the `sails.config`. Just add a `config/restful.js` file in your `sails` installation with following content:

````
module.exports.RESTful = {
    protocol: 'http', // Only 'http' or 'https' allowed here
    hostname: 'localhost',
    portHTTP: 80,
    portHTTPS: 443,
    headers: {}, //Any custom HTTP Headers to send in key value notation. e.g.: {'Content-Type': 'application/json'}
    timeout: 0, //If positive, in milliseconds. 0 means don't set timeout
    returnHeaders: false //Weather to return HTTP Headers as received from the API Response
}
````
