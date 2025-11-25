import jwt from 'jsonwebtoken';

export const verifyAuthToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization header is missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access token is missing' });
        }
        jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
            if (err) {
                console.error('❌ Token verification error:', err);
                return res.status(403).json({ message: 'Invalid or expired token' });
            }
            req.user = decoded;
            next();
        });
    }
    catch (err) {
        console.error("❌ Token verification error:", err);
        res.status(401).json({ message: "Invalid token" });
    }
}

export default { verifyAuthToken };