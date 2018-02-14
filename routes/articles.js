const express = require("express");

let app = express();

// Import the articles as mongoose schema
const Article = require('../models/article');

// Express Upload
const fileUpload = require('express-fileupload');

// ==================================================
//       Define the route 
// ==================================================
app.get("/", (req, res, next) => {

    Article.find({}).sort('name').exec( (err, articles) => {

        if (err) {            
            return res.status(500).json({
                ok: false,
                message: 'Error loading Article',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            articles: articles
        });

    });
});

// ==================================================
//       Update the article
// ==================================================
app.put("/:id", (req, res) => {

    const id = req.params.id;// Grab the ID from the url
    let body = req.body;

    Article.findById(id, (err, article) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error finding the Article',
                errors: err
            });
        }

        if (!article) {
            return res.status(400).json({
                ok: false,
                message: 'The article with tat id does not exist',
                errors: {
                    message: 'It does not exist'
                }
            });
        }

        article.name = body.name;
        article.image = body.image;
        article.category = body.category;
        article.date = body.date;
        article.author = body.author;
        article.content = body.content;
        article.labels = body.labels;
        article.comments = body.comments;
        
        article.save((err, userSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Conflict trying to update article',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                userSaved: userSaved
            }); 
            
        });
    });
});


// ==================================================
//       POST Article 
// ==================================================

app.post('/', (req, res) => {

    let body = req.body;

    //  Create a reference to the article's Schema
    //----------------------------------------------
    const article = new Article({
        name: body.name,
        category: body.category,
        image: body.image,
        date: body.date,
        author: body.author,
        content: body.content,
        labels: body.labels,
        comments: body.comments,
    });


    // Save on the Database
    article.save((err, success) => {

        if (err) {            
            return res.status(500).json({
                ok: false,
                message: 'Error',
                erors: err
            });
        }

        // 201 Created!
        res.status(201).json({
            ok: true,
            body: body, 
            message:'Just posted on db',
        });
        
    })
});



// ==================================================
//       Delete Article 
// ==================================================


app.delete('/:id', (req, res) => {
    // Grab the ID from the url
    const id = req.params.id;

    Article.findByIdAndRemove(id, (err, eraseArticle) => {

        if (err) {            
            return res.status(500).json({
                ok: false,
                message: 'Error trying to erase the Article',
                erors: err
            });
        }


        if (!eraseArticle) {            
            return res.status(500).json({
                ok: false,
                message: 'That article does not exist',
                erors: {message: 'The article with that ID can\'t be erased, it might not exist'}
            });
        }

           // 200 success
        res.status(200).json({
            ok: true,
            message:'Article erased!',
        });

    });
});



  
// Export the route
module.exports = app;