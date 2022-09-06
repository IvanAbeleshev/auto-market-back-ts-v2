import { AllowNull, DataType } from 'sequelize-typescript'
import { SequelizeInstance } from './db'

const user = SequelizeInstance.define('user', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: DataType.STRING,
        unique: true,
        allowNull: false
    },
    phone:{
        type: DataType.STRING,
        unique: true
    },
    password: {
        type: DataType.STRING,
        allowNull: false
    },
    role: {
        type: DataType.STRING,
        defaultValue: 'user'
    },
})

const favoriteUserProduct = SequelizeInstance.define('favoriteUserProduct', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

const basketUser = SequelizeInstance.define('basketUser', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    count:{
        type: DataType.INTEGER,
        allowNull: true
    },
    sum:{
        type: DataType.INTEGER,
        allowNull: true
    }
})

const typesProduct = SequelizeInstance.define('typesProduct', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataType.STRING,
        allowNull: true,
    },
    guid:{
        type: DataType.STRING,
        allowNull: true
    }
})

const remainderProduct = SequelizeInstance.define('remainderProduct', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    remainder:{
        type: DataType.FLOAT,
        defaultValue: 0
    }
})

const imageProduct = SequelizeInstance.define('imageProduct', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: DataType.STRING,
        allowNull: true
    }
})

const product = SequelizeInstance.define('product',{
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    guid:{
        type: DataType.STRING,
        allowNull: true
    },
    name:{
        type: DataType.STRING,
        allowNull: true,
    },
    fullName:{
        type: DataType.STRING,
        allowNull: true,
    },
    description:{
        type: DataType.STRING,
        allowNull: true,
    },
    atricle:{
        type: DataType.STRING,
        allowNull: true,
    },
    actualPrice: {
        type: DataType.FLOAT
    },
    oldPrice: {
        type: DataType.FLOAT,
        defaultValue: 0,
        allowNull: true
    },
    mainNameImg:{
        type: DataType.STRING,
        defaultValue: '',
        allowNull: true
    }

})

const order = SequelizeInstance.define('order', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
})

const orderProducts = SequelizeInstance.define('orderProducts', {
    id:{
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },    
    count:{
        type: DataType.FLOAT,
        allowNull: false
    },
    sum:{
        type: DataType.FLOAT,
        allowNull: false
    }
})

// set relationship between tables db
product.hasMany(imageProduct)
imageProduct.belongsTo(product)

product.hasOne(remainderProduct)
remainderProduct.belongsTo(product)

typesProduct.hasMany(product)
product.belongsTo(typesProduct)

product.hasMany(basketUser)
basketUser.belongsTo(product)

product.hasMany(favoriteUserProduct)
favoriteUserProduct.belongsTo(product)

user.hasOne(basketUser)
basketUser.belongsTo(user)

user.hasOne(favoriteUserProduct)
favoriteUserProduct.belongsTo(user)

user.hasOne(order)
order.belongsTo(user)

order.hasMany(orderProducts)
orderProducts.belongsTo(order)

product.hasMany(orderProducts)
orderProducts.belongsTo(product)

export {user, typesProduct, remainderProduct, favoriteUserProduct, basketUser, product, imageProduct, order, orderProducts}



