var app1_gere0018 = {
    page:[],
    numPages:0,
    links:[],
    numLinks:0,
    toggleMenuIcon:"",
    verticalMenu: "",
    initialize: function() {
        app1_gere0018.bindEvents();
    },
    bindEvents: function() {
      document.addEventListener('deviceready', app1_gere0018.onDeviceReady, false);
      document.addEventListener("DOMContentLoaded", app1_gere0018.onDeviceReady, false);
    },
    onDeviceReady: function() {
      app1_gere0018.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
      app1_gere0018.prepareNavigation();
      toggleMenuIcon = document.querySelector("#toggle-menu");
        if(app1_gere0018.detectTouchSupport( )){
            toggleMenuIcon.addEventListener("touchend", app1_gere0018.handleTouch);
         }
       toggleMenuIcon.addEventListener("click", app1_gere0018.showMenu);


    },
    showMenu:function(){
        //change toggle menu icon to an x shape when clicked
        toggleMenuIcon.classList.toggle("x-toggle-menu");
        verticalMenu = document.querySelector(".verticalMenu");
        //change class of body to allow the push transition.
        document.body.classList.toggle("pushMenuToLeft");
       verticalMenu.classList.toggle("OpenverticalMenu");
    },
    prepareNavigation:function(){
       pages = document.querySelectorAll('[data-role="page"]');
	   numPages = pages.length;
	   links = document.querySelectorAll(".button");
	   numLinks = links.length;
        //looping through my links and adding touch and click events
	   for(var i=0;i<numLinks; i++){
           if(app1_gere0018.detectTouchSupport( )){
                links[i].addEventListener("touchend", app1_gere0018.handleTouch, false);
            }
      //must register event listener on click event even if touch is supported.handletouch will transform touch into a click, but we still need to attach event listener to it with line below.
           links[i].addEventListener("click", app1_gere0018.handleNav, false);

       }
       window.addEventListener("popstate", app1_gere0018.browserBackButton, false);
        //loading the first page with url=null
	   app1_gere0018.loadPage(null);
    },
    //Transform the touch event into a mouse event "click":
    handleTouch:function (ev){
      ev.preventDefault();//prevent 300 ms delay
      ev.stopImmediatePropagation();
      var touch = ev.changedTouches[0]; //this is the first object touched
      var newEvt = document.createEvent("MouseEvent");
      //old method works across browsers, though it is deprecated.
      newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
      ev.currentTarget.dispatchEvent(newEvt);
      //send the touch to the click handler
    },
    //handle the click event
    handleNav:function (ev){
        ev.preventDefault();// preventing page reload
        var href = ev.currentTarget.href;
        var parts = href.split("#");//returns an array with 2 strings, the string before # and the string after the #.
        app1_gere0018.loadPage( parts[1] );
        return false;
    },

    //Deal with history API and switching divs
    loadPage:function ( url ){
        if(url == null){
            //home page first call
            pages[0].className = "activePage";
            pages[0].classList.add("pt-page-moveFromBottomFade");
            history.replaceState(null, null, "#home");
        }else{
            //loop through pages
            for(var i=0; i < numPages; i++){
              if(pages[i].id == url){
                  pages[i].className = "activePage";
                  pages[i].classList.add("pt-page-moveFromBottomFade");
                  //making vertical menu disapper when we select a tab.
                  verticalMenu = document.querySelector("#verticalMenu");
                  if(verticalMenu.className == "verticalMenu OpenverticalMenu"){
                      verticalMenu.classList.remove("OpenverticalMenu");                                    document.body.classList.toggle("pushMenuToLeft");
                      toggleMenuIcon.classList.toggle("x-toggle-menu");
                  }

                  if(pages[i].id == "location"){
                  app1_gere0018.setLocation();
                  }
                  if(pages[i].id == "contact"){
                    if(navigator.contacts){
                        app1_gere0018.launchContactPicker();
                    }

                  }
                history.pushState(null, null, "#" + url);
              }else{
                  var classes = pages[i].getAttribute("class");
                  if (classes && (-1 !== classes.indexOf("activePage"))){
                       pages[i].classList.remove("pt-page-moveFromBottomFade");
                      pages[i].classList.add("pt-page-rotateFoldTop");
                    setTimeout(function(pg){
                       pg.classList.remove("activePage");
                       pg.classList.remove("pt-page-rotateFoldTop");
                        }, 700, pages[i]);
                    }
                }
            }

            }
            //loop through links
            for(var t=0; t < numLinks; t++){
              links[t].classList.remove("activeTab");
//location is a property of the window object that returns current location url of the document.
              if(links[t].href == window.location.href){
                links[t].classList.add("activeTab");
              }

            }
        },
    //Need a listener for the popstate event to handle the back button
    browserBackButton:function (ev){
      url = window.location.hash;  //hash will include the "#" + the string after it.
      //update the visible div and the active tab
      for(var i=0; i < numPages; i++){
          if(("#" + pages[i].id) == url){
            pages[i].className = "activePage";
          }else{
            pages[i].classList.remove("activePage");
          }
      }
      for(var t=0; t < numLinks; t++){
        links[t].classList.remove("activeTab");
        if(links[t].href == window.location.href){
          links[t].classList.add("activeTab");
        }
      }
    },

//Test for browser support of touch events
    detectTouchSupport:function ( ){
      msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
      var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
      return touchSupport;
    },
    //Using Cordova Geolocation API to get current Location.
    setLocation: function(){
        console.log("location called");
        if( navigator.geolocation ){
        var getLocation = {enableHighAccuracy: false, timeout:60000, maximumAge:60000};
        navigator.geolocation.getCurrentPosition( app1_gere0018.reportPosition, app1_gere0018.gpsError, getLocation);
        //If it doesn't alert the user with the following message.
        }else{
            alert("OOPS!! your browser needs to be updated and currently does not support location based services.")
        }
    },
    //success function
    reportPosition:function( position ){
         app1_gere0018.drawImage(position);
        },

    drawImage:function(position){
      var canvas = document.querySelector("canvas");
      var context = canvas.getContext('2d');
      var imageObj = new Image();
     imageObj.onload = function() {
        context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
      };
     imageObj.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + position.coords.latitude + ","+ position.coords.longitude + "&zoom=14&size=400x400&markers=color:red%7C" + position.coords.latitude + ","+ position.coords.longitude + "&key=AIzaSyAOXUJlnbNxvV7HRtrslv_vFBT7tCJ4VZc";
// append the canvas to the div with id output.
     var output = document.querySelector("#output");
     var msg = document.querySelector("#msg");
     msg.innerHTML = "<strong>Your current location is:</strong><br/>" +
         "Latitude: " + position.coords.latitude + "&deg;<br/>" +
         "Longitude: " + position.coords.longitude + "&deg;<br/><br/>" ;
    //after loading the map image, remove the message asking the user to wait for loading.
    var waitMsg = document.querySelector("#waitMsg");
    if(waitMsg){
        waitMsg.parentNode.removeChild(waitMsg);
    }
},
    gpsError:function ( error ){
      var errors = {
        1: 'Permission denied',
        2: 'Position unavailable',
        3: 'Request timeout'
      };
 //in case of erros the following function gives an explanation of type of error to the user.
      alert("Error: " + errors[error.code]);
    },
    launchContactPicker: function (){
        var selectBtn = document.querySelector("#selectBtn");
        if(app1_gere0018.detectTouchSupport( )){
            selectBtn.addEventListener("touchend", app1_gere0018.handleTouch);
         }
        selectBtn.addEventListener("click", function (){
            console.log("Selection button is clicked.");
             navigator.contacts.pickContact(app1_gere0018.selectContact, app1_gere0018.errFunc);
            });
    },

    selectContact: function ( pickedContact ){
          var contactsOutput = document.querySelector("#contactsOutput");
          contactsOutput.innerHTML = "<h4>Your Emergency Contact's info: </h4></br>" +
                                      "<p>Name: " +  pickedContact.displayName + "<p></br>";
        // Display Contact's Phone number ******************************************
        var contactNumber;
          if(pickedContact.phoneNumbers== null){
              contactNumber= "This contact has no saved number";
          }else{
              contactNumber= pickedContact.phoneNumbers[0].value;
          }
         contactsOutput.innerHTML += "<p>Phone number: " + contactNumber  + "<p></br>";

        // Display Contact's address ***********************************************
        var contactAddress;
         if(pickedContact.addresses== null) {
            contactAddress = "This contact has no saved address";
         }else{
           contactAddress = pickedContact.addresses[0].formatted;
         }

         contactsOutput.innerHTML += "<p>Address: " +  contactAddress + "<p></br>";

    },
    errFunc:function (){
        alert("sorry !! we are not able to load your contact right now!!")

    }

};
app1_gere0018.initialize();
