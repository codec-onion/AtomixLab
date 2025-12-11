import express from 'express'
import { getDependentCourses, reassignAndDelete } from '../controllers/reassignmentController.js'
import { protect, restrictTo } from '../middlewares/authMiddleware.js'

const router = express.Router()

// Routes protégées (admin uniquement)
router.get(
  '/:resourceType/:id/dependencies',
  protect,
  restrictTo('admin'),
  getDependentCourses
)

router.post(
  '/:resourceType/:oldId/reassign',
  protect,
  restrictTo('admin'),
  reassignAndDelete
)

export default router
