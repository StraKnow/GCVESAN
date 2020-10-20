const express = require('express')
const router = express.Router()
const defaultController = require('../controllers/controladorDefault')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/usuarioModelo').User

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'main'
  next()
})

// Ruta Default Index
router.route('/')
  .get(defaultController.niveles)

router.route('/indexPublicaciones')
  .get(defaultController.indexPublicaciones)

// Definiendo una Estrategia Local
passport.use(new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({ email: email }).then(user => {
    if (!user) {
      return done(null, false, req.flash('error-message', 'Usuario no encontrado con este email.'))
    }

    bcrypt.compare(password, user.password, (err, passwordMatched) => {
      if (err) {
        return err
      }

      if (!passwordMatched) {
        return done(null, false, req.flash('error-message', 'Usuario o password incorrectos'))
      }

      return done(null, user, req.flash('success-message', 'Login Exitoso'))
    })
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user)
  })
})

// Ruta Login get y post
router.route('/login')
  .get(defaultController.loginGet)
  .post(passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
    session: true
  }), defaultController.loginPost)

// Ruta Registro get y post
router.route('/registro')
  .get(defaultController.registerGet)
  .post(defaultController.registerPost)

router.route('/postUnico/:id')
  .get(defaultController.getSinglePost)
  .post(defaultController.submitComment)

router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success-message', 'Se cerró sesión satisfactoriamente')
  res.redirect('/')
})

router.route('/apoyo')
  .get(defaultController.apoyo)

router.route('/pae')
  .get(defaultController.pae)

router.route('/fortalecimiento')
  .get(defaultController.fortalecimiento)

router.route('/actualizacionpp')
  .get(defaultController.actualizacionpp)

router.route('/mejoramiento')
  .get(defaultController.mejoramiento)

module.exports = router
