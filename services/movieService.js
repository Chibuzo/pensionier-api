const request = require('../Helpers/APIRequest')(process.env.STARWARS_API_URL);
const comment = require('../models/comment');

module.exports = {
    fetchAll: async () => {
        try {
            const data = await request.get('films');
            const movies = data.results.map(film => {
                return {
                    title: film.title,
                    opening_crawl: film.opening_crawl,
                    comment_count: 0
                }
            });
            return await movies;
        } catch (err) {
            throw err;
        }
    },

    fetchCharacters: async episode_id => {
        let characters = [];
        let total_height = 0;

        try {
            const data = await request.get(`films/${episode_id}`);

            for (const character_url of data.characters) {
                let id = character_url.substr(-2, 1);
                let character_data = await request.get(`people/${id}`);

                characters.push({
                    name: character_data.name,
                    birth_year: character_data.birth_year,
                    eye_colour: character_data.eye_color,
                    gender: character_data.gender,
                    mass: character_data.mass,
                    height: character_data.height
                });

                total_height += character_data.height;
            }
            characters.total_height = total_height;

            return await characters;
        } catch (err) {
            throw err;
        }
    }
}