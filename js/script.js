var app1_gere0018 = {
    page:[],
    numPages:"",
    links:[],
    numLinks:"",
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
//        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("DOMContentLoaded", this.onDeviceReady, false);
    },
    onDeviceReady: function() {
    app1_gere0018.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      app1_gere0018.navigate();

    },
    navigate:function(){
       pages = document.querySelectorAll('[data-role="page"]');
	   numPages = pages.length;
	   links = document.querySelectorAll(".button");
	   numLinks = links.length;
	   for(var i=0;i<numLinks; i++){
           if(app1_gere0018.detectTouchSupport( )){
            links[i].addEventListener("touchend", app1_gere0018.handleTouch, false);
            }
            links[i].addEventListener("click", app1_gere0018.handleNav, false);
            }
        window.addEventListener("popstate", app1_gere0018.browserBackButton, false);
	    app1_gere0018.loadPage(null);
    },
    handleTouch:function (ev){
      ev.preventDefault();
      ev.stopImmediatePropagation();
      var touch = evt.changedTouches[0];        //this is the first object touched
      var newEvt = document.createEvent("MouseEvent");
      //old method works across browsers, though it is deprecated.
      newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
      ev.originalTarget.dispatchEvent(newEvt);
      //send the touch to the click handler
    },
    //handle the click event
    handleNav:function (ev){
        ev.preventDefault();
        var href = ev.target.href;
        var parts = href.split("#");
        app1_gere0018.loadPage( parts[1] );
      return false;
    },
    //Deal with history API and switching divs
    loadPage:function ( url ){
        if(url == null){
            //home page first call
            pages[0].style.display = 'block';
            history.replaceState(null, null, "#home");
        }else{

        for(var i=0; i < numPages; i++){
          if(pages[i].id == url){
            pages[i].style.display = "block";
            history.pushState(null, null, "#" + url);
          }else{
            pages[i].style.display = "none";
          }
        }
        for(var t=0; t < numLinks; t++){
          links[t].className = "";
          if(links[t].href == location.href){
            links[t].className = "activetab";
          }
        }
        }
    },
    //Need a listener for the popstate event to handle the back button
    browserBackButton:function (ev){
      url = location.hash;  //hash will include the "#"
      //update the visible div and the active tab
      for(var i=0; i < numPages; i++){
          if(("#" + pages[i].id) == url){
            pages[i].style.display = "block";
          }else{
            pages[i].style.display = "none";
          }
      }
      for(var t=0; t < numLinks; t++){
        links[t].className = "";
        if(links[t].href == location.href){
          links[t].className = "activeTab";
        }
      }
    },

//Test for browser support of touch events
    detectTouchSupport:function ( ){
      msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
      var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
      return touchSupport;
    },
    setLocation: function(){
        if( navigator.geolocation ){
        var getLocation = {enableHighAccuracy: false, timeout:60000, maximumAge:60000};
        navigator.geolocation.getCurrentPosition( reportPosition, gpsError, getLocation);
        //If it doesn't alert the user with the following message.
        }else{
            alert("OOPS!! your browser needs to be updated and currently does not support location based services.")
        }
    },
    reportPosition:function( position ){
         var output = document.querySelector("#output");
         output.innerHTML += "Latitude: " + position.coords.latitude + "&deg;<br/>"
          + "Longitude: " + position.coords.longitude + "&deg;<br/>"
          //draw the image of the map on the canvas when this function is called
         drawImage(position);
        },

    drawImage:function(position){
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
     imageObj.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + ","+ position.coords.longitude + "&zoom=14&size=400x400&markers=color:red%7C" + position.coords.latitude + ","+ position.coords.longitude + "&key=AIzaSyAOXUJlnbNxvV7HRtrslv_vFBT7tCJ4VZc";
// append the canvas to the div with id output.
document.querySelector("#output").appendChild(canvas);
//after loading the map image, remove the message asking the user to wait for loading.
var waitMsg = document.querySelector("#waitMsg");
 waitMsg.parentNode.removeChild(waitMsg);
},
    gpsError:function ( error ){
      var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
      };
 //in case of erros the following function gives an explanation of type of error to the user.
      alert("Error: " + errors[error.code]);
    }






};
app1_gere0018.initialize();













