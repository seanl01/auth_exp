import express from 'express';
import api from './api.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors())
app.use(cookieParser())

app.use(express.static('public'));

// TODO: Middleware to check if user is logged in using jwt cookie
const protectRoute = (req, res, next) => {
    const token = req.cookies?.token;
    if (token) {
        try {
            const { sub } = jwt.verify(token, process.env.JWT_SECRET);
            req.id = sub;
            next()
        }
        catch (e) {
            res.status(401).send({ message: "Unauthorized" });
        }
    }

    else {
        res.status(401).send({ message: "Unauthorized" });
    }
}

const excludeLoginAndRegister = (req, res, next) => {
    console.log(req.path);
    if (req.path === "/login.html" || req.path === "/register.html" || req.path === "/api/login") {
        next();
    }
    else {
        protectRoute(req, res, next);
    }
}
app.use(excludeLoginAndRegister);
app.use('/api', api);


app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});