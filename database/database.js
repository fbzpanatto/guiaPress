// const Sequelize = require('sequelize')

// const connection = new Sequelize('guiapress', 'root', 'fnp181292', {
//   host: 'localhost',
//   dialect: 'mysql',
//   timezone: '-03:00'
// })

// module.exports = connection

const Sequelize = require('sequelize')

const connection = new Sequelize('guiapress91', 'fbzpanatto', 'fnp181292', {
  host: 'mysql669.umbler.com',
  dialect: 'mysql',
  timezone: '-03:00'
})

module.exports = connection