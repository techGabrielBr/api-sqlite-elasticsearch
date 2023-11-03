const app = require("./src/app");
const database = require("./db.js");
require("dotenv").config();

(async () => {
    try {
        await database.sync();
        
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
})();
