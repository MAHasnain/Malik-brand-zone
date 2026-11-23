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

router
 .route("/")
 .get(getAllCategories)
 .post(protectAdmin, createCategory);

router.route("/slug/:slug").get(getCategoryBySlug);

// ID specific routes (/api/categories/:id)
router
 .route("/:id")
 .get(getCategoryById)
 .put(protectAdmin, updateCategory)
 .patch(protectAdmin, updateCategory)
 .delete(protectAdmin, deleteCategory);

export default router;