import { Router } from "express"
import { getCategories, getPublicCourses, getPublicCourseById } from "../controllers/mainHomepage.js";
const router = Router()

router.get("/categories", getCategories)
router.get("/courses", getPublicCourses)
router.get("/courses/:id", getPublicCourseById)
export default router;