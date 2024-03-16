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
        '<a href="../../inv/detail/' +
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
        '<a href="../../inv/detail/' +
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
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the single vehichle view HTML
 * ************************************ */
Util.buildVehicleDetails = async function (data) {
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
  details += '<p class="vehicle-price"><b>Price: $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</b></p>';
  details += '<p><b>Description:</b>' + data[0].inv_description + '</p>';
  details += '<p class="vehicle-color"><b>Color:</b> ' + data[0].inv_color + '</p>';
  details += '<p><b>Miles:</b> ' + new Intl.NumberFormat('en-US').format(data[0].inv_miles) + '</p>';
  details += '</div>';
  details += '</div>';

  return details;
};

module.exports = Util;
