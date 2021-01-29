const {UserInputError, AuthenticationError} = require('apollo-server')

const Post = require('../../models/postModel')
const auth = require('../../util/auth')

module.exports = {
    Mutation: {
        async addComment(_, {postId, body}, context){
            const user = auth(context)
            if (body.trim()===''){
                throw new UserInputError('Empty comment!', {
                    errors: {
                        comments: 'Comment mustn\'t be empty'
                    }
                })
            }
            try {
                const post = await Post.findById(postId)
                post.comments.unshift({
                    username: user.username,
                    body: body,
                    createdAt: new Date().toISOString()      
                })
                await post.save()
                
                return post

            } catch(err){
                throw new Error (err)
            }
        },
        async deleteComment(_, {postId, commentId}, context){
            const {username} = auth(context)
            
            try {
                const post = await Post.findById(postId)
                const commentIndex = post.comments.findIndex(com => commentId === com.id)
                const commentUsername = post.comments[commentIndex].username
                if(commentUsername === username){
                    post.comments.splice(commentIndex, 1)
                    await post.save()
                    
                    return post
                }
                else{
                    throw new AuthenticationError('The user is not the creator of the comment')
                }
            } catch(err){
                throw new Error(err)
            }

        }
    }
}