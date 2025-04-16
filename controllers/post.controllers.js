import { Post } from "../models/Post.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Joi from "joi";
const postJoiSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title must be less than 100 characters",
  }),

  content: Joi.string().min(10).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters long",
  }),
});

const createPost = async (req, res) => {
  const { error } = postJoiSchema.validate(req.body);
  if (error) {
    const errors = error.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    res.status(400).json({ errors });
  } else {
    const { title, content } = req.body;

    const createSlug = (title) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .replace(/\s+/g, "-") // replace spaces with dashes
        .replace(/-+/g, "-"); // remove duplicate dashes
    };
    let slug = createSlug(title);
    const existedSlug = await Post.findOne({ slug });
    if (existedSlug) {
      slug = `${slug}-${Date.now()}`;
    }
    const imagePath = req.files?.image?.[0]?.path;
    if (!imagePath) {
      res.status(400).send("Please send a image");
    } else {
      const img = await uploadOnCloudinary(imagePath);
      const userid = req.params.userid;

      console.log(userid);
      const post = await Post.create({
        title,
        slug,
        user: userid,
        image: img.url,
        content,
      });
      if (!post) {
        console.log("Post not created");
        res.status(400).send("Post was not created!");
      } else {
        console.log("Post created successfully");
        res.status(200).send(post);
      }
    }
  }
};

const getAllPost = async (req, res) => {
  const posts = await Post.find({ isDeleted: false });
  if (!posts) {
    res.status(400).send("Error, please try again!");
  } else {
    res.status(200).json({ data: posts, total: posts.length });
  }
};

const particularPost = async (req, res) => {
  const postId = req.params.id;
  console.log(postId);
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) {
    res.status(400).send("No Post found with this ID.");
  } else {
    res.status(200).send(post);
  }
};

const deletePost = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findByIdAndUpdate(postId, {
    isDeleted: true,
  });
  if (!post) {
    res.status(400).send("Sorry wasn't able to delete post!");
  } else {
    res.status(200).send("Successfully deleted the post.");
  }
};

const getUserPost = async (req, res) => {
  const userid = req.params.userid;
  const posts = await Post.find({ user: userid, isDeleted: false });

  if (!posts) {
    res.status(400).send("No Post found with this user id");
  } else {
    res.status(200).send(posts);
  }
};

const updatePost = async (req, res) => {
  const { title, content } = req.body;
  const imageFilePath = req.files?.image?.[0]?.path;
  const postid = req.params.postid;
  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (imageFilePath) {
    const uploadedImage = await uploadOnCloudinary(imageFilePath);
    updateData.image = uploadedImage.url;
  }
  if (Object.keys(updateData).length === 0) {
    return res.status(400).send("No data provided for update");
  }
  const post = await Post.findOneAndUpdate(
    { _id: postid, isDeleted: false },
    { $set: updateData },
    { new: true }
  );

  if (post) {
    res.status(200).send(post);
  } else {
    res.status(400).send("Could not update");
  }
};

// const updatePost = async(req,res)=>{

//     const postId = req.params.id
//     const post = await Post.findById(postId)
//     post.content =
// }
export {
  createPost,
  getAllPost,
  particularPost,
  deletePost,
  getUserPost,
  updatePost,
};
