"use strict";

const express = require('express');
const router  = express.Router();
const dbUtils = require('../lib/dbutils.js');

/*
Contains all the Routes for any Post or Get to the Resources
-------------------------------------------------------------------------------
*/


module.exports = (knex) => {

  function getAllResources(parameters) {
    let query = knex.select('resources.id',
                            'resources.title',
                            'resources.description',
                            'resources.category_id',
                            'categories.picture_url')
                            //.avg('ratings.ratings')
                            //.count('likes.resource_id')
                    .from("resources")
                      .join("categories",{'categories.id': 'resources.category_id'})
                      //.rightJoin("ratings",{'ratings.resource_id' : 'resources.id'})
                      //.rightJoin("likes", {'likes.resource_id' : 'resources.id'})
                      //.groupBy("resources.id", 'categories.picture_url');
    if (parameters.parameter) {
      const searchParam = parameters.parameter;
      query = query.where('resources.title','LIKE', '%'+searchParam+'%').orWhere('resources.description', 'LIKE', '%'+searchParam+'%')
                    .orWhere('categories.name','LIKE','%'+searchParam+'%');
    } else if (parameters.category) {
      const category = parameters.category;
      query = query.where('categories.name','LIKE','%'+category+'%');
    }
    return query.then(result => {
      return result;
    })
    .catch(err => {
      console.log('Err: ' + err);
      });
  }

  router.get("/", (req, res) => {
      getAllResources(req.query).then(result => {
      res.send(result);
        });
    });

  router.get("/new", (req, res) => {
    if(dbUtils.isLoggedIn(req.session.user_id)){
      let userId = req.session.user_id;
      dbUtils.findUserById(userId, (err, result) => {
      if(err) console.error(err);
        let username = result[0].username;
        let email = result[0].email;
        let password = result[0].password;
        let templateVars = {
          user_id: userId,
          username: username,
          email: email,
          password: password
        };
        res.render('resource_new', {
          user_id: userId,
          username: username,
          email: email,
          password: password
        });
      });
    } else {
      res.redirect('/login');
    }
  });

  router.post("/new", (req, res) => {
    let userId = req.session.user_id;
    knex('resources').insert({ user_id: `${userId}`,
                                title: req.body.title,
                                description: req.body.description,
                                category_id: `${req.body.category}`,//knex.select('id').from('categories').where('id','=',req.body.category),
                                url: req.body.url
                                 })
                      .then( function(results) {
                          res.redirect('../');
                      });
                          });

  router.get("/:resource_id", (req, res) => {
    const templateVars = {
      user_id: 0
    };
    res.render('resource_show', templateVars);
  });

  router.post('/:resource_id/comments', (req, res) => {
    knex.insert('comment', 'user_id').from('comments').where('resource_id', 'like', '%' + req.params.resource_id + '%');
  });

  router.get("/:resource_id/edit", (req,res) => {
    res.render('resource_update');
  });

  router.post("/:resource_id/edit", (req, res) => {
    res.send("Made a post request to change ", req.params.resource_id);
  });

  router.post("/:resource_id/delete", (req, res) => {
    res.send("Made a post to delete " + req.params.resource_id);
  });

  router.post("/:resource_id/comment", (req, res) => {
    res.send("Made a comment post request to the post " + req.params.resource_id);
  });

  router.post("/:resource_id/like", (req, res) => {
    res.send("Made a like to post " + req.params.resource_id);
  });

  router.get("/:resource_id/rating" , (req, res) => {
    console.log('I am in the ratings');
    const resource = req.params.resource_id;
    knex('ratings').avg('ratings').where('resource_id','like',`${resource}`)
      .then(result => {
        console.log('I am in the server waiting' +result);
        res.send(result);
      })
      .catch(err => {
        console.log('Err: ' + err);
        });
  });

  router.post("/:resource_id/rating", (req, res) => {
    res.send("Made a rating to post " + req.params.resource_id);
  });

  return router;
};
