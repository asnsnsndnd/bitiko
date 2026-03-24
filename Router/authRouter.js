import e, { Router } from "express"
import { SignUp,VerificationCode ,ReSendCode} from "../Control/AuthControl.js"
export const routerAuth=e.Router()

routerAuth.post('/signup',SignUp)
routerAuth.post('/VerificationCode',VerificationCode)
routerAuth.post('/reSend',ReSendCode)
