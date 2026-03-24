const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    name: String,
    price: Number,
    img: String,
    status: {
        type: String,
        default: "Ordered"
    }
});

module.exports = mongoose.model("Order", orderSchema);