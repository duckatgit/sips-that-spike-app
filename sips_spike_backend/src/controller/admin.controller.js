import dotenv from 'dotenv';
import adminServices from '../service/admin.service.js';
import logger from '../../config/logger.js';
import { validationResult } from 'express-validator';
import commonHelper from '../helper/commonHelper.js';


const addArticle = async (req, res) => {
  try {
    // let role = req.user.role;
    // if (role !== "admin") {
    //   return res.status(403).json({ error: 'Only admin can add articles' });
    // }
    const { title, description, subTitle, nutritionist } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const postData = {
      image: file.filename,
      title,
      description,
      subTitle,
      nutritionist,
    };
    const addArticle = await adminServices.addArticle(postData);
    res.status(201).json({ message: 'Article added successfully', addArticle });
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    res.status(500).json({ error: error.message });
  }
};


const editArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const { title, description, subTitle, nutritionist } = req.body;
    const updates = { title, description, subTitle, nutritionist };

    if (req.file) {
      updates.image = req.file.originalname;
    }

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const updatedArticle = await adminServices.editArticle(articleId, updates);
    if (!updatedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json({
      message: 'Article updated successfully',
      article: updatedArticle,
      imageUpdated: !!req.file
    });
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    res.status(500).json({ error: error.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const articleId = req.params.id;
    const deletedArticle = await adminServices.deleteArticle(articleId);

    if (!deletedArticle) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    res.status(500).json({ error: error.message });
  }
};

const getArticles = async (req, res) => {
  try {
    // Support optional pagination via query params: ?page=1&limit=10
    const result = await adminServices.getArticles(req.query || {});
    // result: { articles, total }
    res.status(200).json({ articles: result.articles, total: result.total });
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    res.status(500).json({ error: error.message });
  }
};

export default {
  addArticle,
  editArticle,
  deleteArticle
  , getArticles
};

