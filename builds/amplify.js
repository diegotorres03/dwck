
// let global = {}

import { Amplify } from '../node_modules/aws-amplify'
// import { graphqlOperation, API } from '../node_modules/aws-amplify/dist/esm/api/index.mjs'
import { generateClient} from '../node_modules/@aws-amplify/api'


// import { Amplify } from '../node_modules/aws-amplify'
// export * from '../node_modules/aws-amplify'


Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://6rhs55avojehvpuesc7yepatru.appsync-api.us-west-2.amazonaws.com/graphql',
      region: 'us-west-2',
      defaultAuthMode: 'apiKey',
      apiKey: 'da2-qbhb5lczpjd4vchklsp37da3wi'
    }
  }
});




async function test() {
  console.log('running sample query')
  // API.graphql(graphqlOperation(
  //   `query MyQuery {
  //     messages {
  //       data
  //       timestamp
  //       id
  //     }
  //   }
  //   `
  // ))
  //   .then(result => console.log(result))
  //   .catch(error => console.log(error))
}

export {
  Amplify,
  generateClient,
}
// window.global = {
//   Amplify,
// }