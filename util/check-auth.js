const { AuthenticationError } = require('apollo-server');

const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports =  (context) => {
    const authHeader = context.req.headers.authorization;
    if(authHeader){
        //si tenemos debemos obtener el token
        // Por convencion cuando se trabaja con authorization tokens se trabaja con Bearer ...
        const token = authHeader.split('Bearer ')[1];
        if(token){
            // se debe verificar el token
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            }catch(err){
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
         throw new Error('Authentication token must be \' Bearer [token]')
    }
    throw new Error('Authorization header must be provided')
}