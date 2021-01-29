const gql = require('graphql-tag');

module.exports = gql`

type Post {
    id: ID!
    body: String!
    username: String!
    createdAt: String!
    comments: [Comment]!
    likes: [Like]!
    commentCount: Int!
    likeCount: Int!
    user: User!
}

type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
}

type Comment {
    id: ID!
    username: String!
    body: String!
    createdAt: String!
}

type Like {
    id: ID!
    username: String!
    createdAt: String!
}

input InputUser {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
}

type Query {
    queryPosts: [Post!]! 
    queryPost(postId: ID!): Post!
}

type Mutation {
    registerUser(inputUser: InputUser): User
    loginUser(username: String, password: String): User
    createPost(body: String): Post
    deletePost(postId: ID): String
    addComment(postId: ID, body: String): Post
    deleteComment(postId: ID, commentId: ID): Post
    addLike(postId: ID): Post
}

schema {
    query: Query
    mutation: Mutation
}
`