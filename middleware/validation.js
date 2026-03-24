import z, { email } from "zod";
export const SignupValidation=z.object({
email:z.string().email({message:"Invalid email address"}),
password:z.string().min(8,{ message: "Password must be at least 8 characters long" })
.regex(/^(?=.*[a-z])(?=.*[A-S])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    }),
role:z.enum(["CUSTOMER","SELLER",  "ADMIN"],{
   errorMap: () => ({ message: "Please select a valid role: CUSTOMER, SELLER, or ADMIN" })
}),
businessName:z.string().min(1,{message:"enter business name"}).optional(),
description:z.string().min(50,{message:"enter business description name"}).optional(),
address:z.string().optional(),
bussType:z.string().optional()
  

}).refine((data)=>{
  if(data.role==="SELLER"){
    return data.businessName || data.description || data.address || data.bussType
  }
  return true

},{
  message: "Sellers must provide business name and description",
  path: ["businessName"] 
})

export const verificationCodeValidation=z.object({
  email:z.string().email(),
  inputCode:z.string().min(6,{message:"code lenght must 6 digit"})

})