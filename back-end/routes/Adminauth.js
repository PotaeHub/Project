import express from 'express';
import { verifyAuthToken } from '../middlewares/authToken.js';
import { refresh } from '../controllers/refresh.js';
import multer from "multer"

import {


    // Users
    getUserId, getUsers, getProfile, updateUser, deleteUser, createUser,

    // Teachers
    craeteTeacher, getTeachers, getTeacherById, editTeacherById, removeTeacherById,

    // Students
    craeteStudent, getStudents, getStudentById, editStudentById, removeStudentById,

    // Courses
    createCourse, getCourses, getCourseById, editCourseById, removeCourseById,

    // Enrollment
    enRollment, getEnrollments, removeEnrollmentById,

    // Lessons
    addLesson, getLessons, editLeesonById, removeLessonById,

    // Dashboard
    getDashboardSummary, getEnrollmentStats,

    // Categories
    getCategories, createCategories, removeCategories, updateCategory
} from '../controllers/Adminusers.js';
import {
    // Auth
    loginAdmin, logout,
} from '../controllers/auth.js'
const router = express.Router();
import { diskUpload } from "../services/upload.js"

/* ============================================================
    🔐 Admin Authentication
============================================================ */
router.post('/admin/login', loginAdmin)
router.post('/admin/refresh', refresh)
router.post('/admin/logout', logout)

/* ============================================================
    👤 Admin Users
============================================================ */
router.get('/admin/users', verifyAuthToken, getUsers)
router.post('/admin/create', verifyAuthToken, createUser)
router.get('/admin/profile', verifyAuthToken, getProfile)
router.get('/admin/user/:id', verifyAuthToken, getUserId)
router.put('/admin/user/:id', verifyAuthToken, updateUser)
router.delete('/admin/user/:id', verifyAuthToken, deleteUser)

/* ============================================================
    👨‍🏫 Teachers
============================================================ */
router.post('/admin/teacher', verifyAuthToken, craeteTeacher)
router.get('/admin/teachers', verifyAuthToken, getTeachers)
router.get('/admin/teacher/:id', verifyAuthToken, getTeacherById)
router.put('/admin/teacher/:id', verifyAuthToken, editTeacherById)
router.delete('/admin/teacher/:id', verifyAuthToken, removeTeacherById)

/* ============================================================
    🎓 Students
============================================================ */
router.post('/admin/student', verifyAuthToken, craeteStudent)
router.get('/admin/students', verifyAuthToken, getStudents)
router.get('/admin/student/:id', verifyAuthToken, getStudentById)
router.put('/admin/student/:id', verifyAuthToken, editStudentById)
router.delete('/admin/student/:id', verifyAuthToken, removeStudentById)

/* ============================================================
    📚 Courses
============================================================ */
router.post('/admin/course/create', verifyAuthToken, createCourse)
router.get('/admin/courses', verifyAuthToken, getCourses)
router.get('/admin/course/:id', verifyAuthToken, getCourseById)
router.put('/admin/course/:id', verifyAuthToken, editCourseById)
router.delete('/admin/course/:id', verifyAuthToken, removeCourseById)

/* ============================================================
    🧾 Enrollment
============================================================ */
router.post('/student/enroll', verifyAuthToken, enRollment)
router.get('/student/enrolls', verifyAuthToken, getEnrollments)
router.delete('/student/enroll/:id', verifyAuthToken, removeEnrollmentById)

/* ============================================================
    📘 Teacher → Lessons
============================================================ */
router.post('/teacher/course/:courseId/add-lesson', verifyAuthToken, addLesson)
router.get('/teacher/my-courses', verifyAuthToken, getLessons)
router.put('/teacher/lesson/:id', verifyAuthToken, editLeesonById)
router.delete('/teacher/lesson/:id', verifyAuthToken, removeLessonById)

/* ============================================================
    📊 Dashboard Stats
============================================================ */
router.get('/admin/dashboard/summary', verifyAuthToken, getDashboardSummary)
router.get('/admin/dashboard/enrollment-stats', verifyAuthToken, getEnrollmentStats)

/* ============================================================
    🏷️ Categories
============================================================ */
router.get('/admin/categories', verifyAuthToken, getCategories)
router.post('/admin/categories/create', verifyAuthToken, diskUpload.single("image"), createCategories)
router.delete('/admin/categories/:id', verifyAuthToken, removeCategories)
router.put('/admin/categories/:id', verifyAuthToken, updateCategory)

export default router;
