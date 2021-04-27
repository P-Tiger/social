import Parameter from 'parameter'
let parameter = new Parameter();

let keysPostAuth = {
    password: {
        type: 'string',
        required: true,
        allowNull: false
    },
    user_name: {
        type: 'string',
        required: true,
        allowNull: false
    },
}

async function validatorsPostAuth(req, res, next) {
    let errors = parameter.validate(keysPostAuth, req.body)
    if (errors) {
        return res.status(400).send(errors)
    }
    await next();
}

export {
    validatorsPostAuth
}