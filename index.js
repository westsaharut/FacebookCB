var login = require('facebook-chat-api');
var handleMessage = require('./src/handleMessage.js');
const readline = require("readline");

var userInfo = {

    email: 'Your email or tel.',
    password: 'password'
};

var timeout = undefined;

var inTimeout = {};

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

login({email: userInfo.email, password: userInfo.password}, function(err, api){
    if(err){
        switch (err.error) {
            case 'login-approval':
                console.log('Enter code > ');
                rl.on('line', (line) => {
                    err.continue(line);
                    rl.close();
                });
                break;
            default:
                console.error(err);
        }
        return;
    }else{
      function sendMessage(str, id){
          return new Promise((resolve, reject) => {
              api.sendMessage(str, id, function(err){
                  if(err){
                      reject(err);
                      return;
                  }
                  resolve('send str success');
              });
          });
      }

      function autoSend(str, id){
        var yourID = "100017526824783";
        var msg = {body: "ขอโทษๆๆ ตอบหน่อย ดีกัน นะ"};
        api.sendMessage(msg, yourID);
        setTimeout(autoSend, 2000);
      }

      autoSend();

      api.listen(function(err, message){
          if(err){
              console.log(err);
              return;
          }

          console.log(message);

          var req = message.body ? message.body.toLowerCase() : '';
          var id = message.threadID;
          if(message.threadID!='100017526824783'){  //id toey
            if(req && !inTimeout[id]){
                handleMessage(req, id, sendMessage);
                if(timeout){
                    inTimeout[id] = true;
                    setTimeout(function(){
                        inTimeout[id] = false;
                    }, timeout);
                }
            }
          }else{
            var yourID = "100004305930266"; // id west
            var msg = {body: "ตอบแล้ว!!"};
            api.sendMessage(msg, yourID);
          }
      });

    }

});
