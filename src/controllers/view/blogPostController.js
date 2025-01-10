"use strict";
/* -------------------------------------------------------
    EXPRESSJS - BLOG Project with Mongoose
------------------------------------------------------- */

const BlogPost = require("../../models/blogPostModel");
const BlogCategory = require("../../models/blogCategoryModel");
const removeQueryParam = require("../../helpers/removeQueryParam");
const blogCategoryModel = require("../../models/blogCategoryModel");
// ------------------------------------------
// BlogPost
// ------------------------------------------

module.exports = {
  list: async (req, res) => {
    const posts = await res.getModelList(
      BlogPost,
      { isPublished: true },
      "blogCategoryId"
    ); // 10

    const categories = await BlogCategory.find({});

    const recentPosts = await BlogPost.find()
      .sort({ createdAt: "desc" })
      .limit(3);

    const details = await res.getModelListDetails(BlogPost, {
      isPublished: true,
    });

    let pageUrl = "";
    const queryString = req.originalUrl.split("?")[1];

    if (queryString) {
      pageUrl = removeQueryParam(queryString, "page");
    }

    pageUrl = pageUrl ? "&" + pageUrl : "";

    res.render("index", { categories, posts, recentPosts, details, pageUrl });
  },

  create: async (req, res) => {
    if (req.method == "POST") {

      req.body.userId = req.session?.user.id;

      const data = await BlogPost.create(req.body);

      if(data) res.redirect('/blog/post')
    
    } else {
      
      const categories = await BlogCategory.find();
      
      res.render("postForm", { categories,post:null });
    }
  },

  read: async (req, res) => {
    // req.params.postId
    // const data = await BlogPost.findById(req.params.postId)
    const post = await BlogPost.findOne({ _id: req.params.postId }).populate(
      "blogCategoryId"
    );

    res.render("postRead", { post });
  },

  update: async (req, res) => {
    // const data = await BlogPost.findByIdAndUpdate(req.params.postId, req.body, { new: true }) // return new-data
    const data = await BlogPost.updateOne(
      { _id: req.params.postId },
      req.body,
      { runValidators: true }
    );

        if (req.method == "POST") {

          const data = await BlogPost.updateOne(
            { _id: req.params.postId },
            req.body,
            { runValidators: true }
          );

          if (data) res.redirect("/blog/post");
        } else {
  const post = await BlogPost.findOne({ _id: req.params.postId }).populate(
  "blogCategoryId"
);

          const categories = await BlogCategory.find();

          res.render("postForm", { categories,post });
        }

  },

  delete: async (req, res) => {
    const data = await BlogPost.deleteOne({ _id: req.params.postId });

    res.redirect('/blog/post')

  },
};
