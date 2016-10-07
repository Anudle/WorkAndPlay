'use strict'

const express = require('express')
const router = express.Router()

const postModel = require('../model/posts_query')
const commentsModel = require('../model/comments_query')


router.get('/', (req, res, next) => {
  postModel.getAllPosts()
  .then(function(data){
  res.render('index', {posts: data,
                       title: 'Work and Play in Paraguay'})
                         })
})

router.get('/:id/update', (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('Can\'t access route when not logged in')
        res.redirect('/users/login')
        return
    }
    postModel.retrievePost(req.params.id)
        .then((data) => {
            console.log('editing the post')
            res.render('editPost', {
                data: data[0]
            })
            console.log('this is data:' + JSON.stringify(data))
        })
        .catch((err) => {

            console.error('Error caught in updating post from DB')
            next(err)
        })
})

router.post('/:id/update', (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('Cannot update post when not logged in!')
        res.redirect('/users/login')
        return
    }
    postModel.updatePost(req.params.id, req.body)
        .then(() => {
            res.redirect('/posts/' + req.params.id)
        })
        .catch((err) => {
            console.error('Error caught in updating post from DB')
            next(err)
        })
})

router.get('/v1/API', (req, res, next) => {
  postModel.getAllPostsWithCommentCount().then(count => res.json(count.rows))
})


module.exports = router
