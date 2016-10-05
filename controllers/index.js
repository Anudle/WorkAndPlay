'use strict'

const express = require('express')
const router = express.Router()

const postModel = require('../model/posts_query')
const commentsModel = require('../model/comments_query')

/* GET index page & render all posts within database  */
router.get('/', (req, res, next) => {
  // // postModel.getAllPostsWithCommentCount()
  //   .then((post) => {
      res.render('index', {
                          //  posts:post.rows,
                           title: 'Work and Play in Paraguay'})
    // })
    .catch((err) => {
      console.error('Error getting from database!')
      next(err)
    })
})

router.get('/v1/API', (req, res, next) => {
  postModel.getAllPostsWithCommentCount().then(count => res.json(count.rows))
})


module.exports = router
