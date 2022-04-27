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
  return db.createTable('cameras_classifications', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true,
      notNull: true
    },
    camera_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'cameras_classifications_camera_fk',
        table: 'cameras',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    classification_id: {
      type: 'int',
      notNull: true,
      unsigned: true,
      foreignKey: {
        name: 'cameras_classifications_classification_fk',
        table: 'classifications',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    }
  })
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  "version": 1
};