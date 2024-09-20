import { Router } from 'express';
import jwt from 'jsonwebtoken';

const { sign } = jwt;
const router = Router();

// Set token secret and expiration date
const secret = "mysecretsshhhhh";
const expiration = "2h";

// Middleware to verify JWT
export function authMiddleware(req, res, next) {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer ')) {
        token = token.split(" ").pop().trim();
    }

    if (!token) {
        return res.status(400).json({ message: "You have no token!" });
    }

    try {
        const decoded = jwt.verify(token, secret, { maxAge: expiration });
        req.user = decoded.data;
        next();
    } catch {
        console.log("Invalid token.");
        return res.status(400).json({ message: "Invalid token." });
    }
}

// Function to sign a JWT
export function signToken({ username, email, _id }) {
    const payload = { username, email, _id };
    return sign({ data: payload }, secret, { expiresIn: expiration });
}

// Route to handle signup
router.post('/signup', (req, res) => {
    // Here you should implement the signup logic
    // For example:
    // 1. Validate user input
    // 2. Check if user already exists
    // 3. Create new user
    // 4. Generate token
    // 5. Send response

    // This is a placeholder implementation
    const { username, email, password } = req.body;
    
    // Perform validation and user creation here
    
    const token = signToken({ username, email, _id: 'generated_id' });
    res.json({ token });
});


export default router;