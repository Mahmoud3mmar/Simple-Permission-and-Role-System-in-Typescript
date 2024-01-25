import {Router} from "express"

import {GetAllPosts,AddPost ,DeletePost,UpdatePost,GetAllPostsWithOwnersInfo,GetPostsForUserWithUserData} from "../controllers/posts.controller.ts"
import { authenticate, authorize } from "../../Auth/middlewares/auth.middleware.ts"
import { isexistingPost } from "../middlewares/posts.middlware.ts"
const router= Router()

// Route to get all posts and add a new post
router.route('/').get(GetAllPosts)

// Route to get all posts with owners' information

router.route('/GetAllPostsWithOwnersInfo').get(authenticate,authorize('Admin'),GetAllPostsWithOwnersInfo)


router.route('/:id')
// Route to delete a post by ID (requires authentication, authorization, and checking if the post exists)
.delete(authenticate,authorize('Admin'),isexistingPost,DeletePost)
// Route to update a post by ID (requires authentication and authorization)
.put(authenticate,authorize('User'),UpdatePost)
// Additional route to add a new post (requires authentication and authorization)
.post(authenticate,authorize('User'),AddPost)
.get(authenticate,authorize('Admin'),GetPostsForUserWithUserData)

export default router