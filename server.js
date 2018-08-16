var Botkit = require('botkit');
//const config = require('./config');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN ;


var infinispan = require('infinispan');
var jdgHost = process.env.DATAGRID_HOTROD_SERVICE_HOST || "127.0.0.1";
var jdgPort = process.env.DATAGRID_HOTROD_SERVICE_PORT || 11222;
//var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});

console.log(" SLACK_BOT_TOKEN:"+ SLACK_BOT_TOKEN);


function lookup_cache(empID){
     var response=1;
    console.log("Inside Lookup Cahce empID:"+empID);
     var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
     console.log("connected:111");
 connected.then(function (client) {
    console.log("connected:222");
        client.get(empID).then(
            function(value) {
                if(value == undefined)  {
                     console.log("**********undefined:*********");
                    retunr(value);
                } else {
                     console.log("**********found:**********");
                    console.log("CacheData:"+(value));
                    retunr(value);
                }
            });
        });
    
}

function get_response() {
    var responses = [
        'There was a car coming.',
        'To get to the other side.',
        'To get the newspaper.',
        'Because it wanted to find out what those jokes were about.',
        'To boldly go where no chicken has gone before!',
        'Because the light was green.',
        'I could tell you, but then the Chicken Mafia would kill me.'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
}

var controller = Botkit.slackbot({
    debug: false
});

var bot = controller.spawn({
    token:  SLACK_BOT_TOKEN
})

bot.startRTM(function(err, bot, payload) {
    if (err) {
        throw new Error('Could not connect to Slack');
    }
});


controller.hears(['why did the chicken cross the road'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, get_response());
});



controller.hears(['help'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.reply(message, {
        text: `You can ask me things like:
    "What is my employee number ?"
    "Do I have any pending time reports ?"
    "Has my last quarter salary credited ?"
    "How many paid vacations do I still have?"
    "Will i get a promotion this year?"`
    });
});

controller.hears(['What is my customer number ?'], 'direct_message,direct_mention,mention', function(bot, message) {
     console.log("What is my customer number :message?"+JSON.stringify(message));
     console.log("What is my customer number : message.user ?"+message.user);
     
    var empSlackID = message.user.toLowerCase();
     var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
     console.log("connected: Hears");
    connected.then(function (client) {
    console.log("connected:Hears:message.user:"+message.user);
        client.get(empSlackID).then(
            function(value) {
                console.log("************:********* empSlackID:"+empSlackID);
                console.log("************:********* value:"+value);
                if(value == undefined)  {
                     bot.reply(message, "Your Customer details not found");
                     console.log("**********undefined:********* empSlackID:"+empSlackID);
                    
                } else {
                    var empRec = JSON.parse(value);     
                     bot.reply(message, "Your Customer No is :"+empRec.employeeNo);
                     
                     console.log("CacheData:"+(value));
                    
                    
                }
            });
        });
   
});
//
//controller.hears(['What is my employee number ?'], 'direct_message,direct_mention,mention', function(bot, message) {
//     console.log("hat is my employee number :message?"+JSON.stringify(message));
//     console.log("hat is my employee number : message.user ?"+message.user);
//    var emp = lookup_cache(message.user);
//    console.log("Cahce:"+emp);
//     var empRec = JSON.parse(emp);
//    console.log("empRec OBJ:"+empRec);
//    bot.reply(message, "Your Employee No is 7676251"+empRec.employeeNo);
//    console.log("message.user:"+empRec.employeeNo);
//});

controller.hears(['Has my last bill been paid ?'], 'direct_message,direct_mention,mention', function(bot, message) {
     var empSlackID = message.user.toLowerCase();
     var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    connected.then(function (client) {
        client.get(empSlackID).then(
            function(value) {
                if(value == undefined)  {
                     bot.reply(message, "System Error: Reports check failed");
                } else {
                    var empRec = JSON.parse(value);  
                    if(empRec.billPaid==1)
                      bot.reply(message, "Your last bill has been paid.");
                    else
                      bot.reply(message, "It is still not paid. ");    
                     console.log("CacheData:"+(value));
                }
            });
        });
});


controller.hears(['Do I have any overdue bills ?'], 'direct_message,direct_mention,mention', function(bot, message) {
     var empSlackID = message.user.toLowerCase();
     var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    connected.then(function (client) {
        client.get(empSlackID).then(
            function(value) {
                if(value == undefined)  {
                     bot.reply(message, "System Error: Reports check failed.");
                } else {
                    var empRec = JSON.parse(value);  
                     bot.reply(message, "Your pending bill count is: :"+empRec.timeReport);
                     console.log("CacheData:"+(value));
                }
            });
        });
});

controller.hears(['Please pay my bill. My bank routing no is  (.*) and my account no is (.*)'], 'direct_message', function(bot, message) {
    var routingNo = message.match[1];
     var accountNo = message.match[2];
    bot.reply(message, 'Got it. We will use your bank routing no : ' + routingNo + ' and account no : '+accountNo+ ". We will notify you once the bill has been paid.");

});

