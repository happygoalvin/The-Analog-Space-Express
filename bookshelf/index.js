const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'foo',
        password: 'tgc16bar',
        database: 'the_analog_space'
    }
})
const bookshelf = require('bookshelf')(knex)

module.exports = bookshelf;