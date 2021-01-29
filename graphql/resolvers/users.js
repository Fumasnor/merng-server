const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')

const User = require('../../models/userModel')
const {SECRETKEY} = require('../../config')
const {validateRegister, validateLogin} = require('../../util/validators')


function tokenGenerator(user){
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
    },SECRETKEY, {
        expiresIn:'1h'
    })
}


module.exports = {
    Mutation : {
        async registerUser(_, {inputUser: {username, email, password, confirmPassword}}) {
            
            const {errors, valid} = validateRegister(username, email, password, confirmPassword)
            
            if (!valid){
                throw new UserInputError ('Input error found!', {errors})
            }

            const userFound = await User.findOne({username})
            if (userFound) {
                throw new UserInputError('Username already exists!', {
                    errors:{
                        username: "Please use another username!"
                    }
                })
            }

            password = await bcrypt.hash(password, 12) 
            const newUser = new User({
                username,
                email,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()
            
            const token = tokenGenerator(res)
            
            return {
                ...res._doc,
                id: res.id,
                token
            }
        }
    ,
        async loginUser(_, {username, password}) {
            const {valid, errors} = validateLogin(username, password)
            if (!valid){
                throw new UserInputError('Input error found!', {errors})
            }
            const user = await User.findOne({username})
            if (!user) {
                errors.general = 'Username not found!'
                throw new UserInputError('Username not found', {errors})
            }
            const match = await bcrypt.compare(password, user.password)
            if(!match){
                errors.general = 'Incorrect Password'
                throw new UserInputError('Incorrect Password', {errors}) 
            }
            const token = tokenGenerator(user)
    
            return {
                ...user._doc,
                id: user.id,
                token
            }

        }
}
}