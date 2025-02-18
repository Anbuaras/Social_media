require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./Routes/auth");

app.use("/api/auth", authRoutes);

const postRoutes = require("./routes/post");

app.use("/api/posts", postRoutes);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"));

app.get("/", (req, res) => res.send("🚀 SocialPulse API Running"));

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
