import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const dtoken = req.headers.authorization?.split(" ")[1];

        if (!dtoken) {
            return res.status(401).json({ success: false, message: 'Not Authorized. Please log in again.' });
        }

        // Verify token
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server error: Missing JWT secret" });
        }

        const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.body.docId = decoded.id;

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired token. Please log in again." });
    }
};

export default authDoctor;
