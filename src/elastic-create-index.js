const elasticClient = require("./config/elastic-client.js");

const createIndex = async (indexName) => {
  await elasticClient.indices.create({ index: indexName });
  console.log(`Index ${indexName} created`);
};

//Creating indices (run this script before start the server)
createIndex('posts');