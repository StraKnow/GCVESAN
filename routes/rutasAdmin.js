const express = require('express')
const router = express.Router()
const adminController = require('../controllers/controladorAdmin')
const { isUserAuthenticated } = require('../config/funcionesPersonalizadas')

router.all('/*', isUserAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin'

  next()
})

// Rutas Admin index

router.route('/')
  .get(adminController.index)

// Rutas publicaciones get, post, put, delete

router.route('/publicaciones')
  .get(adminController.getPosts)

router.route('/publicaciones/crear')
  .get(adminController.getCreatePostPage)
  .post(adminController.submitCreatePostPage)

router.route('/publicaciones/editar/:id')
  .get(adminController.getEditPostPage)
  .put(adminController.submitEditPostPage)

router.route('/publicaciones/borrar/:id')
  .delete(adminController.deletePost)

// Rutas Categorias Admin

router.route('/categorias')
  .get(adminController.getCategories)

router.route('/categorias/crear')
  .post(adminController.createCategories)

router.route('/categorias/editarCategorias/:id')
  .get(adminController.getEditCategoriesPage)
  .post(adminController.submitEditCategoriesPage)

// Rutas Categorias Admin
router.route('/comentarios')
  .get(adminController.getComments)
  .post(adminController.approveComments)

module.exports = router
