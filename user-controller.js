import User from "./User.js";
import user from "./User.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async(req,res,next)=>{
    let users;
    try{
        users = await user.find();
    }catch(err){
        console.log(err);
    }
    if(!user){
        return res.status(404).json({message: "No User Found"});
    }
    return res.status(200).json({users});
};

export const signUp = async(req,res,next)=>{
    const{name,email,password}=req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
        return console.log(err);
    }
    if(existingUser){
        return res.status(400).json({message: "User Already exixts! Login Instead"});
    }

    const hashedpassword = bcrypt.hashSync(password);

    const user = new User({
        name,
        email,
        password: hashedpassword,
        blogs: [],
    });
    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    }
    return res.status(201).json({user});
};

export const login = async(req,res,next)=>{
    const{email,password}=req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({email});
    }catch(err){
        return console.log(err);
    }
    if(!existingUser){
        return res.status(404).json({message: "No User Found by this email."});
    }

    const isPasswordCorrect = bcrypt.compareSync(password,existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message: "Incorrect Password"});
    }
    return res.status(200).json({message: "Login Sucessfull.",user: existingUser });
}
