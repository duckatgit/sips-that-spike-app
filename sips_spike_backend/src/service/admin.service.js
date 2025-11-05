import logger from '../../config/logger.js';
import Article from '../models/article.model.js';



//addArticle
const addArticle = async (articleData) => {
  try {
    const article = await Article.create(articleData);
    return article;
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    throw new Error(error.message);
  }
};

const editArticle = async (articleId, updates) => {
  try {
    const article = await Article.findByIdAndUpdate(
      articleId,
      { $set: updates },
      { new: true }
    );
    return article;
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    throw new Error(error.message);
  }
};

const deleteArticle = async (articleId) => {
  try {
    const article = await Article.findByIdAndDelete(articleId);
    return article;
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    throw new Error(error.message);
  }
};

// getArticles - supports optional pagination via query: { page, limit }
const getArticles = async (query = {}) => {
  try {
    const page = parseInt(query.page, 10) || 0;
    const limit = parseInt(query.limit, 10) || 0;

    if (page > 0 && limit > 0) {
      const skip = (page - 1) * limit;
      const [articles, total] = await Promise.all([
        Article.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
        Article.countDocuments(),
      ]);
      return { articles, total };
    }

    const articles = await Article.find().sort({ createdAt: -1 });
    return { articles, total: articles.length };
  } catch (error) {
    logger.error(error.message, { stack: error.stack });
    throw new Error(error.message);
  }
};

export default {
  addArticle,
  editArticle,
  deleteArticle,
  getArticles
};