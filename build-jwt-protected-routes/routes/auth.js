import express from "express";
import {findByEmail, readUsers, writeUsers} from "../utils/db.js"
import {signToken} from "../utils/jwt.js";
import authenticate from "../middleware/authenticate.js";
import bcrypt from "bcryptjs";
import randomUUID, { sign } from "crypto";
import { blacklistToken } from "../utils/token-blacklist.js";


const router = express.Router();
export default router;

router.post("/register", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Email and password are required"});
    }
    if (findByEmail(email)){
        return res.status(409).json({message: "Email already in use"});
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const users = readUsers();

    const newUser = {
        id: randomUUID, 
        email,
        passwordHash,
        role: "user",
    };
    users.push(newUser);
    writeUsers(users);

    const token = signToken({id : newUser.id , email, role : newUser.role});
    res.status(201).json({message: "New user registered!", token});
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({message: "Email and password are required"});
    }
    const user = findByEmail(email);
    if (!user){
        return res.status(401).json({message: "Invalid credentials"});
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match){
        return res.status(401).json({message: "Invalid credentials"});
    }
    const token = signToken({id: user.id, email: user.email, role: user.role});
    res.status(200).json({message: "User login successful!", token});
})

router.get("/profile", authenticate, (req, res) => {
    res.json({user: req.user});
})

router.post("/logout", authenticate, (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    blacklistToken(token);
    res.json({message: "Logged out successfully"});

})