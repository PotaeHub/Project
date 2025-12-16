import prisma from "../utils/prisma.js";
import { fixBigInt } from "../context/BigInt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// User Controllers
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check admin permission
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "ลืม @ Email" })
        }
        // Check role is valid
        const roles = ["ADMIN", "TEACHER", "STUDENT"];
        if (!roles.includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        // Hash password
        const hashed = await bcrypt.hash(password, 10);


        // CREATE USER
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: role
            },
        });
        const payload = {
            id: newUser.id.toString(),
            email: newUser.email,
            role: newUser.role
        }

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
        // CREATE PROFILE AUTO
        if (role === "ADMIN") {
            await prisma.adminProfile.create({
                data: { userId: newUser.id, position: "Staff" }
            });
        }

        if (role === "TEACHER") {
            await prisma.teacherProfile.create({
                data: { userId: newUser.id, subject: "", experience: 0 }
            });
        }

        if (role === "STUDENT") {
            await prisma.studentProfile.create({
                data: { userId: newUser.id, gradeLevel: "" }
            });
        }

        return res.status(201).json({
            message: "User created successfully",
            user: fixBigInt(newUser),
            token, user: payload
        });

    } catch (error) {
        console.error("❌ Create User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({

            include: {
                adminProfile: true,
                teacherProfile: true,
                studentProfile: true
            }
        });
        const formattedUsers = users.map((u) => {
            let profile = null;
            if (u.role === "ADMIN") {
                profile = u.adminProfile;
            } else if (u.role === "STUDENT") profile = u.studentProfile
            else if (u.role === "TEACHER") profile = u.teacherProfile

            return {
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                profile
            }
        })
        const safeUsers = fixBigInt(formattedUsers);

        return res.status(200).json({ users: safeUsers });
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ message: '💔 Internal server error' });
    }
}
export const getUserId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const user = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: {
                adminProfile: true,
                teacherProfile: true,
                studentProfile: true
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const safeUser = fixBigInt(user);
        return res.status(200).json({ user: safeUser });
    } catch (error) {
        console.error('❌ Error fetching user by ID:', error);
        res.status(500).json({ message: '💔 Internal server error' })
    };
}
export const getProfile = async (req, res) => {
    try {
        const { id } = req.user;
        console.log("Fetching profile for user ID:", id);
        const user = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: {
                adminProfile: true,
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const safeUser = fixBigInt(user);

        return res.status(200).json({ user: safeUser });
    } catch (error) {
        console.error('❌ Error fetching profile:', error);
        res.status(500).json({ message: '💔 Internal server error' });
    }
}
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        // หา user ก่อน
        const user = await prisma.user.findUnique({
            where: { id: BigInt(id) }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // อัปเดตข้อมูล
        const updatedUser = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
                name: name || user.name,
                email: email || user.email,
                role: role || user.role
            }
        });

        return res.status(200).json({
            message: "User updated successfully",
            user: fixBigInt(updatedUser)
        });

    } catch (error) {
        console.error("❌ Update User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const user = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: {
                adminProfile: true,
                teacherProfile: true,
                studentProfile: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role === "ADMIN" && user.adminProfile) {
            await prisma.adminProfile.delete({
                where: { id: user.adminProfile.id }
            });
        }
        if (user.role === "TEACHER" && user.teacherProfile) {
            await prisma.teacherProfile.delete({
                where: { id: user.teacherProfile.id }
            });
        }
        if (user.role === "STUDENT" && user.studentProfile) {
            await prisma.studentProfile.delete({
                where: { id: user.studentProfile.id }
            });
        }

        await prisma.user.delete({
            where: { id: BigInt(id) }
        });

        return res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error("❌ Delete User Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Teacher Controllers
export const craeteTeacher = async (req, res) => {
    try {
        const { name, email, password, subject, experience, phone } = req.body;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (!name || !email || !password || !subject) {
            return res.status(400).json({ message: "Name, email, password, and subject are required" });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "TEACHER",
                teacherProfile: {
                    create: {
                        subject,
                        experience: experience || 0,
                        phone: phone || ""
                    }
                }
            }
        });
        return res.status(201).json({ message: "Teacher created successfully", user: fixBigInt(newTeacher) });
    } catch (error) {
        console.error('❌ Teacher login error:', error);
        res.status(500).json({ message: '💔 Internal server error' });
    }
};
export const getTeachers = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        const teachers = await prisma.user.findMany({
            where: { role: "TEACHER" },
            include: { teacherProfile: true }
        });
        const safeTeachers = fixBigInt(teachers);
        return res.status(200).json({ teachers: safeTeachers });
    } catch (error) {
        console.error('❌ Error fetching teachers:', error);
        res.status(500).json({ message: '💔 Internal server error' });
    }
}
export const getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const teacher = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { teacherProfile: true }
        });
        if (!teacher || teacher.role !== "TEACHER") {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        const safeTeacher = fixBigInt(teacher);

        return res.status(200).json({ teacher: safeTeacher });
    } catch (error) {
        console.error('❌ Error fetching teacher by ID:', error);
        res.status(500).json({ message: '💔 Internal server error' }
        )
    };
}
export const editTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, subject, experience, phone } = req.body;
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (!name || !email || !subject || !experience || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const teacher = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { teacherProfile: true }
        });
        if (!teacher || teacher.role !== "TEACHER") {
            return res.status(404).json({ message: "Teacher not found" });
        }
        const updatedTeacher = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
                name: name || teacher.name,
                email: email || teacher.email,
                teacherProfile: {
                    update: {
                        subject: subject || teacher.teacherProfile.subject,
                        experience: experience !== undefined ? experience : teacher.teacherProfile.experience,
                        phone: phone || teacher.teacherProfile.phone
                    }
                }
            }
        });
        return res.status(200).json({
            message: "Teacher updated successfully",
            teacher: fixBigInt(updatedTeacher)
        });

    } catch (error) {
        console.error("❌ Edit Teacher Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeTeacherById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }

        const teacher = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { teacherProfile: true }
        });

        if (!teacher || teacher.role !== "TEACHER") {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // 1. clear foreign key อื่นก่อน (ตัวอย่าง)
        await prisma.course.updateMany({
            where: { teacherId: BigInt(id) },
            data: { teacherId: null }
        });

        // 2. ลบ teacher profile
        if (teacher.teacherProfile) {
            await prisma.teacherProfile.delete({
                where: { id: teacher.teacherProfile.id }
            });
        }

        // 3. ลบ user record
        await prisma.user.delete({
            where: { id: BigInt(id) }
        });

        return res.status(200).json({ message: "Teacher deleted successfully" });

    } catch (error) {
        console.error("❌ Delete Teacher Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



// Student Controllers
export const craeteStudent = async (req, res) => {
    try {
        const { name, email, password, gradeLevel, classroom, phone, image } = req.body;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (!name || !gradeLevel || !email || !password || !classroom || !phone || !image) {
            return res.status(400).json({ message: "Name, email, gradeLevel, and classroom are required" });
        }
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newTeacher = await prisma.user.create({
            data: {
                name: name,
                email,
                password: hashedPassword,
                role: "STUDENT",
                studentProfile: {
                    create: {
                        gradeLevel,
                        classroom: classroom || 0,
                        phone: phone || "",
                        image: image || [],
                    }
                }
            }
        });
        return res.status(200).json({ message: "student created successfully", user: fixBigInt(newTeacher) });
    } catch (error) {
        console.error('❌ student created error:', error);
        res.status(500).json({ message: '💔 Internal server error' });
    }
};
export const getStudents = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        const student = await prisma.user.findMany({
            where: { role: "STUDENT" },
            include: { studentProfile: true }
        });
        const safestudent = fixBigInt(student);
        return res.status(200).json({ student: safestudent });
    } catch (error) {
        console.error('❌ Error fetching student:', error);
        res.status(500).json({ message: '💔 Internal server error' });
    }
}
export const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const student = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { studentProfile: true }
        });
        if (!student || student.role !== "STUDENT") {
            return res.status(404).json({ message: 'student not found' });
        }
        const safeStudent = fixBigInt(student);

        return res.status(200).json({ student: safeStudent });
    } catch (error) {
        console.error('❌ Error fetching student by ID:', error);
        res.status(500).json({ message: '💔 Internal server error' }
        )
    };
}
export const editStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, gradeLevel, classroom, phone, image } = req.body;
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const student = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { studentProfile: true }
        });
        if (!student || student.role !== "STUDENT") {
            return res.status(404).json({ message: "student not found" });
        }

        const updatedStudent = await prisma.user.update({
            where: { id: BigInt(id) },
            data: {
                name: name,
                email: email || student.email,
                studentProfile: {
                    upsert: {
                        update: {
                            classroom: classroom || student.studentProfile.classroom,
                            gradeLevel: gradeLevel !== undefined ? gradeLevel : student.studentProfile.gradeLevel,
                            image: image || student.studentProfile.image,
                            phone: phone || student.studentProfile.phone
                        },
                        create: {
                            classroom: classroom,
                            gradeLevel: gradeLevel,
                            image: image,
                            phone: phone
                        }

                    }
                }
            }
        });
        return res.status(200).json({
            message: "Student updated successfully",
            student: fixBigInt(updatedStudent)
        });

    } catch (error) {
        console.error("❌ Edit Teacher Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const removeStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user || req.user.role !== "ADMIN") {

            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const student = await prisma.user.findUnique({
            where: { id: BigInt(id) },
            include: { studentProfile: true }
        });

        if (!student || student.role !== "STUDENT") {
            return res.status(404).json({ message: "student not found" });
        }
        if (student.studentProfile) {
            await prisma.studentProfile.delete({
                where: { id: student.studentProfile.id }

            });
        }
        await prisma.user.delete({
            where: { id: BigInt(id) }
        });

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error("❌ Delete Student Error:", error);

        res.status(500).json({ message: "Internal server error" });
    }
};

//  Course Controllers
export const createCourse = async (req, res) => {
    try {

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: ADMIN only" });
        }

        const {
            title,
            description,
            price,
            image,
            teacherId,
            categoryId,
            type
        } = req.body;

        if (!title || !description || !price || !teacherId || !categoryId || !type) {
            return res.status(400).json({
                message: "title, description, price, teacherId are required"
            });
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: "Price must be a positive number" });
        }
        const teacher = await prisma.user.findUnique({
            where: { id: BigInt(teacherId) }
        });

        if (!teacher || teacher.role !== "TEACHER") {
            return res.status(404).json({ message: "Teacher not found" });
        }

        if (categoryId) {
            const category = await prisma.category.findUnique({
                where: { id: BigInt(categoryId) }
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        const newCourse = await prisma.course.create({
            data: {
                title,
                description,
                price: Number(price),
                image: image,
                teacherId: BigInt(teacherId),
                categoryId: categoryId ? BigInt(categoryId) : null,
                type: type.toUpperCase() || null
            },
            include: {
                teacher: true,
                category: true
            }
        });

        return res.status(201).json({
            message: "Course created successfully",
            course: fixBigInt(newCourse)
        });

    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({ message: "Course title already exists" });
        }
        console.error("❌ Create Course Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const getCourses = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: ADMIN only" });
        }
        const courses = await prisma.course.findMany({
            include: {
                teacher: true,
                category: true
            }
        });
        const safeCourses = fixBigInt(courses);
        return res.status(200).json({ courses: safeCourses });
    } catch (error) {
        console.error("❌ Get Courses Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: ADMIN only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        const course = await prisma.course.findUnique({
            where: { id: BigInt(id) },
            include: {
                teacher: true,
                category: true
            }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const safeCourse = fixBigInt(course);
        return res.status(200).json({ course: safeCourse });

    } catch (error) {
        console.error("❌ Get Course By ID Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const editCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, thumbnail, level, teacherId, categoryId } = req.body;
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: ADMIN only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const course = await prisma.course.findUnique({
            where: { id: BigInt(id) }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const updatedCourse = await prisma.course.update({
            where: { id: BigInt(id) },
            data: {
                title: title || course.title,
                description: description || course.description,
                price: price !== undefined ? Number(price) : course.price,
                thumbnail: thumbnail || course.thumbnail,
                level: level || course.level,
                teacherId: teacherId ? BigInt(teacherId) : course.teacherId,
                categoryId: categoryId ? BigInt(categoryId) : course.categoryId
            }
        });
        return res.status(200).json({
            message: "Course updated successfully",
            course: fixBigInt(updatedCourse)
        });
    } catch (error) {
        console.error("❌ Edit Course Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const removeCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: ADMIN only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const course = await prisma.course.findUnique({
            where: { id: BigInt(id) }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await prisma.course.delete({
            where: { id: BigInt(id) }
        });
        return res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error("❌ Delete Course Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
// Student Enroll Controllers
export const enRollment = async (req, res) => {
    if (req.user.role !== "STUDENT") {
        return res.status(403).json({ message: "Access denied: STUDENT only" });
    }
    const { courseId, status } = req.body;
    if (isNaN(courseId)) {
        return res.status(400).json({ message: "Invalid course ID" });
    }
    try {
        const course = await prisma.course.findUnique({
            where: { id: BigInt(courseId) }
        });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const exist = await prisma.enrollment.findFirst({
            where: {
                userId: BigInt(req.user.id),
                courseId: BigInt(courseId)
            }
        });
        if (exist) {
            return res.status(409).json({ message: "Already enrolled in this course" });
        }
        const enrollment = await prisma.enrollment.create({
            data: {
                userId: BigInt(req.user.id),
                courseId: BigInt(courseId),
                status: status || "ENROLLED",  // ลงทะเบียนแล้ว
            }
        });
        return res.status(200).json({
            message: "Enrolled successfully",
            enrollment: fixBigInt(enrollment)
        });
    } catch (error) {
        console.error("❌ Create Enrollment Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getEnrollments = async (req, res) => {
    if (req.user.role !== "STUDENT") {
        return res.status(403).json({ message: "Access denied: STUDENT only" });
    }
    try {
        const enrollments = await prisma.enrollment.findMany({
            where: { userId: BigInt(req.user.id) },
            include: { course: true }
        });
        const safeEnrollments = fixBigInt(enrollments);
        return res.status(200).json({ enrollments: safeEnrollments });
    } catch (error) {
        console.error("❌ Get Enrollments Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const removeEnrollmentById = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.role !== "STUDENT") {
            return res.status(403).json({ message: "Access denied: STUDENT only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const enrollment = await prisma.enrollment.findUnique({
            where: { id: BigInt(id) }
        });
        if (!enrollment || enrollment.userId !== BigInt(req.user.id)) {
            return res.status(404).json({ message: "Enrollment not found" });
        }
        await prisma.enrollment.delete({
            where: { id: BigInt(id) }
        });
        return res.status(200).json({ message: "Enrollment deleted successfully" });

    } catch (error) {
        console.error("❌ Delete Enrollment Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Teacher Lesson Controllers
export const addLesson = async (req, res) => {
    try {
        const courseId = BigInt(req.params.courseId);
        const teacherId = BigInt(req.user.id);
        const { title, content, videoUrl } = req.body;

        if (!req.user || req.user.role !== "TEACHER") {
            return res.status(403).json({ message: "Access denied: Teacher only" });
        }

        if (!title) {
            return res.status(400).json({ message: "Lesson title is required" });
        }

        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.teacherId && course.teacherId !== teacherId) {
            return res.status(403).json({ message: "You are not the owner of this course" });
        }

        const lessonauto = await prisma.lesson.findFirst({
            where: { courseId: courseId },
            orderBy: { sortOrder: 'desc' }
        });

        const nextSortOrder = lessonauto ? lessonauto.sortOrder + 1 : 1;

        const lesson = await prisma.lesson.create({
            data: {
                title,
                content,
                videoUrl,
                courseId,
                sortOrder: nextSortOrder
            }
        });

        return res.status(201).json({
            message: "Lesson added successfully",
            lesson: fixBigInt(lesson)
        });
    } catch (error) {
        console.error("Add Lesson Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getLessons = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "TEACHER") {
            return res.status(403).json({ message: "Access denied: Teacher only" });
        }
        const lessons = await prisma.lesson.findMany({
            where: { course: { teacherId: req.user.id } }
        });
        const safeLessons = fixBigInt(lessons);
        return res.status(200).json({ lessons: safeLessons });
    } catch (error) {
        console.error("Get Lessons Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const editLeesonById = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, videoUrl } = req.body;
        if (!req.user || req.user.role !== "TEACHER") {
            return res.status(403).json({ message: "Access denied: Teacher only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const lesson = await prisma.lesson.findUnique({
            where: { id: BigInt(id) },
            include: { course: true }
        });
        if (!lesson || lesson.course.teacherId !== BigInt(req.user.id)) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        const updatedLesson = await prisma.lesson.update({
            where: { id: BigInt(id) },
            data: {
                title: title || lesson.title,
                content: content || lesson.content,
                videoUrl: videoUrl || lesson.videoUrl
            }
        });
        return res.status(200).json({
            message: "Lesson updated successfully",
            lesson: fixBigInt(updatedLesson)
        });
    } catch (error) {
        console.error("Edit Lesson Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const removeLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!req.user || req.user.role !== "TEACHER") {
            return res.status(403).json({ message: "Access denied: Teacher only" });
        }
        if (isNaN(id)) {
            return res.status(400).json({ message: "Invalid ID" });
        }
        const lesson = await prisma.lesson.findUnique({
            where: { id: BigInt(id) },
            include: { course: true }
        });
        if (!lesson || lesson.course.teacherId !== BigInt(req.user.id)) {
            return res.status(404).json({ message: "Lesson not found" });
        }
        await prisma.progress.deleteMany({
            where: { lessonId: BigInt(id) }
        });
        await prisma.lesson.delete({
            where: { id: BigInt(id) }
        });
        return res.status(200).json({ message: "Lesson deleted successfully" });
    } catch (error) {
        console.error("Delete Lesson Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// dashboard controller
export const getDashboardSummary = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: ADMIN only" });
        }

        const totalUsers = await prisma.user.count();
        const totalTeachers = await prisma.user.count({ where: { role: "TEACHER" } });
        const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
        const totalCourses = await prisma.course.count();
        const totalEnrollments = await prisma.enrollment.count();

        return res.status(200).json({
            totalUsers,
            totalTeachers,
            totalStudents,
            totalCourses,
            totalEnrollments
        });

    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getEnrollmentStats = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: ADMIN only" });
        }

        // ดึงข้อมูล course พร้อมนับจำนวน enrollments
        const stats = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                _count: { select: { enrollments: true } } // นับ enrollment สำหรับแต่ละคอร์ส
            },
            orderBy: {
                enrollments: { _count: 'desc' } // เรียงจากมากไปน้อย
            }
        });


        return res.status(200).json({ enrollmentStats: fixBigInt(stats) });

    } catch (error) {
        console.error("Enrollment Stats Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
// categories 
export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        res.status(200).json({ categories: fixBigInt(categories) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const createCategories = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" })
        }

        let { name } = req.body
        const image = req.file ? `/uploads/categories/${req.file.filename}` : null


        if (!name) {
            return res.status(400).json({ message: "Category name is required" })
        }

        name = name.trim().toLowerCase()

        const existCategory = await prisma.category.findUnique({
            where: { name }
        })

        if (existCategory) {
            return res.status(400).json({ message: "Category ซ้ำ" })
        }

        const category = await prisma.category.create({
            data: {
                name,
                image
            }
        })

        return res.status(201).json({
            message: "Category added successfully",
            category: fixBigInt(category)
        })

    } catch (error) {
        console.error("Create Category Error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const updateCategory = async (req, res) => {
    try {
        // 🔐 Role check
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" })
        }

        const { id } = req.params
        let { name } = req.body

        if (!name || !name.trim()) {
            return res.status(400).json({ message: "Category name is required" })
        }

        name = name.trim().toLowerCase()

        // 🔎 หา category เดิม
        const category = await prisma.category.findUnique({
            where: { id: Number(id) }
        })

        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        // 🔁 เช็คชื่อซ้ำ (ยกเว้นตัวเอง)
        const duplicate = await prisma.category.findFirst({
            where: {
                name,
                NOT: { id: Number(id) }
            }
        })

        if (duplicate) {
            return res.status(400).json({ message: "Category ซ้ำ" })
        }

        let newImage = category.image

        // 🖼️ ถ้ามีอัปโหลดรูปใหม่
        if (req.file) {
            newImage = `/uploads/categories/${req.file.filename}`

            // 🧹 ลบรูปเก่า
            if (category.image) {
                const oldPath = path.join(
                    process.cwd(),
                    category.image.replace("/", "")
                )

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)
                }
            }
        }

        // ✅ update
        const updated = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name,
                image: newImage
            }
        })

        return res.status(200).json({
            message: "Category updated successfully",
            category: fixBigInt(updated)
        })

    } catch (error) {
        console.error("Update Category Error:", error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const removeCategories = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Access denied: Admin only" });
        }
        const { id } = req.params
        if (!id) return res.status(400).json({ message: "ID not Found!" });
        const category = await prisma.category.delete({
            where: { id: id }
        })
        res.status(200).json({ message: "Delete Succssesfuly!", category: fixBigInt(category) })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}



