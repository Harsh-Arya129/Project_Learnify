import mongoose, { mongo } from "mongoose";
import Blog from "./Blog.js";
import User from "./User.js";
import user from "./User.js";


export const getAllBlogs = async(req,res,next)=>{
    let blogs;
    try {
        blogs = await Blog.find().populate("user");
    } catch (err) {
        return console.log(err);        
    }
    if(!blogs){
        return res.status(404).json({message: "No Blog Found"});
    }
    return res.status(200).json({blogs});
}

export const addBlog = async(req,res,next)=>{
    const {title,description,image,user} = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return console.log(err);
    }
    if(!existingUser){
        return res.status(400).json({message: "Unable to find user by thid id"});
    }

    const blog = new Blog({
        title,
        description,
        image,
        user
    });
    try {
        await blog.save();
        existingUser.blogs.push(blog);
        await existingUser.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Err ok"});
    }
    return res.status(200).json({blog});
};

export const updateBlog = async(req,res,next)=>{
    const {title,description} = req.body;
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId,{title,description,});
    } catch (err) {
        return console.log(err);
    }
    if(!blog){
        return res.status(500).json({message: "Unable to Update the Blog."});
    }
    return res.status(200).json({blog});
};

export const getById = async(req,res,next)=>{
    const id = req.params.id;
    let blog;
    try{
        blog = await Blog.findById(id);
    } catch (err) {
        console.log(err);
    }
    if(!blog){
        return res.status(404).json({message: "No Blog Found"});
    }
    return res.status(200).json({blog});
};

export const deleteBlog = async(req,res,next)=>{
    const id = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndRemove(id).populate("user");
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Err in ok"});
    }
    if(!blog){
        return res.status(500).json({message: "Unable to delete the Blog."});
    }
    return res.status(200).json({message: "Sucessfully deleted"});
};

export const getByUserId = async(req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        return console.log(err);
    }
    if(!userBlogs){
        return res.status(404).json({message: "No Blog Found"});
    }
    return res.status(200).json({ user: userBlogs});
};
