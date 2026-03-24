import e from "express"
import { routerAuth } from "./Router/authRouter.js"
import cors from 'cors'
const app=e()
const port=8000

app.use(cors());


app.use(e.json())
app.use("/auth",routerAuth)

app.listen(port,()=>{
    console.log(port)
})