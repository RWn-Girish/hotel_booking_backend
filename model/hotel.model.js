const mongoose = require('mongoose');

const hotelSchema = mongoose.Schema(
    {
        hotelName: {
            type: String
        },
        location: {
            type: String
        },
        email: {
            type: String
        },
        mobileNo: {
            type: String
        },
        hotelImages: [{
            type: String
        }],
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


module.exports = mongoose.model('Hotel', hotelSchema);