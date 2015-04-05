/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var personalName;
var taggedPerson;
var x;
var y;
var main = new UI.Card({
  title: "PEBBLE TAG!",
  body: "Press to have fun!"
});

main.show();

main.on('click', function(e) {
  var secondMain = new UI.Card({
    title: "PLAY!",
    body: "Press to enter a game with friends."
  });

  secondMain.show();
  secondMain.on('click', function(e) {
    ajax(
      {
        url: 'http://optical.cs.ucdavis.edu:8001',
        type: 'json',
        data: 'JOIN',
        async: false,
        method: 'post'
      },
      function(data, status) {
        console.log("initial requesting " + data);
        console.log(data);
        personalName = data; 
      },
      function(error, status) {
        console.log("in negative initial handler");
        console.log('The ajax request failed: ' + error + status);
      });  
      
      var breakScreen = new UI.Card({
        title: "Break Time!",
        body: "Press continue when you remember which animal corresponds to which player."
      });
      breakScreen.show();
      breakScreen.on('click', function(e){      
         
        setInterval( 
          ajax(
            {
              url: 'http://optical.cs.ucdavis.edu:8001',
              type: 'json',
              data: 'UPDATE,' + personalName + "," + x + "," + y,
              async: false,
              method: 'post'
            },
            function(data) {
     
               console.log('Update function: ' + data);
               var locationOptions = {
                   enableHighAccuracy: true, 
                   maximumAge: 10000, 
                   timeout: 10000
               };
              
               function locationSuccess(pos) {
                  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
                  x = pos.coords.latitude;
                  y = pos.coords.longitude;
               }
              
              function locationError(err) {
                  console.log('location error (' + err.code + '): ' + err.message);
              }
              
              // Make an asynchronous request
              navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions); 
              if (data == "Please add more players to the game."){  
                      var warningMain3 = new UI.Card({
                      title: "NOT ENOUGH PEOPLE!",
                      body: "Press to enter a game with friends."
                      });
                      warningMain3.show();
              }
                 
              
              taggedPerson = data;
              
              if (taggedPerson == personalName){
                 var itScreen = new UI.Menu({
                  sections: [{
                    title: 'You\'re it!',
                      items: [{
                        title: 'TAG'     
                    },{
                        title: 'HELP'
                    }]
                  }]
                });
                itScreen.show();
                itScreen.on('select', function(e){
                  ajax(
                  {
                    url: 'http://optical.cs.ucdavis.edu:8001',
                    type: 'json',
                    data: 'TAG,' + personalName + "," + x + "," + y,
                    async: false,
                    method: 'post'
                  },
                  function(data, status) {
                    if (data == "Please add more players to the game."){  
                      var warningMain2 = new UI.Card({
                        title: "NOT ENOUGH PEOPLE!",
                        body: "Press to enter a game with friends."
                      });
                      warningMain2.show();
                    }
                    else{
                      console.log("successful handler pretag " + status);
                      var innocentScreen = new UI.Card({
                        title: "You are not it!",
                        body: "Run from " + data + "!"
                      });
                      innocentScreen.show();
                    }
                  },
                  function(error, status) {
                    console.log("in tagged person negative handler");
                    console.log('The ajax request failed: ' + error + status);
                  });  
                });
              }
              else{
                if (data == "Please add more players to the game."){               
                   var warningMain1 = new UI.Card({
                        title: "NOT ENOUGH PEOPLE!",
                        body: "Press to enter a game with friends."
                   });
                  warningMain1.show();
                }
                else{
                  var innocentScreen = new UI.Card({
                    title: "You are not it!",
                    body: "Run from " + taggedPerson + "!"
                  });
                  innocentScreen.show();
                }
              }
            },
            function(error, status) {
              console.log('The ajax request failed: ' + error + " error: " + status);
          }  
        ), 1000);          //remember this is part of setInterval
      }); 
  });
});  
    
   
                                                                    
    
 