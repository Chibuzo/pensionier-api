const request = require('../Helpers/APIRequest')(process.env.STARWARS_API_URL);
const commentModel = require('../models/comment');
const redis = require('redis');
const redisClient = redis.createClient();
const { promisify } = require('util');
const fetchFromCache = promisify(redisClient.get).bind(redisClient);

module.exports = {
    /**
     * Fetch all Starwars movies along, including their comment count
     * @returns {Promise} list of starwars movie
     */
    fetchMovies: async () => {
        try {
            let films;
            const cached_films = await fetchFromCache('movies');
            if (cached_films) {
                films = JSON.parse(cached_films);
            } else {
                films = await request.get('films');

                // cache movies
                redisClient.setex('movies', 3600 * 3, JSON.stringify(films));
            }

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
                };
            });

            return await movies;
        } catch (err) {
            throw err;
        }
    },

    /**
     * Fetch movie characters
     * @param {Integer} movie_id
     * @param {String} [sort]
     * @param {String} [sort_order=desc]
     * @param {String} [gender]
     * @returns {Promise} list of movie characters
     */
    fetchCharacters: async (movie_id, sort, sort_order = 'desc', gender) => {
        let characters = [];
        let total_height = 0;

        try {
            let movie;
            const cached_movie = await fetchFromCache(`movie_${movie_id}`);
            if (cached_movie) {
                movie = JSON.parse(cached_movie);
            } else {
                movie = await request.get(`films/${movie_id}`);
                redisClient.setex(`movie_${movie_id}`, 3600 * 3, JSON.stringify(movie));
            }

            // fetch characters' data from movie data
            const xters = await Promise.all(movie.characters.map(async character_url => {
                let character_data;
                let id = character_url.split('/')[5];

                const cached_character = await fetchFromCache(`character_${id}`);
                if (cached_character) {
                    character_data = JSON.parse(cached_character);
                } else {
                    character_data = await request.get(`people/${id}`);
                    // cache character data
                    redisClient.setex(`character_${id}`, 3600 * 3, JSON.stringify(character_data));
                }

                return character_data;
            })).catch(err => {
                throw err;
            });

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

                total_height += Number.isInteger(parseInt(xters[i].height)) ? parseInt(xters[i].height) : 0;
            }

            // apply sort (default desc)
            sort && characters.customSort(sort, sort_order);

            characters.total_height_cm = total_height + 'cm';
            characters.total_height_feet_inches = cmToFeetInches(total_height);
            characters.count = characters.length;
            return characters;
        } catch (err) {
            //console.log(err)
            throw err;
        }
    }
}

Array.prototype.customSort = function (sort_field, order) {
    this.sort((a, b) => {
        if (sort_field == 'height') {
            return order == 'asc' ? a[sort_field] - b[sort_field] : b[sort_field] - a[sort_field];
        } else {
            return order == 'asc' ? a[sort_field].localeCompare(b[sort_field]) : b[sort_field].localeCompare(a[sort_field]);
        }
    });
}

function cmToFeetInches(len) {
    const ft_const = 30.48; // quantity of cm in 1 feet
    const inch_const = 2.54   // quantity of cm in 1 inch
    const feet = len / ft_const;
    const len_ft = Math.floor(feet);
    const decimal = `0.` + feet.toString().split('.')[1];
    const len_inches = ((parseFloat(decimal) / inch_const) * ft_const).toFixed(2);
    return `${len_ft}ft ${len_inches}in`;
}