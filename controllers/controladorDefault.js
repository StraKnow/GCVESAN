const Post = require('../models/postModelo').Post
const Category = require('../models/categoriasModelo').Category
const Comment = require('../models/comentarioModelo').Comment
const bcrypt = require('bcryptjs')
const User = require('../models/usuarioModelo').User

module.exports = {

  niveles: (req, res) => {
    res.render('default/niveles')
  },

  indexPublicaciones: async (req, res) => {
    const posts = await Post.find().lean()
    const categories = await Category.find().lean()
    res.render('default/index', { posts: posts, categories: categories })
  },

  // Rutas login
  loginGet: (req, res) => {
    res.render('default/login', { message: req.flash('error') })
  },

  loginPost: (req, res) => {

  },

  // Rutas Registro

  registerGet: (req, res) => {
    res.render('default/registro')
  },

  registerPost: (req, res) => {
    const errors = []

    if (!req.body.firstName) {
      errors.push({ message: 'El nombre es obligatorio' })
    }
    if (!req.body.lastName) {
      errors.push({ message: 'El apellido es obligatorio' })
    }
    if (!req.body.email) {
      errors.push({ message: 'El email es obligatorio' })
    }
    if (!req.body.password || !req.body.passwordConfirm) {
      errors.push({ message: 'La contraseña es obligatoria' })
    }
    if (req.body.password !== req.body.passwordConfirm) {
      errors.push({ message: 'Las contraseñas no coinciden' })
    }

    if (errors.length > 0) {
      res.render('default/registro', {
        errors: errors,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      })
    } else {
      User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          req.flash('error-message', 'El email ya existe, intente ingresar.')
          res.redirect('/login')
        } else {
          const newUser = new User(req.body)

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              newUser.password = hash
              newUser.save().then(user => {
                req.flash('success-message', 'Estás ahora registrado')
                res.redirect('/login')
              })
            })
          })
        }
      })
    }
  },

  // Método postUnico
  getSinglePost: (req, res) => {
    const id = req.params.id

    Post.findById(id).lean()
      .populate({ path: 'comments', populate: { path: 'user', model: 'user' } })
      .then(post => {
        if (!post) {
          res.status(404).json({ message: 'Publicación no encontrada' })
        } else {
          res.render('default/postUnico', { post: post, comments: post.comments })
        }
      })
  },

  // Métodos comentarios
  submitComment: (req, res) => {
    if (req.user) {
      Post.findById(req.body.id).then(post => {
        const newComment = new Comment({
          user: req.user.id,
          body: req.body.comment_body
        })

        post.comments.push(newComment)
        post.save().then(savedPost => {
          newComment.save().then(savedComment => {
            req.flash('success-message', 'Tu comentario fue enviado para revisión.')
            res.redirect(`/postUnico/${post._id}`)
          })
        })
      })
    } else {
      req.flash('error-message', 'Ingrese primero para comentar')
      res.redirect('/login')
    }
  },

  apoyo: (req, res) => {
    res.render('default/apoyo')
  },

  pae: (req, res) => {
    res.render('default/pae')
  },

  fortalecimiento: (req, res) => {
    res.render('default/fortalecimiento')
  },

  actualizacionpp: (req, res) => {
    res.render('default/actualizacionpp')
  },

  mejoramiento: (req, res) => {
    res.render('default/mejoramiento')
  }

}
