var express = require('express');
var graphqlHTTP = require('express-graphql');
var graphql = require('graphql');

// Maps id to User object
var fakeDatabase = {
    'a': {
        id: 'a',
        name: 'alice',
    },
    'b': {
        id: 'b',
        name: 'bob',
    },
};

// Define the User type
// Note the reserverd words like: name, fields, type
var userType = new graphql.GraphQLObjectType({
  /**/ name: 'User',
  /**/ fields: {
        id: { /**/ type: graphql.GraphQLString },   // We can use: { type: new GraphQLNonNull(String) } 
        name: { /**/ type: graphql.GraphQLString },
    }
});

// Define the Query type
// We can name it anything! This type will serve as the data's root!
// More reserved words like: args, resolve
var queryType = new graphql.GraphQLObjectType({
    name: 'Query',      // Must be query because it is the root
    fields: {
        user: {

            // Point to another type we've defined earlier

            /**/ type: userType,

            // `args` describes the arguments that the `user` query accepts

            /**/ args: {
                id: { /**/type: graphql.GraphQLString }
            },

            // For a complex types we need to use a resolve

            /**/ resolve: function (_, { id }) {
                return fakeDatabase[id];
            }
        }
    }
});

var schema = new graphql.GraphQLSchema({ query: queryType });

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');