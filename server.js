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
    "How many paid vacations do I still have?"
    "Will i get a promotion this year?"`
    });
});

controller.hears(['What is my employee number ?'], 'direct_message,direct_mention,mention', function(bot, message) {
     console.log("hat is my employee number :message?"+JSON.stringify(message));
     console.log("hat is my employee number : message.user ?"+message.user);
     
    var empSlackID = message.user.toLowerCase();
     var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
     console.log("connected:111");
    connected.then(function (client) {
    console.log("connected:222:"message.user);
        client.get(message.user).then(
            function(empSlackID) {
                if(value == undefined)  {
                     console.log("**********undefined:********* empSlackID:"+empSlackID);
                     bot.reply(message, "Your Employee details not found");
                } else {
                     
                     var empRec = JSON.parse(value);
                     console.log("CacheData:"+(value));
                    bot.reply(message, "Your Employee No is :"+empRec.employeeNo);
                    
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




controller.hears(['Do I have any pending time reports ?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "Good Job, You have no pending time reports"+lookup_cache());

});

controller.hears(['Please change my salary account detais. My bank routing no is  (.*) and my account no is (.*)'], 'direct_message', function(bot, message) {
    var routingNo = message.match[1];
     var accountNo = message.match[2];
    bot.reply(message, 'Got it. We will update your bank routing no to:' + routingNo + ' and account no to :'+accountNo);

});


