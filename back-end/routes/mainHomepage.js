import { Router } from "express"
import { getCategories, getPublicCourses, getPublicCourseById, getCourseReviews, createReview } from "../controllers/mainHomepage.js";
import { verifyAuthToken } from "../middlewares/authToken.js";
const router = Router()

router.get("/categories", getCategories)
router.get("/courses", getPublicCourses)
router.get("/courses/:id", getPublicCourseById)

// Reviews
router.get("/courses/:id/reviews", getCourseReviews)
router.post("/reviews", verifyAuthToken, createReview)

export default router;