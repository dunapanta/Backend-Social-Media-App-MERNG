const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth')

module.exports = {
    Query: {
        async getPosts(){
            // si la query falla podria parar el servidor por eso importante el try catch
            try{
                const posts = await Post.find().sort({ createdAt: -1 });
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
                throw new Error(err);
            }
        }
    },
    Mutation: {
        //se hace uso de context para acceder al header y ver si esta autenticado con eso hago el middleware
        async createPost(parent, { body }, context){
            // solo cuando el usuario tiene el token de autenticacion
            const user = checkAuth(context);
            console.log(user);

            // si el codigo llega hasta aqui el token es valido
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            });

            const post = await newPost.save();

            return post;
        }
    }
    
}