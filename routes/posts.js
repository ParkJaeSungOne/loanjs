var express = require('express');
var router = express.Router();
var Post = require('../models/Post');

router.get("/", function(req, res){
 Post.find({}).sort("-createdAt").exec(function(err, posts){
  if(err) return res.json(err);
  res.render("posts/index", {posts:posts});
 });
});

router.get("/new", function(req, res){
 res.render("posts/new");
});

router.post("/new", function(req, res){
 Post.create(req.body, function(err, post){
  if(err) return res.json(err);
  res.redirect("/posts");
 });
});

router.get("/:id", function(req, res){
 Post.findOne({_id:req.params.id}, function(err, post){
  if(err) return res.json(err);
  res.render("posts/show", {post:post});
 });
});

router.get("/:id/edit", function(req, res){
 Post.findOne({_id:req.params.id}, function(err, post){
  if(err) return res.json(err);
  res.render("posts/edit", {post:post});
 });
});

router.put("/:id", function(req, res){
 req.body.updatedAt = Date.now(); // 2
 Post.findOneAndUpdate({_id:req.params.id}, req.body, function(err, post){
  if(err) return res.json(err);
  res.redirect("/posts/"+req.params.id);
 });
});

router.delete("/:id", function(req, res){
 Post.remove({_id:req.params.id}, function(err){
  if(err) return res.json(err);
  res.redirect("/posts");
 });
});

module.exports = router;
