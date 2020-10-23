module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Ingrese el nombre de usuario'
    }
    if(email.trim() === ''){
        errors.email = 'Ingrese el correo electrónico'
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Ingrese un correo electrónico válido';
        }
    }
    if(password === ''){
        errors.password = 'Ingrese una contraseña';
    } else if(password !== confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return {
        errors,
        // si valid es true significa no hay errores
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {}

    if(username.trim() === ''){
        errors.username = 'Ingrese el nombre de usuario'
    }

    if(password === ''){
        errors.password = 'Ingrese la contraseña'
    }

    return {
        errors,
        // si valid es true significa no hay errores
        valid: Object.keys(errors).length < 1
    }
}