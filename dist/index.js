"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
dotenv_1.default.config();
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
// Serving static files
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const port = process.env.PORT;
app.listen(port, () => {
    console.log("App running on port 5000");
});
const db = (process.env.MONGODB_URL);
mongoose_1.default.connect(db).then(() => {
    console.log("Database connected successfully");
}).catch((err) => console.log(err));
//middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("common")); //to display request details (like type of request i.e. get, post, put, etc), time taken to process that request, etc to the console
//user defined
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
//user defined
app.use("/api/auth", authRoutes_1.default);
app.use("/post", postRoutes_1.default);
app.use("/user", userRoutes_1.default);
