# DOGMKT - Back-end

This is the back-end of DOGMKT built with node.js.

## Documentation

You can find all the documentation of my insights and solutions to the challenges I faced during this project [here](https://github.com/fabioyamashita/dogmkt-backend/wiki).

## Docker

```
$ docker-compose --env-file config-example.env up -d 
```

## Run the App

```
// For detailed errors
$ npm run start:dev

// For production errors
$ npm run start:prod
```

## Run tests

```
// Run tests
$ npm test

// Run tests with coverage analysis
$ npm test -- --coverage
```

To test the endpoints, after starting the node server, access the swagger at: http://localhost:3000/api-docs
