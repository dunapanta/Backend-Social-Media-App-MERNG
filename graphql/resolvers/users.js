const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const { SECRET_KEY } = require('../../config')
const User = require('../../models/User');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');

function generateToken( user ) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username
        }, 
        SECRET_KEY, 
        { expiresIn: '1h'}
    );
}

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

            const token = generateToken(res)

            return {
                ...res._doc,
                id: res._id, 
                token

            }
        },

        //Login
        async login(parent, { username, password }) {
            const {errors, valid} = validateLoginInput(username, password);
            const user = await User.findOne({username})

            if(!valid){
                throw new UserInputError('Errores', { errors });
            }

            if(!user){
                errors.general = 'User not found'
                throw new UserInputError('Usuario no encontrado', { errors });
            }

            // comparar contraseña ingresada con la del usuario para hacer login
            const match = await bcryptjs.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials'
                throw new UserInputError('Credenciales Incorrectas', { errors });
            }

            // si llega aqui se debe hacer login exitoso
            const token = generateToken(user);

            return {
                ...user._doc,
                id: user._id, 
                token

            }
        }
    }
}