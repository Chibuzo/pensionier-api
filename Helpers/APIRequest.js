const axios = require('axios');

const APIRequest = api_url => {
    let option = {
        baseURL: api_url,
        headers: { 'Content-Type': 'application/json' }
    };

    const get = async (url, params = {}) => {
        option.params = params;
        try {
            const response = await axios.get(url, option);
            return await response.data;
        } catch (err) {
            throw { statusCode: err.response.status, message: err.response.data.detail };
        }
    }

    const post = (url, params = {}) => {

    }

    return {
        get,
        post
    }
}

module.exports = APIRequest;