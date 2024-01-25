import { catchError ,AppError} from "../../../utils/erroer.handler.ts";
import PostModel from "../models/posts.model.ts";

const isexistingPost = catchError(async(req,res,next)=>{

    const { PostID } = req.params

    // Check if the task with the provided taskID exists
    const existingPost = await PostModel.findById(PostID);

    if (!existingPost) {
        throw new AppError('Post not found', 404);
    }
    
    next()
})
export { 
    isexistingPost
}