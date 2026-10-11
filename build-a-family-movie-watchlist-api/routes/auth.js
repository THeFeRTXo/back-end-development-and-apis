import express from "express";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Test 9: username no existe → 401
  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Test 10: password incorrecta → 401
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Test 11: credenciales válidas → 200 con token
  const token = signToken({ id: user.id, username: user.username, role: user.role });
  return res.status(200).json({ token });
});

export default router;