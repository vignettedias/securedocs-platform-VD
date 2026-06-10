"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const document_routes_1 = __importDefault(require("./documents/document.routes"));
const prisma_1 = require("./config/prisma");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.get("/db-test", async (_req, res) => {
    const result = await prisma_1.prisma.user.findMany();
    res.json(result);
});
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "UP"
    });
});
app.use("/auth", auth_routes_1.default);
app.use("/documents", document_routes_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SecureDocs API running on port ${PORT}`);
});
//# sourceMappingURL=app.js.map