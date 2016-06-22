# Swagmock examples

Swagger api : http://petstore.swagger.io/v2/swagger.json

Mock examples are based on the above swagger api.

## Responses

#### Response mock for the path `/pet/findByStatus`, operation `get` and response `200`.

```javascript
    var apiPath = 'http://petstore.swagger.io/v2/swagger.json';
    var Swagmock = require('swagmock');
    var mockgen = Swagmock(apiPath);

    mockgen.responses({
        path: '/pet/findByStatus',
        operation: 'get',
        response: 200
    }, function (error, mock) {
        console.log(mock);    
    });
```
##### Mock sample

```json
    {
        "responses": [{
            "id": 2530624032210944,
            "category": {
                "id": 8200505595527168,
                "name": "r($vA&"
            },
            "name": "doggie",
            "photoUrls": ["p0x1", "6O)3*kO"],
            "tags": [{
                "id": 4590764340281344,
                "name": "WCTA6f!"
            }, {
                "id": -4614156653166592,
                "name": "e"
            }],
            "status": "pending"
        }]
    }
```

#### Response mock for the path `/store/order/{orderId}`, get operation and all responses.

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.responses({
        path: '/store/order/{orderId}',
        operation: 'get'
    }, function (error, mock) {
        console.log(mock);
    });
```

##### Mock sample

```json
    {
        "responses": {
            "200": {
                "id": -7088927374573568,
                "petId": 523442679971840,
                "quantity": 7553732795432960,
                "shipDate": "2016-06-20T17:32:42.972Z",
                "status": "delivered",
                "complete": true
            },
            "400": undefined,
            "404": undefined
        }
    }

```
#### Response mock for the path `/store/order/{orderId}` and all operations and all responses.

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.responses({
        path: '/store/order/{orderId}'
    }, function (error, mock) {
        console.log(mock);
    });
```

##### Mock sample

```json

    {
        "get": {
            "responses": {
                "200": {
                    "id": 5961222251872256,
                    "petId": -8384707100147712,
                    "quantity": 4460020649426944,
                    "shipDate": "2016-06-20T17:41:19.804Z",
                    "status": "placed",
                    "complete": false
                },
                "400": undefined,
                "404": undefined
            }
        },
        "delete": {
            "responses": {
                "400": undefined,
                "404": undefined
            }
        }
    }

```

#### Response mock for all the paths.

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.responses({}, function (error, mock) {
        console.log(mock);
    });
```
## Parameters

#### Parameter mock for the path `/pet/findByStatus` and operation `get`.

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.parameters({
        path: '/pet/findByStatus',
        operation: 'get'
    }, function (error, mock) {
        console.log(mock);    
    });
```
##### Mock sample

```json
    {
        "parameters": {
            "query": [{
                "name": "status",
                "value": [ "available", "pending" ],
                "separator": "multi"
            }]
        }
    }
```

#### Parameter mock for the path `/store/order/{orderId}` and all operations.

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.parameters({
        path: '/store/order/{orderId}'
    }, function (error, mock) {
        console.log(mock);
    });
```

##### Mock sample

```json

    {
        "get": {
            "parameters": {
                "path": [{
                    "name": "orderId",
                    "value": 9
                }]
            }
        },
        "delete": {
            "parameters": {
                "path": [{
                    "name": "orderId",
                    "value": 8573207911071745
                }]
            }
        }
    }

```
#### Parameter mock for all the paths.

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.parameters({}, function (error, mock) {
        console.log(mock);
    });
```

## Responses and Parameters

#### For the path `/store/order/{orderId}`

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.mock({
        path: '/store/order/{orderId}',
        mockResponses: true,
        mockParams: true
    }, function (error, mock) {
        console.log(mock);
    });
```

#### For the path `/store/order/{orderId}` and operation `get`

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.mock({
        path: '/store/order/{orderId}',
        operation: 'get',
        mockResponses: true,
        mockParams: true
    }, function (error, mock) {
        console.log(mock);
    });
```

#### For all the path

```javascript
    var mockgen = Swagmock(apiPath);

    mockgen.mock({
        mockResponses: true,
        mockParams: true
    }, function (error, mock) {
        console.log(mock);
    });
```
