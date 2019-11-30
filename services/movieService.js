const request = require('../Helpers/APIRequest')(process.env.STARWARS_API_URL);
const commentModel = require('../models/comment');

module.exports = {
    fetchAll: async () => {
        try {
            const data = await request.get('films');

            // sort by release date
            data.results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

            // get movie comment counts
            let comments = [];
            try {
                comments = await commentModel.getMovieCommentCounts();
            } catch (err) {
                // this isn't sooo bad so we'll continue...
                console.log(err);
            }

            const movies = data.results.map(film => {
                let movie_id = film.url.split('/')[5];

                let count = comments.find(comment => comment.movie_id == movie_id);

                return {
                    title: film.title,
                    opening_crawl: film.opening_crawl,
                    comment_count: count ? count.comment_count : 0,
                    //release_date: film.release_date,
                }
            });

            return await movies;
        } catch (err) {
            throw err;
        }
    },

    fetchCharacters: async movie_id => {
        let characters = [];
        let total_height = 0;

        try {
            const data = await request.get(`films/${movie_id}`);

            // fetch characters' data from movie data
            const xters = await Promise.all(data.characters.map(character_url => {
                let id = character_url.split('/')[5];
                let character_data = request.get(`people/${id}`);
                return character_data;
            }));

            xters.forEach(character_data => {
                characters.push({
                    name: character_data.name,
                    birth_year: character_data.birth_year,
                    eye_colour: character_data.eye_color,
                    gender: character_data.gender,
                    mass: character_data.mass,
                    height: character_data.height
                });

                total_height += parseInt(character_data.height);
            });

            characters.total_height_cm = total_height;

            // divide cm by 30.48 to get feet
            const feet = total_height / 30.48;
            console.log(feet)
            characters.total_height_feet_inches = `${parseInt(feet)}ft ${Number(feet)}`;
            characters.count = data.characters.length;
            return characters;
        } catch (err) {
            throw err;
        }
    }
}