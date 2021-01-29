const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');

const {MONGODB} = require('./config')
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')

const PORT = process.env.PORT || 5000

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
});

mongoose.connect(MONGODB, {useNewUrlParser:true, useUnifiedTopology: true } ).then(
    ()=>{
        console.log('mongodb connection established')
        return server.listen({port:PORT})
    }
)
.then(res => console.log(res.url))
.catch((err) => console.log(err))