'use strict'

const knex = require('./knex_config')


function getAllPosts(){
  return knex('posts')
    .join('users', 'users.id', 'posts.user_id') //leftJoin to view posts w missing id's
    .select(
      'users.id as userId',
      'users.user_name',
      'posts.id as postID',
      'posts.created_at',
      'posts.wins',
      'posts.losses',
      'posts.learned'
    )
}
function getAllPostsWithCommentCount() {
  return knex.raw(`
    select p.id as postID, count(c.post_id) as comment_count, u.user_name, p.created_at, p.wins, p.losses, p.learned
    from posts as p
    left join comments as c
    on c.post_id = p.id
    left join users as u
    on u.id = p.user_id
    group by p.id, u.user_name
    order by postID desc
  `)
}

function getPostByID(id){
  return knex('posts')
    .join('users', 'users.id', 'posts.user_id')
    .select(
      'users.id as userId',
      'users.user_name',
      'posts.id as postID',
      'posts.created_at',
      'posts.wins',
      'posts.losses',
      'posts.learned'
    )
    .where('posts.id', id).first()
}

function insertNewPost(postContent, userID, postTime){
  return knex('posts')
    .insert({
      created_at: postTime,
      user_id: userID,
      wins: postContent.wins,
      losses: postContent.losses,
      learned: postContent.learned
    })
}

function retrievePost(postID){
  return knex('posts')
    .where('id', postID)
}

function updatePost(postID, postContent){
  return knex('posts')
    .where('id', postID)
    .update({
      wins: postContent.wins,
      losses: postContent.losses,
      learned: postContent.learned
    })
}

function deletePost(postID){
  return knex('posts')
    .where('id', postID)
    .del()
}

module.exports = {
  getAllPosts: getAllPosts,
  getPostByID: getPostByID,
  insertNewPost: insertNewPost,
  retrievePost: retrievePost,
  updatePost: updatePost,
  deletePost: deletePost,
  getAllPostsWithCommentCount: getAllPostsWithCommentCount
}
