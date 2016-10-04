'use strict'

const knex = require('./knex_config')


function addUser(userData){
  return knex('users').insert(userData)
}

function countOfUser(userName){
  return knex('users').count('user_name').where('user_name', userName);
}

function findUser(userName){
  return knex('users')
  .where('user_name', userName)
  .first()
}

function findUserbyName(userName){
  return knex('users')
    .where('users.user_name', userName).first()
}

function editUserName(userID, newUserName){
  return knex('users')
    .where('id', userID)
    .update({
      user_name: newUserName.user_name
    })
}

function editUserEmail(userID, newEmail){
  return knex('users')
    .where('id', userID)
    .update({
      email: newEmail.email
    })
}

function editUserPassword(userID, newPassword){
  return knex('users')
    .where('id', userID)
    .update({
      password: newPassword
    })
}
function deleteUser(userID){
  return knex('users')
    .where('users.id', userID)
    .del()
}

module.exports = {
  add: addUser,
  count: countOfUser,
  findUser: findUser,
  findUserbyName: findUserbyName,
  editName: editUserName,
  editEmail:editUserEmail,
  editPassword: editUserPassword,
  deleteUser: deleteUser
}
