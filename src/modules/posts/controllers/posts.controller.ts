

import PostModel from '../models/posts.model.ts'
import UserModel from '../../users/models/user.model.ts'
import { AppError, catchError } from '../../../utils/erroer.handler.ts'

// Function to get all posts
const GetAllPosts = catchError( async (req,res)=>{
   
       const data = await PostModel.find()
       res.json({data})
   
})


// Function to add a new post
const AddPost= catchError(async (req, res) => {
    const{_id}=req.user // Assuming user ID is in the request
    const { title,content }=req.body

    // Check if the user with the provided userID exists
    const existingUser = await UserModel.findById(_id);

    if (!existingUser) {
        throw new AppError('User not found', 404);
    }

    const newPost = await PostModel.create({
        title,
        content,
        userID:_id
       
    });

    res.json({ Post: newPost});
});


// Function to delete a post by ID
const DeletePost = catchError(async (req, res) => {
    const { PostID } = req.params
    // Use Mongoose's findOneAndDelete method to delete the post
    const deletedPost = await PostModel.findOneAndDelete(PostID);

    res.json({ Post: deletedPost });
});



// Function to update a post by ID

const UpdatePost = catchError(async (req, res) => {

    const {userID} = req.params
    const { PostID,title, content} = req.body;

    // Check if the Post with the provided PostID exists
    const existingPost = await PostModel.findById(PostID);

    if (!existingPost) {
        throw new AppError('Post not found', 404);
    }

    // Check if the current user is the creator of the post
    if (String(existingPost.userID) !== String(userID)) {
        throw new AppError('Permission denied. You are not the creator of this Post.', 403);
    }

    
    // Use findOneAndUpdate to set the specified fields
    const updatedPost = await PostModel.findOneAndUpdate(
        { _id: PostID },
        { $set: title, content  },
        { new: true } // Return the modified document
    );

    res.json({ Post: updatedPost });
});



// Function to get all posts with owner's information

const GetAllPostsWithOwnersInfo = catchError(async (req, res) => {
    
        const postsWithOwners = await PostModel.find().populate('userID');

        res.json({ postsWithOwners });
    
});

// Function to get posts for a user with user data
const GetPostsForUserWithUserData = catchError(async (req, res) => {
    const { userID } = req.params; // Assuming you get the userID from the request parameters

    const existingUser = await UserModel.findById(userID);
    if (!existingUser) {
        throw new AppError('User not found', 404);
    }

    const PostsForUser = await PostModel.find({ userID }).populate('userID');

    res.json({ Posts: PostsForUser });
});


export{
    GetAllPosts ,
    AddPost,
    DeletePost,
    UpdatePost,
    GetAllPostsWithOwnersInfo,
    GetPostsForUserWithUserData
    
}