import express from 'express'
import sql from './db.js'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
dotenv.config()

const api = express.Router();
api.use(express.json())

const createUser = async ({ name, email, password }) => {
    const user = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES (${name}, ${email}, crypt(${password}, gen_salt('bf')), 'mentor')`

    return user;
}

api.get("/auth", (req, res) => {
    res.status(200).send({ message: "Authenticated" })
})

api.post("/register", async (req, res) => {
    const data = req.body;
    try {
        const { email } = await createUser(data);
        res.send({ "message": `${email} registered successfully` })
    }
    catch (e) {
        console.log(e);
        res.status(401).send({ "message": "Something went wrong" })
    }
})

api.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authUser({ email, password });
        if (!user) {
            handleUserDoesNotExist(res)
            return;
        }

        if (user.match) {
            await loginUser(res, user);
        }
        else {
            res.status(401).send({ message: "Invalid password" });
        }
    }
    catch (e) {
        console.log(e);
        res.status(401).send({ message: "Something went wrong" })
    }
})

const authUser = async ({ email, password }) => {
    // returns authenticated user or null
    const res = await sql`SELECT id, name, password = crypt(${password}, password) as match FROM users WHERE email = ${email}`;
    return res.count === 0 ? null : res[0];
}

// Takes in a user object and sends a cookie with jwt token
const loginUser = async (res, { id, email, name }) => {
    const token = jwt.sign({ sub: id, email, name }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({message: "Logged in successfully"});
}

const handleUserDoesNotExist = (res) => {
    res.status(401).send({ message: "User Does not exist" })
}

api.get("/show-info", async (req, res) => {
    const { id } = req;
    const user = await sql`SELECT id, name, email, role FROM users WHERE id = ${id}`;
    res.send(user[0]);
})

export default api;