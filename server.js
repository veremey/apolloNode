const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Query {
    hello: String
    newField: Int
    rollDice(numDice: Int!, numSides: Int): [Int]
    user(name: String = "Anonimous"): User
    getDie(numSides: Int): RandomDie
    getMessage: String
  }

  type User {
    name: String
    age: Float
  }

  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Mutation {
    setMessage(message: String): String
  }

`);

const faceDatabace = {}


class User {
  constructor(name) {
    this.name = name
  }

  age() {
    return Math.floor(Math.random() * 100)
  }
}

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({numRolls}) {
    const output = [];
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

const root = {
  hello: () => 'Hello Ukraine!',
  newField: () => 3,
  rollDice: ({numDice, numSides = 6}) => {
    const output = [];

    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * numSides));
    }
    
    return output;
  },
  user: (args) => new User(args.name),
  getDie: (args) => new RandomDie(args.numSides || 3),
  setMessage: ({message}) => {
    faceDatabace.message = message;
    return message
  },
  getMessage: () => faceDatabace.message,
};

const app = express();
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('👉 Running a GraphQL API server at http://localhost:4000/graphql 🥰');
