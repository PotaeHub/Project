import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("Seeding database...");

    const adminPass = await bcrypt.hash("admin123", 10);
    const teacherPass = await bcrypt.hash("teacher123", 10);
    const studentPass = await bcrypt.hash("student123", 10);

    // 1️⃣ Create Admin
    await prisma.user.create({
        data: {
            name: "Admin Master",
            email: "admin@example.com",
            password: adminPass,
            role: "ADMIN",
            adminProfile: {
                create: {
                    position: "System Administrator",
                    phone: "0999999999"
                }
            }
        }
    });
    console.log("👑 Admin created");

    // 2️⃣ Create Teacher
    const teacher = await prisma.user.create({
        data: {
            name: "John Teacher",
            email: "teacher@example.com",
            password: teacherPass,
            role: "TEACHER",
            teacherProfile: {
                create: {
                    subject: "Web Development",
                    experience: 5,
                    phone: "0888888888"
                }
            }
        }
    });

    console.log("🧑‍🏫 Teacher created");

    // 3️⃣ Create Student
    const student = await prisma.user.create({
        data: {
            name: "Student One",
            email: "student@example.com",
            password: studentPass,
            role: "STUDENT",
            studentProfile: {
                create: {
                    gradeLevel: "Year 1",
                    classroom: "A1",
                    phone: "0777777777"
                }
            }
        }
    });

    console.log("🎒 Student created");

    // 4️⃣ Create Categories
    const category1 = await prisma.category.create({
        data: { name: "Programming" }
    });

    const category2 = await prisma.category.create({
        data: { name: "Design" }
    });

    console.log("📚 Categories created");

    // 5️⃣ Create Course + Lessons
    const course = await prisma.course.create({
        data: {
            title: "JavaScript Bootcamp",
            description: "เรียนพื้นฐาน JavaScript ทั้งหมด",
            price: 1500,
            teacherId: teacher.id,
            categoryId: category1.id,
            level: "beginner",
            lessons: {
                create: [
                    { title: "Introduction to JS", content: "Basic concepts...", sortOrder: 1 },
                    { title: "Variables & Types", content: "var let const...", sortOrder: 2 },
                    { title: "Functions", content: "Function basics...", sortOrder: 3 }
                ]
            }
        }
    });

    console.log("📘 Course + Lessons created");

    // 6️⃣ Enrollment
    await prisma.enrollment.create({
        data: {
            userId: student.id,
            courseId: course.id,
            status: "ENROLLED"
        }
    });

    console.log("📝 Enrollment created");

    // 7️⃣ Payment
    await prisma.payment.create({
        data: {
            userId: student.id,
            courseId: course.id,
            amount: 1500,
            status: "COMPLETED",
            transactionId: "TXN123456"
        }
    });

    console.log("💰 Payment created");

    // 8️⃣ Review
    await prisma.review.create({
        data: {
            userId: student.id,
            courseId: course.id,
            rating: 5,
            comment: "คอร์สดีมาก เข้าใจง่าย!"
        }
    });

    console.log("⭐ Review created");

    // 9️⃣ Progress
    const lessons = await prisma.lesson.findMany({
        where: { courseId: course.id }
    });

    await prisma.progress.createMany({
        data: lessons.map((l, index) => ({
            userId: student.id,
            lessonId: l.id,
            isDone: index < 2
        }))
    });

    console.log("📈 Progress created");
}

main()
    .then(() => {
        console.log("🌱 Seed completed!");
        prisma.$disconnect();
    })
    .catch((err) => {
        console.error("❌ Seed error:", err);
        prisma.$disconnect();
        process.exit(1);
    });
