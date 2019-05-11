var User = require('../models/user');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');


// Display Author create form on GET.
exports.user_create_get = function(req, res, next) { 

	res.render('user_form', { title: 'Sign-up for Access'});
};

// Handle Author create on POST.
exports.user_create_post = [

    // Validate fields.
    body('email').isLength({ min: 1 })
    .withMessage('Email must be specified.')
    .isEmail().withMessage('Must enter a valid email'),
    body('username').isLength({ min: 1 })
    .withMessage('Username must be specified.'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters.'),
    body('passwordConf').isLength({ min: 4 }).withMessage('Confirmed password must be at least 4 characters.'),

    // Sanitize fields.
    sanitizeBody('email').trim().escape(),
    sanitizeBody('username').trim().escape(),
    sanitizeBody('password').escape(),
    sanitizeBody('passwordConf').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (req.body.password !== req.body.passwordConf){
        	res.render('user_form', { title: 'Sign-up for Access', user: req.body, pflags: 'Password must match' });
            return;
        }
        else if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('user_form', { title: 'Sign-up for Access', user: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Author object with escaped and trimmed data.
            var userData = new User(
                {
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password,
                    passwordConf: req.body.passwordConf,
                });


             async.parallel({
		        book_count: function(callback) {
		            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
		        },
		        book_instance_count: function(callback) {
		            BookInstance.countDocuments({}, callback);
		        },
		        book_instance_available_count: function(callback) {
		            BookInstance.countDocuments({status:'Available'}, callback);
		        },
		        author_count: function(callback) {
		            Author.countDocuments({}, callback);
		        },
		        genre_count: function(callback) {
		            Genre.countDocuments({}, callback);
		        }
		    }, function(err, results) {
			    User.create(userData, function (error, user) {
			      if (error) {
			        return next(error);
			      } else {
			        req.session.userId = user._id;



			        res.render('index', { title: 'Local Library Home', error: error, data: results, user: req.session.userId});
			        return 
			      }
			    });
		    });

        }
    }
];



// Display Author update form on GET
exports.user_login_get = function(req, res, next) {

    // Get book, authors and genres for form.
    res.render('user_form_login', { title: 'Login for Access'});

};

// Handle Author update on POST.
exports.user_login_post = [
   
    // Validate fields.
    body('email').isLength({ min: 1 })
    .withMessage('Email must be specified.')
    .isEmail().withMessage('Must enter a valid email'),
    body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters.'),

    // Sanitize fields.
    sanitizeBody('email').trim().escape(),
    sanitizeBody('password').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('user_form_login', { title: 'Sign-up for Access', user: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            if (req.body.email && req.body.password) {
			    User.authenticate(req.body.email, req.body.password, function (error, user) {
			      if (error || !user) {
			        var err = new Error('Wrong email or password.');
			        err.status = 401;
			        return next(err);
			      } else {
			        req.session.userId = user._id;
			        

			        async.parallel({
				        book_count: function(callback) {
				            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
				        },
				        book_instance_count: function(callback) {
				            BookInstance.countDocuments({}, callback);
				        },
				        book_instance_available_count: function(callback) {
				            BookInstance.countDocuments({status:'Available'}, callback);
				        },
				        author_count: function(callback) {
				            Author.countDocuments({}, callback);
				        },
				        genre_count: function(callback) {
				            Genre.countDocuments({}, callback);
				        }
				    }, function(err, results) {

			        res.render('index', { title: 'Local Library Home', error: error, data: results, user: req.session.userId});
			        return 
		
		    });


			      }
			    });
			  } else {
			    var err = new Error('All fields required.');
			    err.status = 400;
			    return next(err);
			  }
        }
    }
];

// Display Author update form on GET
exports.user_logout_get = function(req, res, next) {

	if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      }
    });
  	}

    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });

};
