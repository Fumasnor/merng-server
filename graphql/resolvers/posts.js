const {AuthenticationError, UserInputError} = require('apollo-server')

const Post = require('../../models/postModel')
const auth = require('../../util/auth')

module.exports = {
    Query: {
        async queryPosts(){
            try{
                const posts = await Post.find().sort({createdAt:-1})
                return posts
            } catch(err) {
                throw new Error(err)
            }
        },

        async queryPost(_,{postId}){
            try {
                const post = Post.findById(postId)
                return post
            } catch(err){
                throw new Error(err)
            }
        }


    },
    Mutation: {
        async createPost(_, {body}, context){
            const user = auth(context)
            if (body.trim()===''){
                throw new UserInputError('body mustn\'t be empty', {
                    errors: {
                        body: 'body mustn\'t be empty'
                    }
                })
            }
            const newPost = new Post({
                body,
                username: user.username,
                createdAt: new Date().toISOString(),
                user: user.id
            })

            const post = await newPost.save()
            return post
        },
        
        async deletePost(_, {postId}, context){
            const user = auth(context)
            try{
                const post = await Post.findById(postId)
                if(user.username === post.username){
                    await post.delete()
                    return 'Deleted successfully!'
                }else{
                    throw new AuthenticationError('You cannot delete a post if you are not the creator')
                }
            }catch(err){
                throw new Error(err)
            }
        },

        async addLike(_, {postId}, context){
            const {username} = auth(context)
            try{
                const post = await Post.findById(postId)
                if(post.likes.find(like => like.username === username)){
                    post.likes = post.likes.filter(like => like.username !== username)
                }
                else{
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save()
                return post
            } catch(err){
                throw Error(err)
            }

        }

    }
}