export const allowRole = async (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;
            if (!userRole) {
                return res.status(401).json({ message: "No role provided" });
            }
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: "Access denied: Unauthorized role" });
            }
            next();
        } catch (error) {
            console.error("❌ Allow Role error:", err);
            res.status(400).json({ message: "Invalid Role" });
        }
    }
}