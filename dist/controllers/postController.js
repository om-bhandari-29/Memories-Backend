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
exports.commentOnPost = exports.unlikePost = exports.likePost = exports.getPostDetailsById = exports.myUploads = exports.getAllPost = exports.deletePost = exports.uploadImageNew = void 0;
const imageModel_1 = __importDefault(require("./../models/imageModel"));
function uploadImageNew(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const image = new imageModel_1.default({
                name: req.body.originalName,
                image: req.body.image,
                imageName: req.body.imageName,
                imageDescription: req.body.imageDescription,
                uploadedBy: req.currentUser.name,
                uploadedByUserId: req.currentUser._id
            });
            const uploadedImg = yield image.save();
            res.status(200).json({
                status: true,
                message: 'Image Uploaded Successfully',
                data: uploadedImg
            });
        }
        catch (err) {
            res.status(500).json({
                status: false,
                message: "Error occured",
                data: err
            });
        }
    });
}
exports.uploadImageNew = uploadImageNew;
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const postId = req.params.postId;
        try {
            const deletePost = yield imageModel_1.default.findByIdAndDelete(postId);
            if (!deletePost) {
                throw new Error("Error in deleting Post");
            }
            res.status(200).json({
                status: true,
                message: 'successfully deleted post',
                data: null
            });
        }
        catch (err) {
            res.status(500).json({
                status: "Error",
                message: "Error while deleting post",
                Error: {
                    err
                }
            });
        }
    });
}
exports.deletePost = deletePost;
function getAllPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let post;
        try {
            if (req.query.searchPost) {
                post = yield imageModel_1.default.find({ imageName: { $regex: req.query.searchPost, $options: 'i' } }).sort();
            }
            else {
                post = yield imageModel_1.default.find().sort();
            }
            res.status(200).json({
                status: true,
                message: 'All post fetched',
                data: post
            });
        }
        catch (err) {
            res.status(400).json({
                status: false,
                message: "Error getting all post",
                data: null
            });
        }
    });
}
exports.getAllPost = getAllPost;
function myUploads(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield imageModel_1.default.find({ uploadedByUserId: req.currentUser._id }).sort();
            res.status(200).json({
                status: true,
                message: 'Post fetched',
                data: post
            });
        }
        catch (err) {
            res.status(400).json({
                status: false,
                message: "Error Fetching posts",
                data: err
            });
        }
    });
}
exports.myUploads = myUploads;
function getPostDetailsById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield imageModel_1.default.findById(req.params.postId);
            res.status(200).json({
                status: true,
                message: 'Post Details fetched',
                data: post
            });
        }
        catch (err) {
            res.status(400).json({
                status: false,
                message: "Error Fetching post details",
                data: err
            });
        }
    });
}
exports.getPostDetailsById = getPostDetailsById;
function likePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postId = req.body.postId;
            const post = yield imageModel_1.default.findByIdAndUpdate(postId, {
                $push: { likes: req.currentUser._id }
            }, { new: true });
            res.status(200).json({
                status: true,
                message: 'Post liked successfully',
                data: post
            });
        }
        catch (err) {
            res.status(400).json({
                status: false,
                message: "Error Fetching post details",
                data: err
            });
        }
    });
}
exports.likePost = likePost;
function unlikePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postId = req.body.postId;
            const post = yield imageModel_1.default.findByIdAndUpdate(postId, {
                $pull: { likes: req.currentUser._id }
            }, { new: true });
            res.status(200).json({
                status: true,
                message: 'Post un-liked successfully',
                data: post
            });
        }
        catch (err) {
            res.status(400).json({
                status: false,
                message: "Error Fetching post details",
                data: err
            });
        }
    });
}
exports.unlikePost = unlikePost;
function commentOnPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postId = req.params.postId;
            const newComment = {
                by: req.currentUser.name,
                comment: req.body.comment,
                userId: req.currentUser._id
            };
            const post = yield imageModel_1.default.findByIdAndUpdate(postId, {
                $push: { comments: newComment }
            }, {
                new: true
            });
            res.status(200).json({
                status: true,
                message: 'Comment added successfully',
                data: post
            });
        }
        catch (err) {
            res.status(400).json({
                status: false,
                message: "Error Fetching post details",
                data: err
            });
        }
    });
}
exports.commentOnPost = commentOnPost;
