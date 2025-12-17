import { fixBigInt } from "../context/BigInt.js";
import prisma from "../utils/prisma.js";

// Category
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ categories: fixBigInt(categories) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Coures
export const getPublicCourses = async (req, res) => {
    try {
        const { type } = req.query;

        const courses = await prisma.course.findMany({
            where: type ? { type: { equals: type } } : {},
            include: {
                teacher: { select: { id: true, name: true } },
                category: true
            },
            orderBy: { createdAt: "desc" }
        });

        res.status(200).json({ courses: fixBigInt(courses) });
    } catch (error) {
        console.error("❌ Get Courses Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const getPublicCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await prisma.course.findUnique({
            where: { id: BigInt(id) },
            include: {
                teacher: { select: { id: true, name: true } },
                category: true,
                lessons: {
                    orderBy: { sortOrder: "asc" },
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.json({ course: fixBigInt(course) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Review 
export const createReview = async (req, res) => {
    try {
        const { rating, comment, courseId } = req.body;

        if (!req.user?.id) {
            return res.status(401).json({ message: "กรุณาเข้าสู่ระบบ" });
        }

        if (!courseId) {
            return res.status(400).json({ message: "courseId is required" });
        }

        const review = await prisma.review.create({
            data: {
                rating: Number(rating),
                comment,
                courseId: BigInt(courseId),
                userId: BigInt(req.user.id)
            }
        });

        res.json({ review: fixBigInt(review) });
    } catch (err) {
        console.error("CREATE REVIEW ERROR:", err);
        res.status(500).json({ message: "ไม่สามารถส่งรีวิวได้" });
    }
}
export const getCourseReviews = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "courseId is required" });

        const courseId = BigInt(id);

        const reviews = await prisma.review.findMany({
            where: { courseId },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });

        const avgRating =
            reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1);

        // แปลง BigInt เป็น string ก่อนส่ง
        res.json({
            reviews: fixBigInt(reviews),
            avgRating: Number(avgRating.toFixed(1)),
            total: reviews.length
        });
    } catch (err) {
        console.error("getCourseReviews error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
}


