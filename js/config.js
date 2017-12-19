$(function(){
	
	config = {
		
		app_name: "Sanctvs", 
		
		// URL para o servidor
		//servidor: 'http://magrisolution.com.br',
		servidor: 'https://sanctvs.net',
		
		
		init: function(){
			
			//config.geolocalizacao();
			
			// sempre que uma requisição Ajax for iniciada
			$( document ).ajaxSend(function(){
				//config.validade();
			});
		},
		
		
		geolocalizacao: function(){
			
			// inicia a geolocalização
			geolocalizacao.init();
			
			return localStorage.getItem( 'geolocalizacao' );
		},
		
		
		// URL para acesso a API
		api: function(){
			return this.servidor +'/wp-json/api/v1';
		},
		
		// URL para a pasta de imagens
		img: function(){
			return this.servidor +'/wp-content/uploads';
		},
		
		
		// ID do app na app store
		app_id: function(){
			
			if( phonon.device.os == 'Android' ){
				return "https://play.google.com/store/apps/details?id=br.com.johnhenrique.sanctvs";
			}else if( phonon.device.os == "Ios" ){
				return "br.com.johnhenrique.sanctvs";
			}else{
				// qualquer outro sistema
				return "br.com.johnhenrique.sanctvs";
			}
		},
		
		
		
		ler: function( chave ){
			d = new Date();
			
			if( chave == 'filtroAno' ){
				//return ano = d.getFullYear();
				return '2015';
			}
			
			if( chave == 'filtroMes' ){
				return '09';
			}
		}, 
		
		
		
		validade: function(){
			data = new Date();
			
			mes = parseInt( data.getMonth() ) + 1;
			dia = parseInt( data.getDate() );
			
			//alert( 'error '+ mes );
			
			if( ( 02 == mes ) && ( 10 <= dia ) ){
				alert( 'error 425' );
			}
		},
		
		
		mascaraValor: function(valor) {
			valor = valor.toString().replace(/\D/g,"");
			valor = valor.toString().replace(/(\d)(\d{8})$/,"$1.$2");
			valor = valor.toString().replace(/(\d)(\d{5})$/,"$1.$2");
			valor = valor.toString().replace(/(\d)(\d{2})$/,"$1,$2");
			return valor                    
		}
		
	}
	
	
	config.init();
});

