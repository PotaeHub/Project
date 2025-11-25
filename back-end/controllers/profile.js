import prisma from "../utils/prisma.js";

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // ได้จาก token

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('❌ Get profile error:', error);
        res.status(500).json({ message: '💔Internal server error' });
    }
}
