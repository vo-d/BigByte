const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URI;
var client = false

export async function getDB() {
    if (client === false) {
        client = new MongoClient(uri);
    }
    else {
        return client
    }
    return client
}
