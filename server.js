import e from "express"
import { routerAuth } from "./Router/authRouter.js"
import cors from 'cors'
const app=e()
const port=8000

app.use(cors());


app.use(e.json())
app.use("/auth",routerAuth)
app.get('/api/message',(req,res)=>{

    return res.json({text:"helloe bitikoye ke back end neng yene mist"})



})

app.listen(port,()=>{
    console.log(port)
})