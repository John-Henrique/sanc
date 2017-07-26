/**
 * É necessário usar android-minSdkVersion 15 acima
 * Plugin
 * @dependence https://github.com/jeduan/cordova-plugin-facebook4
 * 
 * 
 * @example https://github.com/jeduan/cordova-plugin-facebook4
 **/
$(function(){
	
	
	
	facebook = {
		
		
		
		init: function(){
			
			// sempre que a tela login for aberta
			document.on( 'pageopened', function(evt){
				
				if( ( evt.detail.page == 'login' ) || ( evt.detail.page == 'principal' ) ){
					
					//console.log( "Status: tentando atualizar status" );
					
					// quando logado no sistema
					facebook.facebookStatus();
				}
			});
			
			
			
			$( document ).on( 'click', '.facebook-login-status', function(){
				//phonon.notif( "Login facebook status", 2000, false );
				facebook.facebookStatus();
			});
			
			
			$( document ).on( 'click', '.facebook-login', function(){
				//phonon.notif( "Login facebook", 2000, false );
				facebook.facebookLogin();
			});
			
			
			$( document ).on( 'click', '.facebook-logout', function(){
				//console.log( "facebook logout");
				facebook.facebookLogout();
			});
			
			
			
			
			
			$( '.facebook-logout' ).hide();
		},
		
		
		
		facebookLoginSuccess: function( userData ){
			facebook.dados_usuario( userData );
		},
		
		
		facebookLoginError: function( error ){
			phonon.alert( "Erro "+ JSON.stringify( error ), "Falha facebookloginError", "Cancelar", "ok" );
		},
		
		facebookLogin: function(){
			facebookConnectPlugin.login(["public_profile"], facebook.facebookLoginSuccess, facebook.facebookLoginError );
		},
		
		facebookStatus: function(){
			facebookConnectPlugin.getLoginStatus(function( retorno ){
				
				//console.log( "status" );
				
				if( retorno.status == 'connected' ){
					
					//console.log( "Conectado" );
					
					// esconde o botão
					$( '.facebook-login, .facebook-login-status' ).hide();
					$( '.facebook-logout' ).show();
					$( '.informacao' ).text( "Você fez login usando Facebook" );
					
					facebook.dados_usuario( retorno );
					
					//phonon.navigator().changePage( "principal" );
					
				}else if( retorno.status == 'not_authorized' ){
					
					//console.log( "Não autorizado");
					
					// usuário conectado no Facebook mas não no app
					phonon.notif( "status não autorizado", 1000, false );
					$( '.facebook-logout' ).hide();
				}else{
					// algum problema desconhecido ou simplesmente não conectado
					//phonon.notif( "status desconhecido", 1000, false );
					$( '.facebook-logout' ).hide();
					$( 'img.perfil-foto' ).prop( 'src', 'img/icon-user.png' );
					//console.log( "Ação desconhecida" );
				}
				
				//phonon.notif( "status", 1000, false );
				
			}, function( erro ){
				phonon.alert( JSON.stringify( retorno ), "Falha", "cancelar", "Ok" );
			});
		},
		
		
		facebookLogout: function(){
			
			facebookConnectPlugin.logout(function(){
				
				//console.log( "desconectado" );
				
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
				
				
			}, function(){
				phonon.notif( "Houve um problema ao tentar desconectar", 3000, false );
			});
		}, 
		
		
		dados_usuario: function( objeto ){
			
			window.usuario = {};
			//console.log( objeto );
			
			facebookConnectPlugin.api( "/me?fields=id,name,email,gender,age_range,birthday,first_name,last_name", ["public_profile", "email"], function( retorno ){

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
				window.usuario['avatar']		= 'http://graph.facebook.com/'+ objeto.authResponse.userID +'/picture?width=128&height=128';
				
				// verificando se este usuário existe no banco de dados
				usuarios.login( window.usuario );
				
			}, function( error ){
				phonon.alert( "Falha facebookLoginSuccess() FB.api() "+ JSON.stringify( error ), "Falha", "Cancelar", "ok" );
			});
			
			
			avatar = localStorage.getItem( 'avatar' );
			
			if( ( avatar != null ) && ( avatar != '' ) ){
				//$( '.status' ).text( avatar );
				$( 'img.perfil-foto' ).prop( 'src', avatar );
				
			}
			
			$( '.status' ).text( 'Conectado' );
			
			
			// fechando o painel quando estiver logado
			phonon.sidePanel( '#side-panel-example' ).close();
			
						
		}
	}
	
	
	
	
	document.addEventListener( "deviceready", function(){
		facebook.init();
	}, false );
});