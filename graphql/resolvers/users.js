const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');
const { validateRegisterInput } = require('../../util/validators');

module.exports = {
    Mutation: {
        async register(parent, 
            {
            registerInput: {username, email, password, confirmPassword}
            }, 
            context, info){

            // Validar la data del usuario

            const { valid, errors } = validateRegisterInput( username, email, password, confirmPassword )
            if(!valid){
                throw new UserInputError('Error', {errors});
            }

            // username no exista

            const user = await User.findOne({ username });
            if(user){
                throw new UserInputError('Username is taken', {
                    errors: {
                        username: 'El nombre de usuario no está disponible'
                    }
                })
            }

            // hash password and create auth token instalo bcryptjs jsonwebtoken
            password = await bcryptjs.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            });

            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'});

            return {
                ...res._doc,
                id: res._id, 
                token

            }
        }
    }
}