import { Router } from "express";
import {
 listBanners,
 publishBanner,
 removeBanner,
} from "../controllers/bannerController";
import { protectAdmin } from "../middleware/auth.middleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();
router.get("/", listBanners);
router.post("/", protectAdmin, upload.single("image"), publishBanner);
router.delete("/:id", protectAdmin, removeBanner);

export default router;
