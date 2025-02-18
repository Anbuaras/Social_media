const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware for authentication
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access Denied!" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token!" });
    }
};

// Create a Post
router.post("/", verifyToken, async (req, res) => {
    try {
        const newPost = new Post({ userId: req.user.id, content: req.body.content, image: req.body.image });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Posts
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find().populate("userId", "username profilePic").sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Edit a Post
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId.toString() !== req.user.id) return res.status(403).json({ error: "Not Authorized!" });

        post.content = req.body.content;
        post.image = req.body.image;
        await post.save();
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a Post
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId.toString() !== req.user.id) return res.status(403).json({ error: "Not Authorized!" });

        await post.deleteOne();
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
