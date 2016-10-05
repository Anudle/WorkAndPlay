exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function(table) {
    table.increments('id').primary();
    table.text('created_at');
    table.integer('user_id')
      .references('users.id')
      .onDelete('CASCADE');
    table.text('postBody');
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('posts')
}
