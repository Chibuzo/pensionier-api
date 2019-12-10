const request = require('../helpers/APIRequest')(process.env.STARWARS_API_URL);
const cache = require('../helpers/cache');
const commentModel = require('../models').Comment;
const { ErrorHandler } = require('../helpers/errorHandler');

module.exports = {
    /**
     * Fetch all Starwars movies, including their comment count
     * @returns {Promise} list of starwars movie
     */
    fetchMovies: async () => {
        let films;

        // get movies from cache
        films = await cache.get('movies');

        if (!films) {
            try {
                films = await request.get('films');
            } catch (err) {
                throw new ErrorHandler(err.statusCode, err.message);
            }

            // cache movies
            cache.set('movies', films);
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
            };
        });

        return await movies;
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
        try {
            var movie = await fetchMovie(movie_id);

            // fetch characters from movie
            const characterlist = await fetchCharacterSet(movie);

            // [apply gender filter], map required characters' data
            const characters = gender ? filter(characterlist, gender).map(mapCharacterData) : characterlist.map(mapCharacterData);

            // get total height
            const total_height = characters.reduce((total_height, character) => {
                return Number.isInteger(parseInt(character.height)) ? total_height + parseInt(character.height) : 0;
            }, 0);

            // apply sort (default desc)
            sort && sortResult(characters, sort, sort_order);

            characters.total_height_cm = total_height + 'cm';
            characters.total_height_feet_inches = cmToFeetInches(total_height);
            characters.count = characters.length;
            return characters;
        } catch (err) {
            throw new ErrorHandler(err.statusCode, err.message);
        }
    },

    isValidMovieId: async movie_id => {
        try {
            return await fetchMovie(movie_id);
        } catch (err) {
            return false;
        }
    }
}


/**
 * 
 * Miscellaneous functions
 */

async function fetchMovie(movie_id) {
    let movie;

    // get movie data from cache
    movie = await cache.get(`movie_${movie_id}`);

    if (!movie) {
        try {
            movie = await request.get(`films/${movie_id}`);

            // save movie data in cache
            cache.set(`movie_${movie_id}`, movie);
        } catch (err) {
            throw new ErrorHandler(err.statusCode, err.message);
        }
    }
    return movie;
}


async function fetchCharacterSet(movie) {
    return await Promise.all(movie.characters.map(async character_url => {
        let character_data;
        let id = character_url.split('/')[5];

        character_data = await cache.get(`character_${id}`);

        if (!character_data) {
            character_data = await request.get(`people/${id}`);

            // cache character data
            cache.set(`character_${id}`, character_data);
        }

        return character_data;
    })).catch(err => {
        throw new ErrorHandler(500, "Error fetching movie characters. Please try again later");
    });
}


function sortResult(data_array, sort_field, order) {
    data_array.sort((a, b) => {
        if (sort_field == 'height') {
            return order == 'asc' ? a[sort_field] - b[sort_field] : b[sort_field] - a[sort_field];
        } else {
            return order == 'asc' ? a[sort_field].localeCompare(b[sort_field]) : b[sort_field].localeCompare(a[sort_field]);
        }
    });
}


function filter(characters, gender) {
    return characters.filter(character => character.gender === gender);
}


function mapCharacterData(character) {
    return {
        name: character.name,
        birth_year: character.birth_year,
        eye_colour: character.eye_color,
        gender: character.gender,
        mass: character.mass,
        height: character.height
    }
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