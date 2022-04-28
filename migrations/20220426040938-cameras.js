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
  return db.createTable('cameras', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    name: {
      type: 'string',
      length: 100,
      notNull: true
    },
    stock: {
      type: 'smallint',
      unsigned: true,
      notNull: true,
    },
    cost: {
      type: 'smallint',
      unsigned: true,
      notNull: true
    },
    created_date: {
      type: 'date',
      notNull: true
    },
    description: 'text',
    camera_iso: {
      type: 'string',
      length: '30',
      notNull: false
    },
    shutter_speed: {
      type: 'string',
      length: '100',
      notNull: false
    },
    aperture: {
      type: 'string',
      length: '30',
      notNull: false
    },
    focal_length: {
      type: 'string',
      length: '30',
      notNull: false
    },
    flash: {
      type: 'string',
      length: '30',
      notNull: false
    },
    battery: {
      type: 'string',
      length: '30',
      notNull: false
    },
    body_color: {
      type: 'string',
      length: '30',
      notNull: false
    },
    format: {
      type: 'string',
      length: '30',
      notNull: false
    },
    weight: {
      type: 'string',
      length: '30',
      notNull: false
    }
  });
};

exports.down = function (db) {
  return db.dropTable('cameras')
};

exports._meta = {
  "version": 1
};