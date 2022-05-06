'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable('reviews', {
    id: {
      type: 'int',
      unsigned: true,
      primaryKey: true,
      autoIncrement: true,
      notNull: true
    },
    rating: {
      type: 'smallint',
      unsigned: true,
      notNull: false
    },
    comments: 'text',
    review_datetime: {
      type: 'datetime',
      notNull: false
    },
    modified_datetime: {
      type: 'datetime',
      notNull: false
    },
    user_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'reviews_user_fk',
        table: 'users',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    camera_id: {
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'reviews_camera_fk',
        table: 'cameras',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    }
  })
};

exports.down = function (db) {
  return db.dropTable('reviews')
};

exports._meta = {
  "version": 1
};