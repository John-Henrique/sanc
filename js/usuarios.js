$(function(){
	
	usuarios = {
		
		init: function(){
			
		},
		
		
		login: function( data ){
			//console.log( data );
			//console.log( typeof( data) );
			
			
			localStorage.setItem( 'nome', 		data.nome );
			localStorage.setItem( 'sexo', 		(data.sexo == 'male')?"Masculino":"Feminino" );
			localStorage.setItem( 'nascimento', data.nascimento );
			localStorage.setItem( 'email', 		data.email );
			localStorage.setItem( 'first_name', data.first_name );
			localStorage.setItem( 'last_name', 	data.last_name );
			localStorage.setItem( 'userID', 	data.userID );// ID Facebook
			localStorage.setItem( 'accessToken',data.accessToken );
			localStorage.setItem( 'avatar', 	'http://graph.facebook.com/'+ data.userID +'/picture?width=128&height=128' );
			
			
			consulta.send( '/usuarios/login', {user:data}, function(data){
					usuarios.sessao( data );
				}, function( erro ){
				msg = JSON.parse( erro );
				phonon.notif( msg.message, 5000, true );
				console.log( msg.message );
			});
		},
		
		
		
		sessao: function( dados ){
			console.log( "Sessão " );
			console.log( dados );
			console.log( dados.ID );
			
			localStorage.setItem( 'user_id', dados.ID );// ID WordPress
			localStorage.setItem( 'treta', 	dados );// ID WordPress
			
			if( dados.ID ){
				// redireciona para a tela principal
				phonon.navigator().changePage( "principal" );
				
			}
		},
		
		
		logout: function(){
			localStorage.removeItem( 'nome' );
			localStorage.removeItem( 'sexo' );
			localStorage.removeItem( 'nascimento' );
			localStorage.removeItem( 'email' );
			localStorage.removeItem( 'first_name' );
			localStorage.removeItem( 'last_name' );
			localStorage.removeItem( 'user_id' );
			localStorage.removeItem( 'userID' );
			localStorage.removeItem( 'accessToken' );
			localStorage.removeItem( 'avatar' );
			
			
			phonon.navigator().changePage( "login" );
		}
	}
	
});