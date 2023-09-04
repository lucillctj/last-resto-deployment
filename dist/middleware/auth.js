"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearTokenCookie = exports.setTokenCookie = exports.generateAccessToken = exports.verifyAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const verifyAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const reqUserId = parseInt(req.params.user);
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const tokenUserId = decodedToken.userId;
        if (reqUserId != tokenUserId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};
exports.verifyAuth = verifyAuth;
function generateAccessToken(userId) {
    return jsonwebtoken_1.default.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1800s'
    });
}
exports.generateAccessToken = generateAccessToken;
const setTokenCookie = (res, token) => {
    res
        .cookie('token', token, {
        maxAge: 7200000,
        secure: false,
        httpOnly: true
    })
        .status(200);
};
exports.setTokenCookie = setTokenCookie;
const clearTokenCookie = (res) => {
    res.clearCookie('token').status(200);
};
exports.clearTokenCookie = clearTokenCookie;
// export function generateRefreshToken(userId: any) {
//     return jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: '60d'});
// }
