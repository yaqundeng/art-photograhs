import express from 'express';
import cors from 'cors';
import photo from './api/photo.route.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/photos", photo);
app.use('*', (req, res) => {
    res.status(404).json({ error: "not found" });
})

export default app;