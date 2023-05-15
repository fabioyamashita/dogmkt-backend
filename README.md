# DOGMKT - Back-end

This is the back-end of DOGMKT built with node.js.

## Docker

```
$ docker-compose --env-file config-example.env up -d 
```

## Local Tests

```
// For detailed errors
$ npm run start:dev

// For production errors
$ npm run start:prod
```

To test the endpoints, after starting the node server, access the swagger at: http://localhost:3000/api-docs
