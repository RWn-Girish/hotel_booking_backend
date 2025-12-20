const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        mobileNo: {
            type: String
        },
        profileImage: {
            type: String
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);


module.exports = mongoose.model('User', userSchema);