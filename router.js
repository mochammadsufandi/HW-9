const express = require('express');
const MoviesClass = require('./controllers/movies.controller');
const UsersClass = require('./controllers/users.controller');
const {authentication} = require('./middleware/authMiddleware')
const {authorization} = require('./middleware/authMiddleware');

const router = express.Router();
const moviesController = new MoviesClass;
const UsersController = new UsersClass;



router.get('', (request,response) => {
    response.json({message : 'haloooo'})
})

/* MOVIES ROUTER */

router.get('/movies',authentication,moviesController.getAllMovies);
router.get('/movies/id/:id',authentication,moviesController.getMoviesById);
router.get('/movies/genres/:genres',authentication,moviesController.getMoviesByGenres);

router.post('/movies/add',authorization,moviesController.postMovies);

router.put('/movies/update/:id',authorization,moviesController.updateMovies);

router.delete('/movies/delete/:id',authorization,moviesController.deleteMovies);



/* USERS ROUTER*/

router.get('/users',authorization,UsersController.getAllUsers);
router.get('/users/id/:id',authorization,UsersController.getUsersById);
router.get('/users/roles/:roles', authorization,UsersController.getUsersByRoles);

router.post('/users/register',UsersController.registerUsers);
router.post('/users/login',UsersController.loginUsers);

router.put('/users/:id',authorization,UsersController.updateUsers);

router.delete('/users/:id',authorization,UsersController.deleteUsers);


module.exports = router;