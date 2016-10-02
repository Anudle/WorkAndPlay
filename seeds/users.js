exports.seed = function(knex, Promise) {
    return knex.schema.createTable('users,'function(table) {
        table.increments('id').primary();
        table.string('user_name');
        table.string('password');
        table.string('email');
    })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users')
}
