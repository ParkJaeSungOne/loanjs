var express = require('express');
var router = express.Router();

router.get("/", function(req, res){
  res.render("size/index");
});

router.post("/calc", function(req, res){
  var t_type = req.body.t_type;
  var obj1 = req.body.obj1;

  if(t_type == "1"){
    obj1 = obj1 * 0.3025;
  }else{
    obj1 = obj1 * 3.305785;
  }
  obj1 = obj1.toFixed(2);

  var responseData = {'obj1' : obj1, 't_type' : t_type};
 res.json(responseData);
});

module.exports = router;
