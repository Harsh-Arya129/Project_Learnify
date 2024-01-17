import express from "express";
import mongoose from "mongoose";
import router from "./user-router.js";
import blogRouter from "./blog-routes.js";
import cors from "cors";

const app=express();
app.use(cors());
app.use(express.json());
app.use("/api/user",router);
app.use("/api/blog",blogRouter);

mongoose.connect('mongodb://127.0.0.1:27017')
.then(()=>app.listen(5000))
.then(()=>console.log("Connected"))
.catch((err)=>console.log(err));

