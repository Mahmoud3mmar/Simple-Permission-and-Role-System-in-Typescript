import jwt from "jsonwebtoken"
import { AppError, catchError } from "../../../utils/erroer.handler.js"
import UserModel from "../../users/models/user.model.js"
import bcrypt from 'bcrypt'
import transporter from "../../../utils/email.js"



const SignIN = catchError( async (req,res)=>{


 const {email,password}=req.body
 const user = await UserModel.findOne({email})

 const {userName,_id}=user

 const token = jwt.sign({userName,_id},'shhh',
 {expiresIn:'1h'})

 if(user && bcrypt.compareSync(password,user.password)){

    return res.json({message:'signed in sucessfully',token})
 }

    throw new AppError('invalid credentials!!!',400)
})

const SignUp =catchError(async (req,res)=>{



  const { userName,email,password } =req.body
  console.log('Recipient userName:', userName);

    console.log('Recipient Email:', email);

    const email_token=jwt.sign({email},process.env.SECRET)
    const link = process.env.BASE_URL +`api/v1/auth/confirmEmail/${email_token}`
    // Send email for verification
    await transporter.sendMail({
      from: process.env.email,
      to: email,
      subject: "Email Confirmation",
      text: 'Confirm Your Email',
      html: `<a href="${link}">Click here to verify your email</a>`,
    });
    const hashedpassword=bcrypt.hashSync(password,5)

    await UserModel.create({userName,email,password:hashedpassword})

    res.status(201).json({message:'signed up Sucessfully'})
})



const Logout = catchError(async (req, res) => {
    const{id}=req.params
    const { token } = req.body;
  
    await UserModel.findByIdAndUpdate(id, {
      $addToSet: { blacklistedTokens: token },
    });
  
    res.json({ message: 'Logged out successfully' });
  });
export{

    SignIN,
    SignUp,
    Logout
}