import Parameter from 'parameter'
import { User } from '../models';
let parameter = new Parameter();

let keysPostCreate = {
    name: {
        type: 'string',
        required: true,
        allowNull: false
    },
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
    list_department: {
        type: 'array',
        required: false,
        allowNull: false,
        itemType: 'string'
    },
    type: {
        type: 'enum',
        require: true,
        values: [User.TYPE_USER_ADMIN, User.TYPE_USER_DEPARTMENT]
    }
}

let keysPutUpdate = {
    name: {
        type: 'string',
        required: false,
    },
    image: {
        type: 'string',
        required: false,
    },
    faculty: {
        type: 'string',
        required: false,
    },
    class_room: {
        type: 'string',
        required: false,
    }
}

let keysPutPasswordMe = {
    password: {
        type: 'string',
        required: true,
        allowNull: false
    }
}


let keysDetail = {
    id: {
        type: 'string',
        required: true,
        allowNull: false
    }
}




async function validatorsPostUser(req, res, next) {
    let errors = parameter.validate(keysPostCreate, req.body)
    if (errors) {
        return res.status(400).send(errors)
    }
    await next();
}

async function validatorsPutUser(req, res, next) {
    let errors = parameter.validate(keysPutUpdate, req.body)
    if (errors) {
        return res.status(400).send(errors)
    }
    await next();
}


async function validatorsPutPasswordMe(req, res, next) {
    let errors = parameter.validate(keysPutPasswordMe, req.body)
    if (errors) {
        return res.status(400).send(errors)
    }
    await next();
}

async function validatorsDetailUser(req, res, next) {
    let errors = parameter.validate(keysDetail, req.params)
    if (errors) {
        return res.status(400).send(errors)
    }
    await next();
}


export {
    validatorsPostUser,
    validatorsPutUser,
    validatorsDetailUser,
    validatorsPutPasswordMe
}