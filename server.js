const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    hello: String
    newField: Int
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

const root = {
  hello: () => 'Hello Ukraine!',
  newField: () => 3,
  rollDice: ({numDice, numSides = 6}) => {
  
    const output = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * numSides));
    }
    
    return output;
  }
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
