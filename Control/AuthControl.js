import { PrismaClient} from "@prisma/client"
import { SignupValidation,verificationCodeValidation } from "../middleware/validation.js"
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { create } from "domain";
import { SendMail } from "../middleware/sendVerficationCode.js";
import jwt from "jsonwebtoken";
import { json, safeParse } from "zod";

  const prisma= new PrismaClient()


export const SignUp=async(req,res)=>{

   const {email,password,role,businessName,description,address,bussType }=req.body
    let createdRecordId=null
try{
 

const result= SignupValidation.safeParse(req.body)
if(!result.success) return res.status(400).json({msg:result.error.flatten().fieldErrors,ok:false});
const emailFound=await prisma.user.findUnique({where:{email}})
if(emailFound) return res.status(400).json({msg:"email is already register",ok:false})

const rawcode=crypto.randomInt(100000,9999999).toString();

 console.log(req.body)
let salt=await bcrypt.genSalt(10)
const hashcode=await bcrypt.hash(rawcode,salt)
const hashPassword=await bcrypt.hash(password,salt)
let userResult=await prisma.$transaction(async(tx)=>{

let user
if(role==="SELLER"){

user=await tx.user.create({data:{email,password:hashPassword,role,businessName,description,address,bussType}})
}else{
   user=await tx.user.create({data:{email,password:hashPassword,role}}) 
}
await tx.verficationCode.create({data:{code:hashcode,UserId:user.id,expiredAt:new Date(Date.now()+60*60*1000)}})

return user


})
 createdRecordId=userResult.id
 await SendMail(userResult.email,rawcode)

return res.status(201).json({msg:"scfuuly account  account create verify your email",ok:true,email:userResult.email})
}
catch(error){
     console.error(error)
     await prisma.user.delete({where:{id:createdRecordId}})
    return res.status(500).json({ msg: "Internal server error", ok: false })
}





}
export const VerificationCode=async(req,res)=>{

   const {email,inputCode}=req.body
   try{
   const result= verificationCodeValidation.safeParse(req.body)
   if(!result.success) return res.status(400).json({msg:result.error.flatten().fieldErrors,ok:false});
  const user=await prisma.user.findUnique({
   where:{email},
   include:{verficationcode:true}
  })
  if(!user) return res.status(404).json({msg:"user not Found",ok:false})
   const lastcode=user.verficationcode[user.verficationcode.length - 1]
     if(!lastcode) return res.status(404).json({ msg: "click resend button", ok: false })
   if(new Date()>lastcode.expiredAt) return res.status(404).json({ msg: "expired verfication code try send again", ok: false })
      const isvalid=bcrypt.compare(inputCode,lastcode.code)
   if(!isvalid) return res.status(400).json({msg:"incorrect code",ok:false})
   await prisma.$transaction(async(tx)=>{
await tx.user.update({where:{email},data:{isVerified:true}})
await tx.verficationCode.deleteMany({where:{UserId:user.id}})
})

const payload={id:user.id,role:user.role}
const token= jwt.sign(
   payload,
process.env.JWT_SECRET,
{expiresIn:"1d"}
)

return res.status(201).json({msg:"succfuly verfiy you account",ok:true,token,user:{email:user.email,role:user.role}})

   }catch(err){
      console.error(err)
      return res.status(500).json({ msg: "Internal server error", ok: false })
   }
   


}
export const ReSendCode=async(req,res)=>{
   const {email}=req.body
   let createdRecordId = null;
   try{
      if(!email) return res.status(400).json({msg:"it is not found",ok:false})

  
   const EmailFound=await prisma.user.findUnique({where:{email}})
   if(!EmailFound) return res.status(404).json({msg:"email not register",ok:false})
      const rawcode=crypto.randomInt(100000,9999999).toString()
    const salt=await bcrypt.genSalt(10)
    const hashCode=await bcrypt.hash(rawcode,salt)
    const  result=await prisma.verficationCode.create({data:{code:hashCode,UserId:EmailFound.id,expiredAt:new Date(Date.now()+60*60*1000)}})
    

    
     createdRecordId=result.id
      await SendMail(email,rawcode)
       return  res.status(201).json({msg:"succflly resend code please check your email",ok:true})
   
      


   }catch(err){

      console.log(err);
      return res.status(500).json({ msg: "Internal server error", ok: false })
      await prisma.verficationCode.delete({where:{id:createdRecordId}})
   }





}
// export const login=async(req,res)=>{

//        const {email,password}=req.body
//        const result=LoginValidation.safeParse(req.body)

//      if(!result.success) return res.status(400).json({msg:result.error.flatten().fieldErrors,ok:false});
//      const emailFound=await prisma.user.findUnique({where:{email}});

//      if(!emailFound) return res.status(400).json({msg:"email not found",ok:false})

//       const match=bcrypt.compare(password,emailFound.password);

//       if(!match) return stausw



      



       




// }