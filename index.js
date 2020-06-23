const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const coursesRoutes = require('./routes/courses')

const app = express()

// set template
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// parses incoming requests with urlencoded payloads
app.use(express.urlencoded({extended: true}))

// routes
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/cart', cartRoutes)

const PORT = process.env.PORT || 3000

async function start() {
  try {
    const url = `mongodb+srv://roman:lLWy8zrsctEWkzjG@cluster0.ku1hd.mongodb.net/<dbname>?retryWrites=true&w=majority`
    await mongoose.connect(url, {useNewUrlParser: true})
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch(e) {
    console.log(e)
  }
}

start()

