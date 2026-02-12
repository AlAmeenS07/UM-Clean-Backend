
import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes"
dotenv.config()


const app = express()

app.use(express.json())
app.use(cookieParser())

app.get("/" , (req , res)=>{
    res.send("Hello !")
})

app.use("/api/v1/user", userRoutes);



app.listen(process.env.PORT , ()=>{
    console.log(`Server connected : http://localhost:${process.env.PORT}`)
})