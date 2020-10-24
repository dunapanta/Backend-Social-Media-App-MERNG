const Post = require('../../models/Post');
const { UserInputError } = require('apollo-server')

const checkAuth = require('../../util/check-auth');

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
        }
    }
}