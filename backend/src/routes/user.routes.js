import {Router} from "express"
import { loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router=Router();

router.post("/register",upload.fields([
 {name:'avatar', maxCount:1},{name:'coverImage',maxCount:1}
]),registerUser)

router.post("/login",loginUser)

// Secured Routes
router.post("/logout",verifyJWT,logOutUser) // can add multiple middlewares, next tells to go to next middleware

router.post("/refreshToken",refreshAccessToken)  // if needed, can do verifyJWT here too

export default router;