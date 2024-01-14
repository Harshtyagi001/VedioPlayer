import express, { urlencoded } from "express"
import cors from "cors";
import cookieParser from 'cookie-parser';


const app = express();

app.use(cors({
  origin: "process.env.CORS_ORIGIN",
  credentials: true
}))

app.use(express.json({limit:'32kb'}))
app.use(urlencoded({limit:'32kb',extended:true}))
app.use(express.static("public"))  // name of folder where we put our static files
app.use(cookieParser())

export default app;