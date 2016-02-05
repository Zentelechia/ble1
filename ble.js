if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isCordova) {
        // Short name for RFduino BLE library.
        var rfduinoble = ble;

        // Application object.
        var app = {};

        // Connected device.
        app.device = null;

        app.button1 = function()
        {
                app.device && app.device.writeDataArray(new Uint8Array([1]));
        };

        app.button2 = function()
        {
                app.device && app.device.writeDataArray(new Uint8Array([2]));
        };

        app.button3 = function()
        {
                app.device && app.device.writeDataArray(new Uint8Array([3]));
        }

        app.button4 = function()
        {
                app.device && app.device.writeDataArray(new Uint8Array([4]));
        };

        app.button5 = function()
        {
                app.device && app.device.writeDataArray(new Uint8Array([5]));
        };

        app.button6 = function()
        {
                app.device && app.device.writeDataArray(new Uint8Array([6]));
        }

        app.showMessage = function(info)
        {
                document.getElementById("info").innerHTML = info;
        };

        // Called when BLE and other native functions are available.
        app.onDeviceReady = function()
        {
                window.plugin.notification.local.hasPermission(function (granted) {
    // console.log('Permission has been granted: ' + granted);
});
                app.showMessage('Press the yellow button to connect');
                $("#connect").show();
        };

        app.connect = function()
        {
                console.log("close");
                rfduinoble.close();

                // Wait 500 ms for close to complete before connecting.
                setTimeout(function()
                {
                        console.log("connecting");
                        app.showMessage("Connecting...");
                        rfduinoble.connect(
                                "RFduino",
                                function(device)
                                {
                                        console.log("connected");
                                        app.showMessage("Connected");
                                        app.device = device;
                                        app.subscribe();
                                        $("#connect").hide();
                                        $("#disconnect").show();
                                },
                                function(errorCode)
                                {
                                        app.showMessage("Connect error: " + errorCode);
                                });
                     },
                        500);
        };

        app.disconnect = function()
        {
                rfduinoble.close();
                app.showMessage('Press the yellow button to connect');
                $("#disconnect").hide();
                $("#connect").show();
        }


// added following functions from graham

        app.subscribe = function()
        {

                // Turn notifications on.
                app.device.writeDescriptor(
                        '00002221-0000-1000-8000-00805f9b34fb',                 
                        '00002902-0000-1000-8000-00805f9b34fb',
                        new Uint8Array([1,0]),
                        function(data){
                                app.showMessage('Write Descriptor');
                        },
                        function(errorCode)
                        {
                                app.showMessage("Connect error: " + errorCode);
                        }

                );
                
                app.device.enableNotification(
                        '00002221-0000-1000-8000-00805f9b34fb',
                        function(data){

                                //app.showMessage('byteLength: ' + data.byteLength);
                                var dataArray = new Uint8Array(data);
                                app.rfdbuttons(dataArray[0]);
         },
                        function(errorCode)
                        {
                                app.showMessage("Connect error: " + errorCode);
                        }
                );
                        
        };

        app.unsubscribe = function()
        {

                // Turn notifications on.
                app.device.writeDescriptor(
                        '00002221-0000-1000-8000-00805f9b34fb',                 
                        '00002902-0000-1000-8000-00805f9b34fb',
                        new Uint8Array([0,0]),
                        function(data){
                                app.showMessage('Disable Notification');
                        },
                        function(errorCode)
                        {
                                app.showMessage("Connect error: " + errorCode);
                        }

                );
                
                app.device.disableNotification(
                        '00002221-0000-1000-8000-00805f9b34fb',
                        function(data){
                                app.showMessage('Disable Notifications ' + data);
                        },
                        function(errorCode)
                        {
                                app.showMessage("Connect error: " + errorCode);
                        }
                );

                        
        };
        
        app.rfdbuttons = function(buttons)
        {
              // break out buttons from array member 0
              //console.log("RFDbuttons: "+buttons)
              switch (buttons){
                case 0: 
                  setBackgroundColor('white');
                  app.showMessage("No Buttons Pressed ");                               
                  break;
                case 1:
                //navigator.vibrate(100);
                  setBackgroundColor('red')
                  app.showMessage("Button A Pressed");                               
                  break;
                case 2:
                  window.plugin.notification.local.add({  title:   'Button', message: 'Great app!' });
                  setBackgroundColor('blue')
                  app.showMessage("Button B Pressed");                               
                  break;
                case 3:
                  setBackgroundColor('magenta')
                  app.showMessage("Buttons A and B Pressed");                               
                  break;
              }
              
        }

        function setBackgroundColor(color)
        {
                document.documentElement.style.background = color
                document.body.style.background = color
        }

        // When the app is fully loaded the "deviceready" event is triggered.
        document.addEventListener("deviceready", app.onDeviceReady, false);

}
