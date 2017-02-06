// statechange, updatefound, and controllerchange events help me to understand what's going on.

const swRegister = (function(){
  if(!('serviceWorker' in navigator)) return;

  navigator.serviceWorker
  .register('sw.js', {scope: ''})
  .then(function(swRegistration){
    var serviceWorker;

    if(swRegistration.installing) {
      console.log('Resolved at installing: ', swRegistration);
      serviceWorker = swRegistration.installing;
    } else if (swRegistration.waiting) {
      console.log('Resolved at installed/waiting: ', swRegistration)
      serviceWorker = swRegistration.waiting;
    } else if (swRegistration.active) {
      console.log('Resolved at activated: ', swRegistration)
      serviceWorker = swRegistration.active;
    }

    if(serviceWorker) {
      serviceWorker.addEventListener('statechange', function(e) {
        console.log('State change: ', e.target.state)
      })
    }

    swRegistration.addEventListener('updatefound', function() {
      swRegistration.installing.addEventListener('statechange', function(e) {
        console.log('New sw state!', e.target.state);
      })
      console.log('New sw found!!', swRegistration);
    });

    setInterval(function() {
      swRegistration.update();
    }, 10000);
  })
  .catch(function(error) {
    console.log('Error occurred', error);
  });

  navigator.serviceWorker.addEventListener('controllerchange', function(e) {
    console.log('Contoller changed!');
  })

  navigator.serviceWorker.addEventListener('message', function(e) {
    var clientId = e.data.clientId;
    var message = e.data.message;
    console.log('From Client: ', clientId, message)
  })

  if(navigator.serviceWorker.controller != null) {
    navigator.serviceWorker.controller.postMessage('Hello');
  }
})()
