const movies = require('../database/movies');


class Movies {
    async getAllMovies (req,res) {
        const page = req.query.page;
        const limit = req.query.limit;
        const allMovies = await movies.findAll({
            offset : (page-1)*limit,
            limit : limit
        });
        if(allMovies.length === 0) return res.status(401).json({message : 'All Movies can not be found'});


        return res.status(200).json({message : allMovies});
    }

    async getMoviesById (req,res) {
        const Movies = await movies.findAll({
            where : {id : req.params.id }
        });
        if(Movies.length === 0) {
            return res.status(404).json({message : `Movies with id : ${req.params.id} is not found`});
        }
        console.log(typeof(Movies))
        return res.status(200).json({message : Movies});
    }
    async getMoviesByGenres (req,res) {
        const Movies = await movies.findAndCountAll({
            where : {genres : req.params.genres }
        });
        if(Movies.length === 0) {
            return res.status(404).json({message : `Movies with id : ${req.params.genres} is not found`});
        }
        // console.log()
        return res.status(200).json({message : Movies});
    }

    // POST METHOD 
    async postMovies (req,res) {
        try {
            const {title,genres,year} = req.body;

            if(!title || !genres || !year) return res.status(400).json({message : 'Invalid Input'});

            const existingMovies = await movies.findOne({
                where : {
                    title : title
                }
            })

            if(existingMovies) return res.status(400).json({message : `movie with title ${title} is already exist`});

           const addedMovies = await movies.create({
                title : title,
                genres : genres,
                year : year
            })

            return res.status(200).json({
                message : 'movie is succesfully added',
                movie : addedMovies
            })
        } 

        catch(error) {
            console.log(error);
            return res.status(500).json({message : 'Internal Server Error'});
        }
    }

    // UPDATE METHOD
    async updateMovies (req,res) {
        try {
            const updateMovie = await movies.findOne({
                where : {
                    id : req.params.id
                }
            });
            const {title,genres,year} = req.body

            if(!updateMovie) return res.status(404).json({message : `Movie with id ${req.params.id} is not found`});

            if(!title || !genres || !year) return res.status(400).json({message : 'Invalid Input'});

            updateMovie.set({
                title : title,
                genres : genres,
                year : year
            })

            await updateMovie.save();

            return res.status(200).json({message : 'Update Success'});

        } catch(error) {
            console.log(error);
            return res.status(500).json({message : 'Internal Server Error'});
        }
    }

    // DELETE METHOD 
    async deleteMovies (req,res) {
        try {
            const deleteMovie = await movies.findOne({
                where : {
                    id : req.params.id
                }
            });

            if(!deleteMovie) return res.status(404).json({message : `movie with id ${req.params.id} is not found`});

            await deleteMovie.destroy();

            return res.status(200).json({message : 'Delete Success'})

        } catch(error) {
            console.log(error);
            return res.status(400).json({message : 'Internal Server Error'});
        }
        
    }
}

module.exports = Movies;