import rateLimit from "express-rate-limit";


export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


export const adminRole = (req, res, next) => {
    const userSession = req.session.user;
    if (!userSession) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (userSession.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    next();
}