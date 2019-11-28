const axios = require('axios');

const APIRequest = api_url => {
    let option = {
        //baseURL: api_url,
        headers: { 'Content-Type': 'application/json' }
    };

    const get = async (url, params = {}) => {
        // option.method = 'get';
        // option.url = api_url + url;
        //option.params = params;
        //console.log(option)
        try {
            const response = await axios.get(api_url + url, option);
            return await response.data;
        } catch (err) {
            //console.log(err)
            console.log('fetch error')
            throw "Couldn't fetch data that this time, please try again later";
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