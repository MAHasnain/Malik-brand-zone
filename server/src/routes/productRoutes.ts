import { Router } from "express";
import {
 createProduct,
 getProducts,
 getProductById,
 getProductBySlug,
 updateProduct,
 deleteProduct,
} from "../controllers/productController";
import { upload } from "../middleware/uploadMiddleware";
import { protectAdmin } from "../middleware/auth.middleware";

const router = Router();

router
 .route("/")
 .get(getProducts)
 .post(
    protectAdmin,  
    upload.array("images", 3),
    createProduct
);

router.route("/slug/:slug").get(getProductBySlug);

router
 .route("/:id")
 .get(getProductById)
 .patch(protectAdmin, upload.array("images", 3), updateProduct)
 .delete(protectAdmin, deleteProduct);

export default router;
