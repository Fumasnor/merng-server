const { UserInputError } = require("apollo-server")

module.exports.validateRegister = (username, email, password, confirmPassword) => {
    const errors = {}
    if (username.trim()==='') {
        errors.username = 'Username is empty'
    }
    if (email.trim()==='') {
        errors.email = 'Email is empty'
    }
    else {
        const regEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        if(!email.match(regEx)) {
            errors.email = 'Invalid format'
        }
    }
    if (password.trim() ===''){
        errors.password = 'Password is empty'
    } else if (password !== confirmPassword) {
        errors.password = 'Passwords don\'t match'
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}

module.exports.validateLogin = (username, password) => {
    const errors = {}
    if (username.trim()===''){
        errors.username = 'Username is empty'
    }
    if (password.trim()===''){
        errors.password = 'Password is empty'
    }
    return {
        errors,
        valid: Object.keys(errors).length === 0
    }
}