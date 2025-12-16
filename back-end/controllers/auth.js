import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fixBigInt } from "../context/BigInt.js";
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        const payload = {
            id: user.id.toString(),
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '2h' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        console.log('✅ Token generated:', token);
        res.status(200).json({ message: 'Login successful', token, user: payload });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const register = async (req, res) => {
    try {

        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        const safenewUser = fixBigInt(newUser.id);
        res.status(201).json({ message: 'User registered successfully', userId: safenewUser });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: '💔Internal server error' });
    }
}
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Validate
        if (!email || !password || !email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 2) Check user exist
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 3) Check role = ADMIN only
        if (user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Not an Admin" });
        }

        // 4) Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // 5) JWT payload
        const payload = {
            id: user.id.toString(),
            email: user.email,
            role: user.role
        };

        // 6) Access Token (15m)
        const token = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        );

        // 7) Refresh Token (7 days)
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        // 8) Set refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,        // production ให้ใช้ true (HTTPS)
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });

        // For debugging only
        if (process.env.NODE_ENV !== "production") {
            console.log("✅ Admin Token:", token);
        }

        // 9) Success response
        return res.status(200).json({
            message: "Admin login successful",
            token,
            user: payload
        });

    } catch (error) {
        console.error("❌ Admin Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const logout = (req, res) => {
    res.clearCookie('refreshToken', { path: '/' });
    return res.status(200).json({ message: 'Logout successful' });
}
