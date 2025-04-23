import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  particularPost,
  getUserPost,
  updatePost,
} from "../controllers/post.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router()

router.route("/post/:userid").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    }
  ]),
  createPost
);
router.route("/getPost").get(getAllPost)
router.route("/getPost/:id").get(particularPost)
router.route("/deletePost/:id").get(deletePost)
router.route("/getUserPost/:userid").get(getUserPost);
router.route("/updatePost/:postid").put(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updatePost
);
export default router