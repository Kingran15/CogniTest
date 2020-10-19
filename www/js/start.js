document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    screen.orientation.lock('portrait');
}

function openTest(test) {
  if(!(typeof test === 'string')) {
    //ADD AN ACTUAL ERROR THINGAMABOB
    return false;
  }

  switch(test) {
    case 'mini_cog':
      window.location.href = 'mini_cog.html';
      break;
    case 'about':
      window.location.href = 'about.html';
      break;
    default:
      return false;
  }
  return true;
}
