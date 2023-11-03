const postRoutes = require("./postRoutes.js");

const routes = function(app){
    app.use(
        postRoutes
    );
}

module.exports = routes;