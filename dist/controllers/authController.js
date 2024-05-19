"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
const userModel_1 = __importDefault(require("./../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signToken = (id) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error("JWT secret or expires in not defined");
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const createSendToken = (user, statusCode, res, msg) => {
    const token = signToken(user._id);
    // Remove password from output
    user.password = "";
    res.status(statusCode).json({
        status: true,
        message: msg,
        data: {
            userData: user,
            token: token
        }
    });
};
// exports.signup = async (req: Request, res: Response, next: NextFunction) => {
//   const email = req.body.email;
//   let existingUser;
//   try {
//     existingUser = await User.findOne({ email });
//   }
//   catch (err) {
//     return res.status(500).json(
//       {
//         status: false,
//         message: "error checking user"
//       }
//     );
//   }
//   if (existingUser) {
//     return res.status(202).json({
//       status: false,
//       message: "User already exists",
//       data: null
//     });
//   }
//   try {
//     const password = req.body.password;
//     const { name, email } = req.body;
//     const newUser = new User({
//       name: name,
//       email: email,
//       password: password
//     });
//     //save user and respond
//     const user = await newUser.save();
//     createSendToken(user, 200, res, "User registered successfully");
//   }
//   catch (err) {
//     res.status(500).json(err);
//   }
// };
// exports.login = async (req: Request, res: Response, next: NextFunction) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   // 1) Check if email and password exist
//   if (!email || !password) {
//     return res.status(401).json({ message: "Please provide username and password" });
//   }
//   // 2) Check if user exists 
//   let existingUser;
//   try {
//     existingUser = await User.findOne({ email });
//   }
//   catch (err) {
//     return res.status(500).json({ message: "error checking user" });
//   }
//   if (!existingUser) {
//     return res.status(202).json({
//       status: false,
//       message: "User does not exists"
//     });
//   }
//   // 3) Check if password is correct
//   const isPasswordCorrect = (password === existingUser.password) ? true : false;
//   if (!isPasswordCorrect) {
//     return res.status(202).json({
//       status: false,
//       message: "Incorrect email or password"
//     });
//   }
//   // 3) If everything ok, send token to client
//   createSendToken(existingUser, 200, res, "logged in success");
// };
exports.logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 300 + 1000),
        httpOnly: true
    });
    res.status(200).json({
        status: true,
        message: 'Logged Out Successfully'
    });
});
//checking if user is logged in or not
exports.isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers.cookie) {
        try {
            const jwtToken = req.headers.cookie.split('=')[1];
            const decoded = verifyToken(jwtToken);
            // 2) Check if user still exists
            const currentUser = yield userModel_1.default.findById(decoded._id);
            if (!currentUser) {
                return next();
            }
            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        }
        catch (err) {
            return next();
        }
    }
    next();
});
const verifyToken = (jwtToken) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT secret is not defined");
    }
    let decoded;
    decoded = (jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_SECRET));
    return decoded;
};
function signup(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = req.body.email;
        let existingUser;
        try {
            existingUser = yield userModel_1.default.findOne({ email });
        }
        catch (err) {
            return res.status(500).json({
                status: false,
                message: "error checking user"
            });
        }
        if (existingUser) {
            return res.status(202).json({
                status: false,
                message: "User already exists",
                data: null
            });
        }
        try {
            const password = req.body.password;
            const { name, email } = req.body;
            const newUser = new userModel_1.default({
                name: name,
                email: email,
                password: password
            });
            //save user and respond
            const user = yield newUser.save();
            createSendToken(user, 200, res, "User registered successfully");
        }
        catch (err) {
            res.status(500).json(err);
        }
    });
}
exports.signup = signup;
function login(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // throw new Error("Function not implemented.");
        const email = req.body.email;
        const password = req.body.password;
        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(401).json({ message: "Please provide username and password" });
        }
        // 2) Check if user exists 
        let existingUser;
        try {
            existingUser = yield userModel_1.default.findOne({ email });
        }
        catch (err) {
            return res.status(500).json({ message: "error checking user" });
        }
        if (!existingUser) {
            return res.status(202).json({
                status: false,
                message: "User does not exists"
            });
        }
        // 3) Check if password is correct
        const isPasswordCorrect = (password === existingUser.password) ? true : false;
        if (!isPasswordCorrect) {
            return res.status(202).json({
                status: false,
                message: "Incorrect email or password"
            });
        }
        // 3) If everything ok, send token to client
        createSendToken(existingUser, 200, res, "logged in success");
    });
}
exports.login = login;
function logout(arg0, logout) {
    throw new Error("Function not implemented.");
}
exports.logout = logout;
