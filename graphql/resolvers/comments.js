const Post = require('../../models/Post');
const { UserInputError, AuthenticationError } = require('apollo-server')

const checkAuth = require('../../util/check-auth');
const User = require('../../models/User');

module.exports = {
    Mutation: {
        createComment: async (parent, { postId, body }, context) => {
            const user = checkAuth(context);
            if(body.trim() === ''){
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Commentario vacío'
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post){
                // mongoose trata los modelos como json objects por lo que puedo acceder a los comentarios asi
                post.comments.unshift({
                    body,
                    username: user.username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        },

        deleteComment: async(parent, { postId, commentId }, context ) => {
            const user = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                const commentIndex = post.comments.findIndex( c => c.id === commentId);

                if( post.comments[commentIndex].username ===  user.username ){
                    // me aseguro que es el dueño del comentario
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError('Action not allowed')
                }
            }else{
                throw new UserInputError('Post not found');
            }


        },
        likePost: async (parent, { postId }, context) => {
            const {username} = checkAuth(context);

            const post = await Post.findById(postId);

            if(post){
                if(post.likes.find(like => like.username === username)){
                    //Post already liked, unlike it
                    post.likes = post.likes.filter(like => like.username !== username);
                } else{
                    // Not liked, like post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString()
                    })
                }
                await post.save();
                return post;
            } else throw new UserInputError('Post not found');
        }
    }
}