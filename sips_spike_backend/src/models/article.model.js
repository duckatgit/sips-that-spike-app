import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  image: {
    type: String,
    trim: true
  },
   description: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    unique: true,
  },
  subTitle: {  
    type: String,
  },
  nutritionist: {
    type: String,
  },
},{ timestamps: true });

const Article = mongoose.model('Article', articleSchema);

export default Article;
