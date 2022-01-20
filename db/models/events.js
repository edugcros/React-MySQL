'use strict';
module.exports = (sequelize, DataTypes) => {
  const events = sequelize.define(
    'events',
    {
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    slug: DataTypes.STRING,
  },
    {
      hooks: {
        beforeCreate: function(event, options) {
          // Do stuff
          event.slug = event.title
            .toLowerCase()
            .replace(/[^A-Za-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-');
        },
      },
    },
  );
  events.associate = function(models) {
    // associations can be defined here
    events.belongsTo(models.users, { as: 'user' });
  };
  return events;
};