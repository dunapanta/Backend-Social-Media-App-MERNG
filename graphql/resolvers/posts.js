const Post = require('../../models/Post');

module.exports = {
    Query: {
        async getPosts(){
            // si la query falla podria parar el servidor por eso importante el try catch
            try{
                const posts = await Post.find();
                return posts;
            }catch(err){
                throw new Error(err);
            }
        },
        async getPost(parent, { postId } ){
            try{
                const post = await Post.findById(postId);
                if(post){
                    return post;
                } else {
                    throw new Error('Post not found')
                }
            } catch(err){
                throw new Error(err)
            }
        }
    }
}