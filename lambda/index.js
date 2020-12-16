const Alexa = require('ask-sdk-core');
var http = require('http'); 

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Olá Ráfael, gostaria de consultar as atividades em andamento. pendentes. finalizadas. ou o dash de escalonadas?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const ConsultaAndamentoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsultaAndamentoIntent';
    },
    async handle(handlerInput) {
      let outputSpeech = 'This is the default message.';
  
      await getRemoteData('http://177.55.114.52/dash/Alexa/alexa_tarefas_pendentes.php?tipo=AND&local=961')
        .then((response) => {
          const data = JSON.parse(response);
     outputSpeech = ` ${data[0].prazo} tarefas estão no prazo e ${data[0].atrazo} atrasadas. `;
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
  
      await getRemoteData('http://177.55.114.52/dash/Alexa/alexa_tarefas_pendentes.php?tipo=PEN&local=961')
        .then((response) => {
          const data = JSON.parse(response);
         outputSpeech = `Existem ${data[0].esc} tarefas escalonadas, ${data[0].ven} vencidas, ${data[0].ale} em alerta e ${data[0].abe} abertas`;
    })
        .catch((err) => {
          console.log(`ERROR: ${err.message}`);
          // set an optional error message here
          // outputSpeech = err.message;
        });
  
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt('speakOutput')
        .getResponse();
    },
  };

  
const ConsultaFinalizadasIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsultaFinalizadasIntent';
    },
    async handle(handlerInput) {
      const intentName = handlerInput.requestEnvelope.request.intent.slots.param_time.resolutions.resolutionsPerAuthority[0].values[0].value.id; 
      let outputSpeech =  `Você está procurando  ${intentName}`;
      await getRemoteData('http://177.55.114.52/dash/Alexa/alexa_tarefas_pendentes.php?tipo=FIN&local=961&time=' + intentName) 
        .then((response) => {
          const data = JSON.parse(response);
     outputSpeech = `Foram executadas ${data[0].prazo} tarefas estão no prazo e ${data[0].atrasada} atrasadas. `;
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

  
  const ConsultaEscalonamentoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConsultaEscalonamentoIntent';
    },
    async handle(handlerInput) {
      let outputSpeech = 'No nível diretoria executiva. ';
  
      await getRemoteData('http://177.55.114.52/dash/Alexa/alexa_escalonamento.php')
        .then((response) => {
          const data = JSON.parse(response);
         // $const = ${data.length};
            for(var i=0; i< data.length ; i++)
          {
           outputSpeech =  outputSpeech.concat(` Na hierarquia de  ${data[i].responsavel} possui ${data[i].number} tarefas escalonadas. `);
          }

        })
        .catch((err) => {
          console.log(`ERROR: ${err.message}`);
          // set an optional error message here
          // outputSpeech = err.message;
        });
  
      return handlerInput.responseBuilder
        .speak(outputSpeech)
        .reprompt(outputSpeech)
        .getResponse();
    },
  };
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Você pode saber a quantidade de tarefas em andamento dizendo ANDAMENTO, as atividades pendentes dizendo Pendente. as concluídas dizendo finalizadas. Ou consultar o dashboard de escalonamento dizendo Escalonadas';

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
        const speakOutput = 'Até logo!';
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
        const speakOutput = `Você ativou o  ${intentName}`;

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
        ConsultaAndamentoIntentHandler,
        ConsultaPendentesIntentHandler,
        ConsultaFinalizadasIntentHandler,
        ConsultaEscalonamentoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
