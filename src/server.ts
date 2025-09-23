import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from "dotenv";
import pino from "pino";
import expressPino from "express-pino-logger";

dotenv.config()
const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  },
});
const app = express();

app.use(morgan('combined'))

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(expressPino(logger));

app.get('/health', (req,res)=>{res.json({status:'ok', uptime:process.uptime()})})

const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{logger.info(`Server running on port ${PORT}`)});
