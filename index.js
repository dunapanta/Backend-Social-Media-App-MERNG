const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose')

const Post = require('./models/Post')
const { MONGODB } = require('./config.js')

const typeDefs = gql`
    type Post{
        id: ID!
        createdAt: String!
        body: String!
        username: String!
    }
    type Query{
        getPosts: [Post]
    }
`;

// cada query, mutation o subscription tiene su correspondiente resolver que contioene la logica
const resolvers = {
    Query: {
        async getPosts(){
            // si la query falla podria parar el servidor por eso importante el try catch
            try{
                const posts = await Post.find();
                return posts;
            }catch(err){
                throw new Error(error);
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then( () => {
        console.log('MongoDB Connected')
        return server.listen({port: 5000})
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })

