const bcrypt = require('bcryptjs')

const express = require('express')
const router = express.Router()
const User = require('./User')

router.get('/admin/users', (req, res) => {
  User.findAll().then(users => {
    res.render('admin/users/index', {users: users})
  })
})

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create')
})

router.post('/users/create', (req, res) => {
  var email = req.body.email
  var password = req.body.password

  User.findOne({where: {email: email}}).then(user => {

    if(!user){

      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(password, salt)
    
      return User.create({
        email: email,
        password: hash
      }).then(() => {
        res.redirect('/admin/users')
      }).catch(() => {
        res.redirect('/admin/users')
      })
    }

    res.redirect('/admin/users/create')

  })
})

router.get('/admin/users/edit/:id', (req, res) => {
  const { id } = req.params
  User.findOne({where: { id }}).then(user => {
    res.render('admin/users/edit', {user: user})
  })
})

router.post('/users/update', (req, res) => {
  const { id, email} = req.body

  User.findOne({where: {email: email}}).then(user => {

    if(!user){

      return User.update({email: email}, {where: { id }}).then(() => {
        res.redirect('/admin/users')
      })
    }
    res.redirect('/admin/users')
  })
})

router.post('/users/delete', (req, res) => {
  const { id } = req.body

  User.destroy({where: { id }}).then(() => {
    res.redirect('/admin/users')
  })
})

router.get('/login', (req, res) => {
  res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
  const { email, password } = req.body

  User.findOne({where: {email: email}}).then(user => {
    if(user){
      const correct = bcrypt.compareSync(password, user.password)

      if(correct){
        req.session.user = {
          id: user.id,
          email: user.email
        }
        res.redirect('/admin/articles')
      } else {
        res.redirect('/login')
      }
    } else {
      res.redirect('/login')
    }
  })

})

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.redirect('/')
})


module.exports = router