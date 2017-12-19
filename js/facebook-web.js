/**
 * Verificando se estamos no modo 
 * web ou mobile
 * */
//if (document.querySelector('.web') !== null) {
	
setTimeout( function(){
	
	(function(d, s, id) {
	  var js, fjs = d.getElementsByTagName(s)[0];
	  if (d.getElementById(id)) return;
	  js = d.createElement(s); js.id = id;
	  js.src = "//connect.facebook.net/pt_BR/sdk.js#xfbml=1&version=v2.8&appId=1934179150192407";
	  fjs.parentNode.insertBefore(js, fjs);
	  
			console.log( "facebook-jssdk" );
	}(document, 'script', 'facebook-jssdk'));
},1000);

	

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
	//console.log( "conectado" );
  });
}


function statusChangeCallback( response ){
	//FB.login(function(response) {
	  if (response.status === 'connected') {
		// Logged into your app and Facebook.
		console.log( "logado" );
		//testAPI()
		
		dados_usuario( response );
		
	  } else {
		// The person is not logged into this app or we are unable to tell. 
		console.log( "não logado" );
		encerra_sessao();
		phonon.navigator().changePage( "login" );
		//login();
	  }
	//});
}


function login(){
	
	FB.login(function(response) {
	  // handle the response
	}, {scope: 'public_profile,email'});
}








console.log( "facebook-web.js");


function encerra_sessao(){

	phonon.notif( "Desconectado com sucesso", 3000, false );
	
	localStorage.removeItem( 'accessToken' );
	localStorage.removeItem( 'sessionKey' );
	localStorage.removeItem( 'sig' );
	localStorage.removeItem( 'secret' );
	localStorage.removeItem( 'userID' );
	localStorage.removeItem( 'avatar' );
	
	
	// remove dados da sessão
	usuarios.logout();
	
	// esconde o botão
	$( '.facebook-login, .facebook-login-status' ).show();
	$( '.facebook-logout' ).hide();
	$( '.nome, .status' ).text( "Desconectado" );
	$( 'img.perfil-foto' ).prop( 'src', 'img/icon-user.png' );
	$( '.informacao' ).text( "Para usar recursos avançados do achaqui, faça login usando sua conta do Facebook." );
}


function logout(){
    FB.getLoginStatus(function(response) {
        if (response && response.status === 'connected') {
			
			FB.logout(function( response ){
				
				//console.log( "desconectado" );
				encerra_sessao();
			});
        }
    });
}


function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me?fields=id,name,email,gender,age_range,birthday,first_name,last_name', function(response) {
      console.log( response);
	  
    });
}


		function dados_usuario( objeto ){
			
			window.usuario = {};
			//console.log( objeto );
			
			FB.api('/me?fields=id,name,email,gender,age_range,birthday,first_name,last_name', ["public_profile", "email"], function(retorno){

				//console.log( "dados recuperados");
				//console.log( retorno );
				//dados_usuario( retorno );
				
				$( '.nome, .status' ).text( retorno.name );
				$( '.facebook-login' ).hide();
				$( '.facebook-logout' ).show();
				
				// definindo propriedades do usuário
				window.usuario['nome'] 			= retorno.name;
				window.usuario['sexo'] 			= retorno.gender;
				window.usuario['nascimento'] 	= retorno.birthday;
				window.usuario['email'] 		= retorno.email;
				window.usuario['first_name'] 	= retorno.first_name;
				window.usuario['last_name'] 	= retorno.last_name;
				//window.usuario['user_id'] 		= retorno.id;
				
				window.usuario['accessToken']	= objeto.authResponse.accessToken;
				window.usuario['userID']		= objeto.authResponse.userID;
				window.usuario['avatar']		= '//graph.facebook.com/'+ objeto.authResponse.userID +'/picture?width=128&height=128';
				
				// verificando se este usuário existe no banco de dados
				usuarios.login( window.usuario );
				
			});
			/*, function( error ){
				phonon.alert( "Falha facebookLoginSuccess() FB.api() "+ JSON.stringify( error ), "Falha", "Cancelar", "ok" );
				console.log( error );
			});
			 * */
			
			
			avatar = localStorage.getItem( 'avatar' );
			
			if( ( avatar != null ) && ( avatar != '' ) ){
				//$( '.status' ).text( avatar );
				$( 'img.perfil-foto' ).prop( 'src', avatar );
				
			}
			
			$( '.status' ).text( 'Conectado' );
			
			
			// fechando o painel quando estiver logado
			phonon.sidePanel( '#side-panel-example' ).close();
			
			
		}




	$( document ).on( 'click', '.btn-facebook', function(){
		console.log( "btn-facebook clicado");
		checkLoginState();
	});

	$( document ).on( 'click', '.btn-logout', function(){
		console.log( "btn-logout clicado");
		logout();
	});
	
	
//}// if web