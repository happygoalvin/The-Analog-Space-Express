const bookshelf = require('../bookshelf')

const Camera = bookshelf.model('Camera', {
    tableName: 'cameras'
});

const Type = bookshelf.model('Type', {
    tableName: 'types'
})

const Classification = bookshelf.model('Classification', {
    tableName: 'classifications'
})

module.exports = {
    Camera,
    Type,
    Classification
};