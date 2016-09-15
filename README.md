# swagmock
Mock data generator for swagger api

## Install

```
npm install swagmock
```

## Usage

```javascript
    let Swagmock = require('swagmock');
    let Mockgen = Swagmock(api, options);
    // api Can be one of the following.
    // 1) A relative or absolute path to the Swagger api document.
    // 2) A swagger api Object.
    // 3) A promise (or a `thenable`) that resolves to the swagger api Object.
    // If the api Object is already validated and dereferenced ($ref are resolved ),
    // set the validated : true is options.

    //Promise response
    let responseMock = Mockgen.responses({}); //returns a promise that resolves to response mock
    responseMock.then(mock => {
        //Use mock here
    }).catch(error => {
        assert.ifError(error);
    });

    //Callback style
    Mockgen.responses({ path: '/somepath'}, (error, mock) => {
        assert.ifError(error);
        //Use mock here
    });
```

Check the [API](README.md#api) for more details.

## Example

```javascript
    const apiPath = 'http://petstore.swagger.io/v2/swagger.json';
    let Swagmock = require('swagmock');
    let Mockgen = Swagmock(apiPath);
    let Assert = require('assert');

    mockgen.responses({
        path: '/pet/findByStatus',
        operation: 'get',
        response: 200
    }).then(mock => {
        console.log(mock); // This would print:
        // {
        //     "responses": [{
        //         "id": 2530624032210944,
        //         "category": {
        //             "id": 8200505595527168,
        //             "name": "r($vA&"
        //         },
        //         "name": "doggie",
        //         "photoUrls": ["p0x1", "6O)3*kO"],
        //         "tags": [{
        //             "id": 4590764340281344,
        //             "name": "WCTA6f!"
        //         }, {
        //             "id": -4614156653166592,
        //             "name": "e"
        //         }],
        //         "status": "pending"
        //     }]
        // }
    }).catch(error => {
        assert.ifError(error);
    });
```

```javascript

    mockgen.parameters({
        path: '/pet/findByStatus',
        operation: 'get'
    }).then(mock => {
        console.log(mock);//This would print:
        // {
        //     "parameters": {
        //         "query": [{
        //             "name": "status",
        //             "value": [ 'available', 'pending' ],
        //             "separator": "multi"
        //         }]
        //     }
        // }
    }).catch(error => {
        assert.ifError(error);
    })

```

Check [Examples](docs/EXAMPLES.md) for more details on mock generators.

## API

`Swagmock(api, [options])`

* `api` - (*Object*) or (*String*) or (*Promise*) - (required) - api can be one of the following.
    - A relative or absolute path to the Swagger api document.
    - A URL of the Swagger api document.
    - The swagger api Object
    - A promise (or a `thenable`) that resolves to the swagger api Object

* `options` - (*Object*) - (optional) - Additional options to create the mock generator.
    - `validated` -  Set this property to `true` if the api is already validated against swagger schema and already dereferenced all the `$ref`. This is really useful to generate mocks for parsed api specs. Default value for this is `false` and the api will be validated using [swagger-parser validate](https://github.com/BigstickCarpet/swagger-parser/blob/master/docs/swagger-parser.md#validateapi-options-callback).

## responses

`mockgen.responses(options, [callback])`

This generates the mock response objects based on the `options`

* `options` - (*Object*) - (required) - Options to control the mock generation.

* `callback` -  (*Function*) - (optional) - `function (error, mock)`. If a callback is not provided a `Promise` will be returned.

### options

* `path` - (*String*) - (optional) - The path for which the response mock need to be generated. For example `/pet/findByStatus`, `/pet` etc. If a `path` is not specified, mock response will be generated for all the paths defined by the swagger api.

* `operation` - (*String*) - (optional) - The operation for which the response mock need to be generated. For example `get`, `post` etc. If `operation` is not specified, mock response will be generated for all the operations defined by the swagger api.

* `response` - (*String*) - (optional) - The response for which the response mock need to be generated. For example `200`, `400`, `default` etc. If `response` is not specified, mock response will be generated for all the responses defined by the swagger api.

## parameters

`mockgen.parameters(options, [callback])`

This generates the mock parameters objects based on the `options`

* `options` - (*Object*) - (required) - Options to control the mock generation.

* `callback` -  (*Function*) - (optional) - `function (error, mock)`. If a callback is not provided a `Promise` will be returned.

### options

* `path` - (*String*) - (optional) - The path for which the parameters mock need to be generated. For example `/pet/findByStatus`, `/pet` etc. If a `path` is not specified, mock parameters will be generated for all the paths defined by the swagger api.

* `operation` - (*String*) - (optional) - The operation for which the parameters mock need to be generated. For example `get`, `post` etc. If `operation` is not specified, mock parameters will be generated for all the operations defined by the swagger api.


## requests

`mockgen.requests(options, [callback])`

This generates the mock request object based on the `options`. `requests` API resolves the `parameters` mock data to generate the `request` mock object useful for unit tests.

* `options` - (*Object*) - (required) - Options to control the mock generation.

* `callback` -  (*Function*) - (optional) - `function (error, mock)`. If a callback is not provided a `Promise` will be returned.

### options

* `path` - (*String*) - (optional) - The path for which the parameters mock need to be generated. For example `/pet/findByStatus`, `/pet` etc. If a `path` is not specified, mock parameters will be generated for all the paths defined by the swagger api.

* `operation` - (*String*) - (optional) - The operation for which the parameters mock need to be generated. For example `get`, `post` etc. If `operation` is not specified, mock parameters will be generated for all the operations defined by the swagger api.

### data

`request` Object will have following possible properties `query`, `header`, `pathname`, `path`, `formData` or `body` based on the `parameters` defined for the path and operation.

Mock request [Path templates](http://swagger.io/specification/#pathTemplating) are resolved using path parameters.

```javascript
    mockgen.requests({
        path: '/pet/findByStatus',
        operation: 'get'
    }, function (error, mock) {
        assert.ifError(error);

        console.log(mock);
        //This would print:
        // {
        //     "request": {
        //         "query": "status=available&status=pending"
        //     }
        // }
    });
```
## Examples

### API
[Usage](docs/EXAMPLES.md)

### Unit test request mocks

[github api express app](https://github.com/subeeshcbabu/swaggerize-examples/tree/master/express/github-express/tests)

[slack api hapi app](https://github.com/subeeshcbabu/swaggerize-examples/tree/master/hapi/slack/tests)

### Mock response data providers

[spotify api hapi app](https://github.com/subeeshcbabu/swaggerize-examples/tree/master/hapi/spotify/data)

[glugbot api express app](https://github.com/subeeshcbabu/swaggerize-examples/tree/master/express/glugbot-express/tests/api)
