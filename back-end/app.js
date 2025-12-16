// app.js 

import express from 'express';
import dotenv from 'dotenv';
import cors from "cors"
import cookieParser from 'cookie-parser';
import { readdirSync } from 'fs'
dotenv.config();
export const app = express();
app.use(cookieParser());

console.log("CORS FROM:", process.env.URL_FRONT_END);
app.use(cors({
    origin: process.env.URL_FRONT_END,
    optionsSuccessStatus: 200,
    credentials: true
}))
app.use("/uploads", express.static("uploads"))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes synchronously
readdirSync('./routes').map(async (r) => {
    try {
        const routeModule = await import(`./routes/${r}`);
        if (routeModule.default) {
            app.use('/api', routeModule.default);
            console.log(`🛜 Loaded route: /api from ${r}`);
        }
    } catch (err) {
        console.error(`❌ Error loading route ${r}:`, err);
    }
});

export const PORT = process.env.PORT;

