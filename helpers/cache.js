const redis = require('redis');
const { promisify } = require('util');

const cacheServer = connectToServer();

module.exports = {
    get: async label => {
        if (cacheServer.client.connected) {
            const data = await cacheServer.fetchFromCache(label);
            return data ? await JSON.parse(data) : '';
        } else {
            return '';
        }
    },

    set: (label, data) => {
        cacheServer.client.connected && cacheServer.client.setex(label, 3600 * 3, JSON.stringify(data));
    }
}


function connectToServer() {
    let client, fetchFromCache;

    client = redis.createClient();

    client.on('error', (err) => {
        //console.log(err);
    });

    fetchFromCache = promisify(client.get).bind(client);

    if (client) {
        return {
            client,
            fetchFromCache
        };
    }

    return false;
}