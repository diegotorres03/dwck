

[AppSync for browser](https://docs.aws.amazon.com/appsync/latest/devguide/building-a-client-app.html)
[code reference](https://docs.amplify.aws/gen1/react/build-a-backend/graphqlapi/connect-to-api/#configure-the-default-authorization-mode)

[full course video](https://www.youtube.com/watch?v=QEMfnr5MO1w)



## Current status

1. GraphQL seems to complex for just sending and reacting to events
1. WebSockets need an EC2 or ApiGateway (I haven't explored this one)
1. IoT core



## Types

### http


Use `GET` and `POST`

```html

<data-sync type="http" src="https://api.com/endpoint/{userId}/profile" data-user-id="_user_id">
</data-sync>

```


### IoT Core
