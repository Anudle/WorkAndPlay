exports.up = function(knex, Promise) {
  return knex.schema.createTable('comments', function(table) {
    table.increments('id').primary();
    table.text('created_at');
    table.integer('post_id')
      .references('posts.id')
      .onDelete('CASCADE');
    table.integer('commenter_id')
      .references('users.id')
      .onDelete('CASCADE');
    table.text('body');
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('comments')
}
