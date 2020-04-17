const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

const categoriesController = require('./categories/categoriesController')
const articlesController = require('./articles/articlesController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')

// View engine
app.set('view engine', 'ejs')

// Body parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Static
app.use(express.static('public'))

// Database
connection.authenticate()
          .then(() => console.log('Conexao feita com sucesso'))
          .catch(err => console.error(err))

app.use('/', categoriesController)
app.use('/', articlesController)

app.get('/', (req, res) => {
  Article.findAll().then(articles => {
    res.render('index', {articles: articles})
  })
})

app.get('/:slug', (req, res) => {
  var slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article != undefined){
      res.render('article', {article: article})
    } else {
      res.redirect('/')
    }
  }).catch (err => {
    res.redirect('/')
  })
})

app.listen(8080, (err) => {
  if(err) console.log(err)
  console.log("O servidor esta rodando")
})