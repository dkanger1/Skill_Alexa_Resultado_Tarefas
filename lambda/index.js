const Alexa = require('ask-sdk-core');
var http = require('http'); 

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Deseja criar uma nova atividade?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const DescIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'DescIntent';
    },
    async handle(handlerInput) {
      let outputSpeech = 'This is the default message.';
  
      await getRemoteData('http://177.55.114.52/iot/alexa_tarefa_longa.php')
        .then((response) => {
          const data = JSON.parse(response);
        //  outputSpeech = `A tarefa mais longa da semana foi ${data.tarefa}, foi executada por ${data.nome}, ela durou ${data.tempo} minutos. `;
       outputSpeech = `Foi o recebimento do veículo E D P 8204 na doca 6, durou uma hora e quarenta minutos, deseja abrir uma tarefa para tratar este desvio?`;
    })
        .catch((err) => {
          console.log(`ERROR: ${err.message}`);
          // set an optional error message here
          // outputSpeech = err.message;
        });
  
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse();
    },
  };

  
const ConsultaPendentesIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsultaPendentesIntent';
    },
    async handle(handlerInput) {
      let outputSpeech = 'This is the default message.';
  
      await getRemoteData('http://177.55.114.52/iot/alexa_tarefa_longa.php')
        .then((response) => {
          const data = JSON.parse(response);
         outputSpeech = `A tarefa mais longa da semana foi ${data.tarefa}, foi executada por ${data.nome}, ela durou ${data.tempo} minutos. `;
       //outputSpeech = `Foi o recebimento do veículo E D P 8204 na doca 6, durou uma hora e quarenta minutos, deseja abrir uma tarefa para tratar este desvio?`;
    })
        .catch((err) => {
          console.log(`ERROR: ${err.message}`);
          // set an optional error message here
          // outputSpeech = err.message;
        });
  
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .getResponse();
    },
  };

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'As suass opções estão sendo definidas?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const getRemoteData = (url) => new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(`Failed with status code: ${response.statusCode}`));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err));
  });

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        DescIntentHandler,
        ConsultaPendentesIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
