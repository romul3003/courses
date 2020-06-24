const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const cartRoutes = require('./routes/cart')
const coursesRoutes = require('./routes/courses')
const User = require('./models/user')

const app = express()

// set template
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

// castom middleware - mock active user
app.use(async(req, res, next) => {
  try {
    const user = await User.findById('5ef3940ba197b53ac0bd4cbd')
    req.user = user
    next()
  } catch (e) {
    console.log(e)
  }
})

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
    const url = `mongodb+srv://roman:lLWy8zrsctEWkzjG@cluster0.ku1hd.mongodb.net/shop`
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })

    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'romul3003@gmail.com',
        name: 'Roman',
        cart: {items: []}
      })
      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch(e) {
    console.log(e)
  }
}

start()

