

import mongoose from "mongoose"



const UserSchema = new mongoose.Schema({
    userName: {
        type:String,
        minLength:3,
    }, // String is shorthand for {type: String}
    // profilepicture:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:'Image',   
    //     required:true
    
    
    // },
    email:{
        type:String,
        unique:true,
    },
    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
    password: String,
    isEmailVerfied:{
        type:Boolean,
        default:false,


    },

    

});


const UserModel = mongoose.model('User', UserSchema);

export default UserModel