var express = require('express');
var router = express.Router();

// var dataCardBike =[];
var dataBike = [
  {name: "Model GUIB45", url:"/images/bike-1.jpg", price: 679},
  {name: "Model ZOOK7", url:"/images/bike-2.jpg", price: 799},
  {name: "Model UYAR89", url:"/images/bike-3.jpg", price: 839},
  {name: "Model VERS77", url:"/images/bike-4.jpg", price: 1299},
  {name: "Model TITAN5", url:"/images/bike-5.jpg", price: 559},
  {name: "Model GINE39", url:"/images/bike-6.jpg", price: 999}
]

/* GET home page. */
router.get('/', function(req, res, next) {

  if (!req.session.dataCardBike) {
    req.session.dataCardBike = [];
  }

  res.render('index', { dataBike:dataBike });
});

//route du panier
router.get('/shop', function(req, res, next) {
  res.render('shop', {dataCardBike: req.session.dataCardBike});
});

//ajout dans le panier
router.post('/add-shop', function(req, res, next) {

  var check = false;
  for (var i = 0; i < req.session.dataCardBike.length; i++) {
    if (req.body.name === req.session.dataCardBike[i].name) {
      req.session.dataCardBike[i].quantity++;
      check = true;
    }
  }

  if (check === false) {
    req.session.dataCardBike.push(req.body)
  }

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});

//suppr d'un element du panier
router.get('/delete-shop', function(req, res, next) {
  req.session.dataCardBike.splice(req.query.position, 1)
  res.render('shop', {dataCardBike: req.session.dataCardBike});
});

//modification d'un element du panier
router.post('/update-shop', function(req, res, next) {

  if (req.body.quantity <= 0) {
    req.session.dataCardBike.splice(req.body.position, 1)
  } else {
    req.session.dataCardBike[req.body.position].quantity = parseInt(req.body.quantity);
  }

  res.render('shop', {dataCardBike: req.session.dataCardBike});
});


router.post('/checkout', function(req, res) {

  var stripe = require("stripe")("pk_test_vBeV2C4ImP7ljsJN5BGQINgB");
  const token = req.body.stripeToken; // Using Express
  const charge = stripe.charges.create({
    amount: req.body.totalCmd,
    currency: 'eur',
    description: 'Example charge',
    source: token,
  });
  req.session.overallCmd = req.session.dataCardBike;
  req.session.totalAmount = req.body.totalCmd / 100;
  req.session.dataCardBike = [];
  res.render('checkout', {overallCmd: req.session.overallCmd, totalAmount: req.session.totalAmount});
});


router.post('/cleancard', function(req, res) {
  req.session.dataCardBike = [];
  res.render('shop', {dataCardBike: req.session.dataCardBike});
})

module.exports = router;
