const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

const fbToken = 'EAAaX889QzWUBAHRNZCpxGPoWCmX7xDq0pdxljpmpInfK3QZCMZC2sxIBEzA84KPylOvpiBG4HpPh3juhR0Fs74uXBvreK1YOLv0KEym7DPEX7ZCl07M7qrYzvTvNkkoMwsiuKSBsW4aPOvvHN7XZAjqtRRW5MTsXiOb2cjQzrvQZDZD'

app.use(bodyParser.json())

app.listen(3000, () => console.log('Servidor executando em http://localhost:3000'))

app.get('/', (req, res) => {
	res.send('ausnausna');
})

app.get('/webhook', (req, res) => {
	if(req.query['hub.verify_token'] === 'mike_teste'){
		res.send(req.query['hub.challenge'])
	}
})


app.post('/webhook', (req, res) => {
	const data = req.body
	data.entry.forEach( (el) => {
		const dataMsg = el.messaging	
		filter_data_menssage(dataMsg)
	})
	res.sendStatus(200)
})


function filter_data_menssage(data){
	data.forEach( (el) => {
		const userId = el.sender.id
		const message = el.message.text

		console.log(userId)
		console.log(message)

		if(message){
			if(message.includes('oi mikebot')){
				sendTextMessage(userId, 'oi serumaninho!')
				setTimeout(() => {sendTextMessage(userId, 'qual é seu nome ?')}, 3000)
				
			}else{
				sendTextMessage(userId, 'Não me interesa, bye !')
			}
		}
	})
}



function sendTextMessage(recipientId, messageText, callback) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };
  callSendAPI(messageData);
  if(callback){
  	callback()
  }
}



function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: fbToken },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}