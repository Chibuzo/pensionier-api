const request = require('../Helpers/APIRequest')(process.env.STARWARS_API_URL);
const commentModel = require('../models/comment');

module.exports = {
    fetchMovies: async () => {
        try {
            const films = await request.get('films');

            // sort by release date
            films.results.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

            // get movies' comment count
            let comments = [];
            try {
                comments = await commentModel.getMovieCommentCounts();
            } catch (err) {
                // this isn't sooo fatal so we'll continue...
                console.log(err);
            }

            // get relevant movie fields
            const movies = films.results.map(film => {
                let movie_id = film.url.split('/')[5];

                // get movie comment count
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

    fetchCharacters: async (movie_id, sort, gender) => {
        let characters = [];
        let total_height = 0;

        try {
            const movie = await request.get(`films/${movie_id}`);

            // fetch characters' data from movie data
            const xters = await Promise.all(movie.characters.map(character_url => {
                let id = character_url.split('/')[5];
                let character_data = request.get(`people/${id}`);
                return character_data;
            }));

            for (let i = 0; i < xters.length; i++) {
                // apply gender filter
                if (gender && gender !== xters[i].gender) continue;

                characters.push({
                    name: xters[i].name,
                    birth_year: xters[i].birth_year,
                    eye_colour: xters[i].eye_color,
                    gender: xters[i].gender,
                    mass: xters[i].mass,
                    height: xters[i].height
                });

                total_height += parseInt(xters[i].height);
            }

            // apply sort (default desc)
            sort.field && characters.customSort(sort.field, sort.order);

            characters.total_height_cm = total_height;

            // divide cm by 30.48 to get feet
            const feet = total_height / 30.48;
            //console.log(feet)
            characters.total_height_feet_inches = `${parseInt(feet)}ft ${Number(feet)}`;
            characters.count = characters.length;
            return characters;
        } catch (err) {
            throw err;
        }
    }
}

Array.prototype.customSort = function (sort_field, order) {
    this.sort((a, b) => {
        if (sort_field == 'height') {
            if (order == 'asc') {
                return a[sort_field] - b[sort_field];
            }
            return b[sort_field] - a[sort_field];
        } else {
            if (order == 'asc') {
                return a[sort_field].localeCompare(b[sort_field]);
            }
            return b[sort_field].localeCompare(a[sort_field]);
        }
    });
}