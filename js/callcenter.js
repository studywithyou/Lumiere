$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}       

// Compatibility shim
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// PeerJS object
var peer = new Peer({ key: '7i5ex2xqq600y66r', debug: 3});

//## Quando conectar ao servidor
peer.on('open', function(){
  //## Faz aparecer o id na caixa "esperar conexao"
  $('.my-id').text(peer.id);
});

//##Quando receber uma chamda
peer.on('call', function(call){
  // Answer the call automatically (instead of prompting user) for demo purposes
  call.answer(window.localStream);
  step3(call);
});
peer.on('error', function(err){
  alert(err.message);
  // Retorna o segundo step quando ocorrer erros
  step2();
});

// Click handlers setup
$(function(){
  $('#make-call').click(function(){
    // Inicia uma nova chamada!
    var call = peer.call($('#callto-id').val(), window.localStream);

    step3(call);
  });
  
  

  $('#end-call').click(function(){
    window.existingCall.close();
    step2();
  });

  // Retry if getUserMedia fails
  $('#step1-retry').click(function(){
    $('#step1-error').hide();
    step1();
  });

  // Get things started
  step1();
});

function step1 () {
  // Get audio/video stream
  navigator.getUserMedia({audio: true, video: true}, function(stream){
    // Set your video displays
  $('#my-video').prop('src', URL.createObjectURL(stream));

    window.localStream = stream;
    step2();
  }, function(){ $('#step1-error').show(); });
}

function step2 () {
  $('#step1, #step3').hide();
  $('#step2').show();
  $('body').removeClass('page-load');
}

function step3 (call) {
  // Hang up on an existing call if present
  if (window.existingCall) {
    window.existingCall.close();
  }

  // Wait for stream on the call, then set peer video display
  call.on('stream', function(stream){
    $(".menu-functions").hide();
    $('#their-video').prop('src', URL.createObjectURL(stream));
  });

  // UI stuff
  window.existingCall = call;
  $('#their-id').text(call.peer);
  call.on('close', step2);
  $('#step1, #step2').hide();
  $('#step3').show();
}

function showErrorLoad(){
  //$('body').removeClass();
  //$('body').addClass('page-error')
}

/* 
  === Interações para quando o usuario é convidado === 
*/
$('#make-invite-call').click(function(){
    var call = peer.call($('#callto-invite-id').val(), window.localStream);
    $('.friend_invite').hide();
    step3(call);
});

if($.urlParam('friend_id')){
  
  console.info('tem friend id');
  $('.menu-functions').hide();
  $('.friend_invite').show();
  $('#callto-invite-id').val($.urlParam('friend_id')); 
}else{
  console.info('NÃO TEM friend id');
}
console.log('teste externo');
