const jwt = require("jsonwebtoken")

require("dotenv").config()
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="/inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the single vehichle view HTML
 * ************************************ */
Util.buildVehicleDetails = async function (data, isLoggedin) {
  console.log(data);
  /*
    
  {
    inv_id: 6,
    inv_make: 'Lamborghini',
    inv_model: 'Adventador',
    inv_year: '2016',
    inv_description: 'This V-12 engine packs a punch in this sporty car. Make sure you wear your seatbelt and obey all traffic laws. ',
    inv_image: '/images/vehicles/adventador.jpg',
    inv_thumbnail: '/images/vehicles/adventador-tn.jpg',
    inv_price: '417650',
    inv_miles: 71003,
    inv_color: 'Blue',
    classification_id: 2
  }
  */
  let details = '<div class="vehicle-details">';
  // details += '<div>';
  details += '<img  class="vehicle-detail-img" src="' + data[0].inv_image + '" alt="Image of ' + data[0].inv_make + ' ' + data[0].inv_model + ' on CSE Motors" />';
  // details += '</div>';
  details += '<div class="detail-container">'
  details += '<h2>' + data[0].inv_make + ' ' + data[0].inv_model + ' Details</h2>';
  if(isLoggedin){
    if(data[0].account_id == null){
      details += '<p><a href="/account/favorites/'+data[0].inv_id+'/add" style="background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; width: 100%;" >Add to Favorites</a></p>';
    } else {
      details += '<p><a href="/account/favorites/'+data[0].inv_id+'/remove" style="background-color: #4CAF50; color: white; padding: 14px 20px; margin: 8px 0; border: none; cursor: pointer; width: 100%;" >Remove from Favorites</a></p>';
    }
  }

  details += '<p class="vehicle-price"><b>Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</b></p>';
  details += '<p><b>Description:</b>' + data[0].inv_description + '</p>';
  details += '<p class="vehicle-color"><b>Color:</b> ' + data[0].inv_color + '</p>';
  details += '<p><b>Miles:</b> ' + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</p>';
  details += '</div>';
  details += '</div>';

  return details;
};


Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}



/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     console.log({ accountData })
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 Util.checkAdminOrAdmin = (req, res, next) => {
  if (res?.locals?.accountData?.account_type === "Employee" || res?.locals?.accountData?.account_type === "Admin"){
    next()
  } else {
    req.flash("notice", "You are not authorized to view this page.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util;
