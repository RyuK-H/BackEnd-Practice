const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 띄어쓰기를 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        maxlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type:Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
        unique: 1
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre("save", function(next) {
    var user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    var user = this;

    bcrypt.compare(plainPassword, user.password, function(err) {
        if(err) return cb(err);
        cb(null, true)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    var token = jwt.sign(user._id.toHexString(), "secretToken")
    user.token = token;


    user.save((err, userInfo) => {
        if(err) return cb(err);
        cb(null, user);
    });
}

const User = mongoose.model("User", userSchema)

module.exports = { User }