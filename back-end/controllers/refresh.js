import jwt from "jsonwebtoken";
export const refresh = (req, res) => {
    console.log("Cookies:", req.cookies);
    
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign(
            { id: decoded.id, email: decoded.email, role: decoded.role },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        return res.status(200).json({ accessToken: newAccessToken });

    } catch (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
    }
};