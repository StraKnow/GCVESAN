const Post = require('../models/postModelo').Post
const Category = require('../models/categoriasModelo').Category
const Comment = require('../models/comentarioModelo').Comment
const { isEmpty } = require('../config/funcionesPersonalizadas')

module.exports = {

  index: (req, res) => {
    res.render('admin/indexAdmin')
  },

  // Publicaciones Admin

  getPosts: (req, res) => {
    Post.find().lean()
      .populate('category')
      .then(posts => {
        res.render('admin/publicaciones/indexPublicaciones', { posts: posts })
      })
  },

  getCreatePostPage: (req, res) => {
    Category.find().lean().then(cats => {
      res.render('admin/publicaciones/crear', { categories: cats })
    })
  },

  submitCreatePostPage: (req, res) => {
    const commentsAllowed = !!req.body.allowComments

    // Verificacion de archivos
    let filename = ''

    if (!isEmpty(req.files)) {
      const file = req.files.uploadedFile
      filename = file.name
      const uploadDir = './public/uploads/'

      file.mv(uploadDir + filename, (err) => {
        if (err) { throw err }
      })
    }

    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      allowComments: commentsAllowed,
      category: req.body.category,
      file: `/uploads/${filename}`
    })

    newPost.save().then(post => {
      req.flash('success-message', 'Publicación creada correctamente.')
      res.redirect('/admin/publicaciones')
    })
  },

  getEditPostPage: (req, res) => {
    const id = req.params.id

    Post.findById(id).lean().then(post => {
      Category.find().lean().then(cats => {
        res.render('admin/publicaciones/editar', { post: post, categories: cats })
      })
    })
  },

  submitEditPostPage: (req, res) => {
    const commentsAllowed = !!req.body.allowComments
    const id = req.params.id
    Post.findById(id)
      .then(post => {
        post.title = req.body.title
        post.status = req.body.status
        post.allowComments = commentsAllowed
        post.description = req.body.description
        post.category = req.body.category

        post.save().then(updatePost => {
          req.flash('success-message', `La publicación ${updatePost.title} ha sido actualizada.`)
          res.redirect('/admin/publicaciones')
        })
      })
  },

  deletePost: (req, res) => {
    Post.findByIdAndDelete(req.params.id).lean()
      .then(deletedPost => {
        req.flash('success-message', `La publicación ${deletedPost.title} ha sido borrada.`)
        res.redirect('/admin/publicaciones')
      })
  },

  // Todos los métodos de categorías
  getCategories: (req, res) => {
    Category.find().lean().then(cats => {
      res.render('admin/categorias/indexCategorias', { categories: cats })
    })
  },

  createCategories: (req, res) => {
    const categoryName = req.body.name

    if (categoryName) {
      const newCategory = new Category({
        title: categoryName
      })

      newCategory.save().then(category => {
        res.status(200).json(category)
      })
    }
  },

  getEditCategoriesPage: async (req, res) => {
    const catId = req.params.id

    const cats = await Category.find().lean()

    Category.findById(catId).lean().then(cat => {
      res.render('admin/categorias/editarCategorias', { category: cat, categories: cats })
    })
  },

  submitEditCategoriesPage: (req, res) => {
    const catId = req.params.id
    const newTitle = req.body.name

    if (newTitle) {
      Category.findById(catId).then(category => {
        category.title = newTitle

        category.save().then(updated => {
          res.status(200).json({ url: '/admin/categorias' })
        })
      })
    }
  },

  // Métodos de comentarios
  getComments: (req, res) => {
    Comment.find().lean()
      .populate('user')
      .then(comments => {
        res.render('admin/comentarios/indexComentarios', { comments: comments })
      })
  },

  approveComments: (req, res) => {
    var data = req.body.data
    var commentId = req.body.id

    console.log(data, commentId)

    Comment.findById(commentId).then(comment => {
      comment.commentIsApproved = data
      comment.save().then(saved => {
        res.status(200).send('OK')
      }).catch(err => {
        res.status(201).send(`FAIL ${err}`)
      })
    })
  }

}
