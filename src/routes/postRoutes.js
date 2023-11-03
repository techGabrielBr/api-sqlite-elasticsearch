const Router = require("express").Router()
const PostController = require("../controller/PostController.js");

const postRoutes = Router
.post('/posts', PostController.createPost)
.patch('/posts/:id', PostController.updatePost)
.get('/posts', PostController.getAllPost)
.get('/posts/:id', PostController.getById)
.get('/posts/search/:title', PostController.getByTitle)
.delete('/posts/:id', PostController.deleteById)

module.exports = postRoutes;