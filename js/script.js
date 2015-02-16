document.addEventListener("DOMContentLoaded", function(){
//upon loading page, check if it supports Geolocation.
  if( navigator.geolocation ){
    var getLocation = {enableHighAccuracy: false, timeout:60000, maximumAge:60000};
    navigator.geolocation.getCurrentPosition( reportPosition, gpsError, getLocation );
//If it doesn't alert the user with the following message.
  }else{
    alert("OOPS!! your browser needs to be updated and currently does not support location based services.")
  }
});

function reportPosition( position ){
  var output = document.querySelector("#output");
  output.innerHTML += "Latitude: " + position.coords.latitude + "&deg;<br/>"
  + "Longitude: " + position.coords.longitude + "&deg;<br/>"
  //draw the image of the map on the canvas when this function is called
 drawImage(position);
}

function drawImage(position){
  var canvas = document.createElement("canvas");
    canvas.height =400;
    canvas.width = 400;
  var context = canvas.getContext('2d');
  var x = 0;
  var y = 0;
  var width = 400;
  var height = 400;
  var imageObj = new Image();
 imageObj.onload = function() {
    context.drawImage(imageObj, x, y, width, height);
  };
//latitude and longitude are variables and will change based on user's location
 imageObj.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + ","+ position.coords.longitude + "&zoom=14&size=400x400&markers=color:red%7C" + position.coords.latitude + ","+ position.coords.longitude + "&key=AIzaSyAOXUJlnbNxvV7HRtrslv_vFBT7tCJ4VZc";
// append the canvas to the div with id output.
document.querySelector("#output").appendChild(canvas);
//after loading the map image, remove the message asking the user to wait for loading.
var waitMsg = document.querySelector("#waitMsg");
 waitMsg.parentNode.removeChild(waitMsg);
}


//in case of erros the following function gives an explanation of type of error to the user.
function gpsError( error ){
  var errors = {
    1: 'Permission denied',
    2: 'Position unavailable',
    3: 'Request timeout'
  };
  alert("Error: " + errors[error.code]);
}
