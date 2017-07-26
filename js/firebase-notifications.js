/**
 * Controla as notificações usando Firebase
 * https://github.com/arnesson/cordova-plugin-firebase
 * CORDOVA-PLUGIN-Firebase
 * 
 * @since 2017-02-20
 **/
$( function(){
	
	
	document.addEventListener( "deviceready", notificacoes, false );
	
	
	function notificacoes(){
		setTimeout(function(){
			firebase.init();
		},4000);
	}
	
	
	firebase = {
		
		init: function(){
			
			firebase.getToken();
			
			
			firebase.onTokenRefresh();
			
			
			firebase.onNotificationOpen();
		},
		
		
		getToken: function(){
			
			//phonon.preloader( ".circle-progress" ).show();
			
			window.FirebasePlugin.getToken(function(token) {
				// save this server-side and use it to push notifications to this device
				//phonon.notif( token, 5000, false );
				
				$.ajax({
					url: config.api() +'/dispositivos/add',
					type: "POST", 
					data: {
						token: token, 
						exists: localStorage.getItem( 'push' ), 
						app: config.app_name
					},
					timeout: 10000
				}).done( function(response) {
						
					//phonon.preloader( ".circle-progress" ).hide();
					//phonon.notif( "Dispositivo adicionado "+ JSON.stringify( response ), 4000, false );
					localStorage.setItem( 'push', response );
				});
			
			}, function(error){
				phonon.notif( "TESTE "+ error, 5000, false );
			});
			
		},
		
		
		onTokenRefresh: function(){
			
			window.FirebasePlugin.onTokenRefresh(function(token) {
				// save this server-side and use it to push notifications to this device
				//phonon.notif( token, 5000, false );

				$.ajax({
					url: config.api() +'/dispositivos/add',
					type: "POST", 
					data: {
						token: token, 
						exists: localStorage.getItem( 'push' ), 
						app: config.app_name
					},
					timeout: 10000
				}).done( function(response) {
						
					//phonon.preloader( ".circle-progress" ).hide();
					//phonon.notif( "Dispositivo adicionado "+ JSON.stringify( response ), 4000, false );
					localStorage.setItem( 'push', response );
				});
			}, function(error) {
				phonon.notif( error, 5000, false );
			});
		},
		
		
		onNotificationOpen: function(){
			
			window.FirebasePlugin.onNotificationOpen(function(notification) {
				phonon.notif( "Acoes "+ JSON.stringify( notification.tap ), 5000, false );
				
				empresa_id = notification.empresa_id;
				
				if( ( empresa_id != null ) && ( notification.tap != false ) ){
					phonon.notif( "Redirecionando", 5000, false );
					phonon.navigator().changePage( 'empresa', notification.empresa_id );
				}
					
				
			}, function(error) {
				phonon.notif( error, 5000, false );
			});
		}
	}
	
});