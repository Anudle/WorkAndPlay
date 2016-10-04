'use strict'

const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const passport = require('../passport')
const userModel = require('../model/users_query')


/* GET login page */
router.get('/', (req, res, next) => {
  if(!req.isAuthenticated()){
    console.log('Can\'t access route when not logged in')
    res.redirect('/users/login')
    return
  }
  res.redirect('/users/dashboard')
})

/* GET registration page */
router.get('/register', (req, res, next) => {
  if(req.isAuthenticated()){
    console.log('Can\'t access route when logged in')
    res.redirect('/users/dashboard')
    return
  }
  res.render('register')
})

/* Register a new user */
router.post('/register', (req, res, next) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.render('error', {message:"Please fill in all fields"})
    return
  }
  userModel.count(req.body.username)
    .then((num) => {
      console.log('num is: ', num, 'num.count is: ', num[0].count)
      if (parseInt(num[0].count) > 0){
        res.render('error', {message: 'Username is taken.'})
      } else {
        let userData = {
          user_name: req.body.username,
          password: bcrypt.hashSync(req.body.password, 8),      // passwords are never stored in plain text
          email: req.body.email
        }
        userModel.add(userData)
          .then(() =>{
            res.redirect('/users/login')
          })
          .catch((err) => {
            console.log(err)
            res.render('error', {message: 'error in inserting user data into database'})
          })
      }
    })
})

  router.get('/login', (req, res, next) => {
    res.render('login')
})

/* Authenticate the login of a user */

// router.post('/login', (req, res, next) => {
//   if (!req.body.username || !req.body.password) {
//     res.render('error', {message: "Please fill in all fields"})
//   } else {
//     userModel.count(req.body.username)
//     .then((num) => {
//       if (parseInt(num[0].count) === 0){
//         res.render('error', {message: 'User is not registered.'})
//       } else {
//         passport.authenticate('local', {
//           successRedirect: '/users/dashboard',
//           failureRedirect: '/users/login'
//         })
//       }
//     })
//   }
// })


/* Authenticate the user from /users/login */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/users/dashboard',
  failureRedirect: '/users/login'
}))

router.get('/dashboard', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/users/login')
    return
  }
  console.log(req.user);
  res.render('dashboard', {userData: req.user})
})

/* Clear the session and unauthenticate the user */
router.get('/logout', (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log('Cannot logout when not logged in')
    res.redirect('/users/login')
    return
  }
  req.logout()
  res.redirect('/')
})

/* Update Username*/
router.get('/update/:userInfo/:userID', (req, res, next) => {
  if (!req.isAuthenticated() || parseInt(req.params.userID) !== req.user.id) {
    res.render('error', {message: 'Access this route is denied'})
    return
  }
  res.render('editUserInfo', {
    targetedInfo: req.params.userInfo,
    userID: req.params.userID
  })
})

// router.post('/update/user_name/:userID', (req, res, next) => {
//   if (!req.isAuthenticated() || parseInt(req.params.userID) !== req.user.id) {
//     console.log('Cannot access this route when not logged in')
//     res.render('error', {message: 'Access this route is denied'})
//     return
//   }
//   userModel.editUserName(req.params.userID, req.body)
//     .then((data)=>{
//       console.log(data);
//       req.logout()
//       res.redirect('/users/login')
//     })
// })

router.post('/update/:userInfo/:userID', (req, res, next) => {
  if (!req.isAuthenticated() || parseInt(req.params.userID) !== req.user.id) {
    console.log('Cannot access this route when not logged in')
    res.render('error', {message: 'Access this route is denied'})
    return
  }
  let userInfo = req.params.userInfo
  switch(userInfo) {
    case 'user_name':
      userModel.editName(req.params.userID, req.body)
        .then((data)=>{
          req.logout()
          res.redirect('/users/login')
        })
      break
    case 'email':
      userModel.editEmail(req.params.userID, req.body)
        .then((data)=>{
          res.redirect('/users/dashboard')
        })
      break
    case 'password':
      let password = bcrypt.hashSync(req.body.password, 8)
      userModel.editPassword(req.params.userID, password)
        .then((data)=>{
          req.logout()
          res.redirect('/users/login')
        })
      break
  }
})


/* Delete your account */
router.get('/delete/:userID', (req, res, next) => {
  if (!req.isAuthenticated() ||  parseInt(req.params.userID) !== req.user.id) {
    console.log('Access this route is denied.')
    res.render('error', {message: 'Access this route is denied'})
    return
  }
  userModel.deleteUser(req.params.userID)
    .then(() => {
      req.logout()
      res.redirect('/users/accountclosed')
    })
})

/* page rendered after deleting account */
router.get('/accountclosed', (req, res, next) => {
  res.render('accountClosed')
})

module.exports = router
