const {AuthenticationError} = require('apollo-server')

const jwt = require('jsonwebtoken')
const {SECRETKEY} = require('../config')

module.exports = (context) => {
    const authHeader = context.req.headers.authorization
   
    if (authHeader){
    const token = authHeader.split('Bearer ')[1]
        if (token){
            try{
            const user = jwt.verify(token, SECRETKEY)
            return user
            } catch(err){
                throw new AuthenticationError('Invalid/Expired Token')
            }
        }
        else {
            throw new AuthenticationError('The format of the authentication token is not correct!')
        }
    }
    else {
        throw new AuthenticationError('Authorization Header not provided!')
    }
}