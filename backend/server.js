const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ================= CONNECT MONGODB =================
mongoose.connect("mongodb://127.0.0.1:27017/turboGrocery")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// ================= MODELS =================
const User = require("./models/user");
const Order = require("./models/order");

// ================= SIGNUP =================
app.post("/api/signup", async (req, res) => {
    try {
        const { name, phone, email, address, password } = req.body;

        const existingUser = await User.findOne({ name });

        if (existingUser) {
            return res.json({ message: "User already exists" });
        }

        const newUser = new User({ name, phone, email, address, password });
        await newUser.save();

        res.json({ message: "Signup successful" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error signing up" });
    }
});

// ================= LOGIN =================
app.post("/api/login", async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await User.findOne({ name, password });

        if (!user) {
            return res.json({ message: "Invalid credentials" });
        }

        res.json({ message: "Login successful", user });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in" });
    }
});

// ================= PLACE ORDER =================
app.post("/api/order", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();

        res.json({ message: "Order placed" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error placing order" });
    }
});

// ================= GET ORDERS =================
app.get("/api/orders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);

    } catch (err) {
        res.status(500).json({ message: "Error fetching orders" });
    }
});

// ================= CLEAR ORDERS =================
app.delete("/api/orders", async (req, res) => {
    try {
        await Order.deleteMany({});
        res.json({ message: "Orders cleared" });

    } catch (err) {
        res.status(500).json({ message: "Error clearing orders" });
    }
});

// ================= START SERVER =================
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000 🚀");
});