import  prisma  from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
        )
        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        });
        console.log('✅ Token generated:', token);
        res.status(200).json({ message: 'Login successful', token, user: payload });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: '💔Internal server error' });
    }
}
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.trim() || !password.trim()) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailregex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email: email,
                password: passwordHash,
                role: null
            }
        })
        res.status(200).json({ message: 'register successful' });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: '💔Internal server error' });
    }
}