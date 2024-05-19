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
exports.getUserDetails = exports.getLoggedInUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("./../models/userModel"));
function getLoggedInUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization && process.env.JWT_SECRET) {
            const jwtToken = req.headers.authorization.split(' ')[1];
            const decoded = (jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_SECRET));
            const currentUser = (yield userModel_1.default.findById(decoded.id));
            if (currentUser) {
                req.currentUser = currentUser;
            }
        }
        next();
    });
}
exports.getLoggedInUser = getLoggedInUser;
function getUserDetails(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.headers.authorization && process.env.JWT_SECRET) {
            const jwtToken = req.headers.authorization.split(' ')[1];
            const decoded = (jsonwebtoken_1.default.verify(jwtToken, process.env.JWT_SECRET));
            const currentUser = (yield userModel_1.default.findById(decoded.id));
            return res.status(200).json({
                status: true,
                message: 'User details fetched successfully',
                data: currentUser
            });
        }
        return res.status(201).json({
            status: false,
            message: 'Authorization not found',
            data: null
        });
    });
}
exports.getUserDetails = getUserDetails;
