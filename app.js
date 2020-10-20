// Importando diferentes módulos
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const hbs = require('express-handlebars')
const { mongoDbUrl, PORT, variablesGlobales } = require('./config/configuracion')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const { selectOption } = require('./config/funcionesPersonalizadas')
const fileUpload = require('express-fileupload')
const passport = require('passport')

const app = express()

// Configuración de Mongoose a MongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(response => {
    console.log('MongoDB Conectada correctamente.')
  }).catch(err => {
    console.log(`Falló la conexión a MongoDB. ${err}`)
  })

// configuración de Express
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// Flash y Session
app.use(session({
  secret: 'anysecret',
  saveUninitialized: true,
  resave: true
}))

app.use(flash())

// Inicializar passport
app.use(passport.initialize())
app.use(passport.session())

// Uso de variables globales
app.use(variablesGlobales)

// Subir Archivos Middleware
app.use(fileUpload())

// Configuracion del motor de vista con Handlebars
app.engine('.hbs', hbs({ defaultLayout: 'main', extname: '.hbs', helpers: { select: selectOption } }))
app.set('view engine', '.hbs')

// Método Override Middleware
app.use(methodOverride('newMethod'))

// Rutas y uso
const rutasDefault = require('./routes/rutasDefault')
const rutasAdmin = require('./routes/rutasAdmin')

app.use('/', rutasDefault)
app.use('/admin', rutasAdmin)

// Servidor en escucha
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
