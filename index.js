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
  Article.findAll({
    order:[['id', 'DESC']]
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', {articles: articles, categories: categories})
    })
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
      Category.findAll().then(categories => {
        res.render('article', {article: article, categories: categories})
      })
    } else {
      res.redirect('/')
    }
  }).catch (err => {
    res.redirect('/')
  })
})

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{model: Article}]
  }).then(category => {
    if(category != undefined){

      Category.findAll().then(categories => {
        res.render('index', {articles: category.articles, categories: categories})
      })
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