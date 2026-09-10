import { Router } from "express";
import {
 createCategory,
 getAllCategories,
 getCategoryById,
 getCategoryBySlug,
 updateCategory,
 deleteCategory,
} from "../controllers/categoryController";
import { protectAdmin } from "../middleware/auth.middleware";

const router = Router();

// Base Routes (/api/categories)
router
 .route("/")
 .get(getAllCategories)
 .post(protectAdmin, createCategory);

// Slug specific route MUST be defined before /:id to prevent Express from treating "slug" as an ID
router.route("/slug/:slug").get(getCategoryBySlug);

// ID specific routes (/api/categories/:id)
router
 .route("/:id")
 .get(getCategoryById)
 .patch(protectAdmin, updateCategory)
 .delete(protectAdmin, deleteCategory);

export default router;
