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
                teacher: {
                    select: { id: true, name: true }
                },
                category: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.status(200).json({ courses: fixBigInt(courses) });
    } catch (error) {
        console.error("❌ Get Courses Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPublicCourseById = async (req, res) => {
    try {
        const { id } = req.params

        const course = await prisma.course.findUnique({
            where: { id: BigInt(id) },
            include: {
                teacher: { select: { id: true, name: true } },
                category: true,
                lessons: {
                    orderBy: { sortOrder: "asc" },
                    select: {
                        id: true,
                        title: true,
                        duration: true
                    }
                }
            }
        })

        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        res.json({ course: fixBigInt(course) })
    } catch (err) {
        res.status(500).json({ message: "Internal server error" })
    }
}
