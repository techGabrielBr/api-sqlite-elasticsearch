const Post = require("../model/Post.js");
const elasticClient = require("../config/elastic-client.js");

class PostController {
    static createPost = async function(req, res, next){
        const {title, author, content} = req.body;

        try {
            let result = await Post.create({
                title: title,
                author: author,
                content: content
            });

            if(result != null){
                await elasticClient.index({
                    index: "posts",
                    document: {
                        id: result.id,
                        title: title,
                        author: author,
                        content: content,
                    },
                });
            }

            res.send(result);
        } catch (error) {
            res.send(error);
        }
    }

    static getAllPost = async function(req, res, next){
        try {
            const result = await Post.findAll();
        
            res.send(result);
        } catch (error) {
            res.send(error);
        }
    }

    static getById = async function(req, res, next){
        try {
            let result = await Post.findByPk(req.params.id);
        
            res.send(result);
        } catch (error) {
            res.send(error);
        }
    }

    static getByTitle = async function (req, res, next){
        try {
            const result = await elasticClient.search({
                index: "posts",
                query: { fuzzy: { title: req.params.title } },
            });
        
            res.send(result);
        } catch (error) {
            res.send(error)
        }
    };

    static deleteById = async function(req, res, next){
        try {
            let result = await Post.destroy({
                where: {
                    id: req.params.id
                }
            });

            if(result == 1){
                await elasticClient.deleteByQuery({
                    index: 'posts',
                    body: {
                        query: {
                            match: {id: req.params.id}
                        }
                    }
                });

                res.send('Post Deleted');
            }else {
                res.send({});
            }

        } catch (error) {
            res.send(error);
        }
    }

    static updatePost = async function (req, res, next){
        try {
            let post = await Post.findByPk(req.params.id);

            if(post != null){
                const {title, author, content} = req.body;

                title != null ? post.title = title : null;
                author != null ? post.author = author : null;
                content != null ? post.content = content : null;

                await post.save();

                const script = {
                    "inline": `ctx._source.title = '${post.title}'; ctx._source.author = '${post.author}'; ctx._source.content = '${post.content}';`
                }

                await elasticClient.updateByQuery({
                    index: 'posts',
                    body:{
                        query: {
                            match: {id: req.params.id}
                        },
                        script: script
                    }
                });

                res.send('Post Updated');
            }else{
                res.send('Post not found');
            }

            
        } catch (error) {
            res.send(error)
        }
    };
}

module.exports = PostController;