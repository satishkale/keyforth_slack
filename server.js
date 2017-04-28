var Botkit = require('botkit');
const config = require('./config');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN || config.SLACK_BOT_TOKEN_1;

var infinispan = require('infinispan');
var jdgHost = process.env.DATAGRID_HOTROD_SERVICE_HOST || "127.0.0.1";
var jdgPort = process.env.DATAGRID_HOTROD_SERVICE_PORT || 11222;
var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});

function lookup_cache(){
     var response=1;
 connected.then(function (client) {
    console.log("connected:");
        client.get(custID).then(
            function(value) {
                if(value == undefined)  {
                     console.log("undefined:");
                    response="NotFound";
                } else {
                     console.log("found:");
                    console.log("CacheData:"+(value));
                    response=value;
                }
            });
        });
    return response;
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
    token: SLACK_BOT_TOKEN
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
    "What is my employee no?"
    "Do I have any pending time reports?"
    "How many paid vacations do I still have?"
    "Will i get a promotion this year?"`
    });
});

controller.hears(['What is my employee number ?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "Your Employee No is "+lookup_cache(message.user));
    console.log("Cahce:"+lookup_cache());
    // console.log("bot:"+JSON.stringify(bot));
    console.log("message:"+JSON.stringify(message));
     console.log("message.user:"+message.user);
});

controller.hears(['Do I have any pending time reports?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "Good Job, You have no pending time reports"+lookup_cache());
git remote add origin https://github.com/anurag-saran/keyforth_slack.git
git push -u origin master
});

controller.hears(['Please change my salary account detais. My bank routing no is  (.*) and my account no is (.*)'], 'direct_message', function(bot, message) {
    var routingNo = message.match[1];
     var accountNo = message.match[2];
    bot.reply(message, 'Got it. We will update your bank routing no to:' + routingNo + ' and account no to :'+accountNo);

});



//controller.hears(['Change my salary bank account'], 'direct_message,direct_mention,mention', function(bot, message) {
//    // start a conversation to handle this response. 
//    bot.startConversation(message, function(err, convo) {
//
//        convo.say('Sure, I need few details. Lets get started!');
//        convo.ask('Shall we proceed Say YES, NO or DONE to quit.'
//        convo.say('Cool, you said: ' + response.text);
//        
//        convo.ask('Shall we proceed Say YES, NO or DONE to quit.', [{
//                pattern: 'done',
//                callback: function(response, convo) {
//                    convo.say('OK you are done!');
//                    convo.next();
//                }
//            },
//            {
//                
//                pattern: bot.utterances.yes,
//                callback: function(response, convo) {
//                    convo.say('Super!');
//                    convo.ask('What is the banks routing no and your account no?');
//                    console.log("****ask:bot.utterances:" + JSON.stringify(bot.utterances));
//                    console.log("****:response:" + JSON.stringify(response));
//                    
//                    
//                    convo.say('*****');
//                    
//                    convo.next();
//
//                }
//            },
//            {
//                pattern: bot.utterances.no,
//                callback: function(response, convo) {
//                    convo.say('Perhaps later.');
//                    // do something else... 
//                    convo.next();
//                }
//            },
//            {
//                default: true,
//                callback: function(response, convo) {
//                    // just repeat the question 
//                    convo.repeat();
//                    convo.next();
//                }
//            }
//        ]);
//
//
//
//    });
//    
//     let askbankDetails = (response, convo) => {
//
//        convo.ask('Enter a description for the case', (response, convo) => {
//            console.log("###convo");
//            let responses = convo.getResponsesAsArray();
//            salesforce.createCase({subject: responses[0].answer, description: responses[1].answer})
//                .then(_case => {
//                    console.log(_case);
//                    bot.reply(message, {
//                        text: "I created the case:",
//                        attachments: formatter.formatCase(_case)
//                    });
//                    convo.next();
//                })
//                .catch(error => {
//                    bot.reply(message, error);
//                    convo.next();
//                });
//        });
//
//    };
//
//
//});