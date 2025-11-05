import express from 'express';
import adminController from '../controller/admin.controller.js';
import upload from "../middleware/multer.js";

const router = express.Router();

// Add article
router.post('/article', upload.single("image"), adminController.addArticle);

// List articles (supports optional pagination via ?page=&limit=)
router.get('/articles', adminController.getArticles);

// Edit article - include image upload middleware since we support image updates
router.put('/article/:id', upload.single("image"), adminController.editArticle);

// Delete article
router.delete('/article/:id', adminController.deleteArticle);

export default router;
