$(function(){
	
	document.addEventListener( 'deviceready', share, false );
	
		
	
	function share(){
		
		$( '.btn-convide' ).on( 'click', function(){
			phonon.notif( "Ativando compartilhamento", 1000 );
			compartilhar();
		});
		
		
		function compartilhar(){
			
			/*
			 * NÃO FUNCIONA PARA TODAS AS OPÇÕES SOMENTE EMAIL E BLUETOOTH
			// this is the complete list of currently supported params you can pass to the plugin (all optional)
			var options = {
			  message: 'share this', // not supported on some apps (Facebook, Instagram)
			  subject: 'the subject', // fi. for email
			  files: ['', ''], // an array of filenames either locally or remotely
			  url: 'https://www.website.com/foo/#bar?a=b',
			  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
			}

			var onSuccess = function(result) {
			  phonon.notif( "Perfeito " + result.completed, 5000 ); // On Android apps mostly return false even while it's true
			  phonon.notif( "Shared to app: " + result.app, 5000 ); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
			}

			var onError = function(msg) {
			  phonon.notif( "Sharing failed with message: " + msg, 5000 );
			}

			window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
			 */
			window.plugins.socialsharing.share( 'Baixe agora seu guia comercial '+ config.app_name, null, null, config.app_id() );
		}
	}
	
	



	document.on('pageopened', function(evt) {
		///console.log(evt.detail.page + ' is opened for the first time (created)');
		
		
		/**
		 * Para remover as setas de navegação 
		 * das questões de cada questionário
		 **/
		setTimeout(function(){
			currentPage = phonon.navigator().currentPage;
			//console.log( currentPage );
			//$( currentPage +' .swiper-button-next, '+ currentPage +' .swiper-button-prev' ).hide();
		}, 4000);
	});
	
	
	
	/**
	 * Fechando o painel lateral 
	 * só é possivel fechar se estiver 
	 * utilizando a tag header
	 **/
	$( document ).on( 'click', '.fecha-painel', function(){
		console.log( "fechando painel");
		phonon.sidePanel( '#side-panel-example' ).close();
	});
	
});



/**
 * Definindo cores para os graficos
 **/

window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(201, 203, 207)'
};


	/**
	 * Retorna o ano e mês atual 
	 * preenchendo os selects 
	 * do gráfico
	 * */
	function mes_ano_atual(){
		dia = new Date();
		m = parseInt( dia.getMonth() + 1 );
		d = dia.getDate();
		mes = ( m < 10 )? '0'+ m:m; // caso o mês seja menor que 10
		d = ( d < 10 )? '0'+ d:d; // caso o dia seja menor que 10
		
		$( '.ano' ).val( dia.getFullYear() );
		$( '.mes' ).val( mes );
	}



	// atalho para usar notificações
	function n( str, tempo, cor ){
		if( ( cor == '' ) || ( cor == undefined )){
			cor = 'positive';
		}
		
		if( ( tempo == '' ) || ( tempo == undefined )){
			tempo = 5000;
		}
		
		notif = phonon.notif( str, tempo, true );
		notif.setColor( cor );
	}
	
	
	
	
	var mySwiper = '';
	
	/**
	 * Atalho para usar o unslider
	 **/
	function slide( elemento, direcao ){
		
		if( direcao == undefined ){
			direcao = 'horizontal';
		}
		
		if( elemento == undefined ){
			elemento = '.slider';
		}
		
		
		$( elemento ).unslider({
			autoplay: true,
			initSwipe: true,
			arrows: false, 
			animation: direcao
		});
	}
	
	
	
	function helper(){
	
		//console.log( "slide" );
		mySwiper = new Swiper('.swiper-container', {
			// Optional parameters
			direction: 'horizontal',
			loop: false, 
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			pagination: '.swiper-pagination',
			paginationType: 'fraction'
		});
	}
	
	
	function limita_texto( ){
		
		setTimeout(function(){
			
			if( window.innerWidth == 320 ){
				
				$.each( $( 'principal .promocoes p, principal .noticias .title' ), function( index, valor ){
					
					if( $( valor ).text().length <= 50 ){
						//console.log( "Menor que 10 "+ valor );
					}else{
						$( valor ).text( $( valor ).text().substring( 0, 45 ) +"..." );
						//console.log( "Maior que 10 "+ valor );
					}
				});
			}
			
		}, 1000 );
	}




	// usar sempre a biblioteca jquery.mask.min.js
	function formataMoeda( int_moeda ){
			var tmp = int_moeda+'';
			var neg = false;
			if(tmp.indexOf("-") == 0)
			{
				neg = true;
				tmp = tmp.replace("-","");
			}
			
			if(tmp.length == 1) tmp = "0"+tmp
		
			tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
			if( tmp.length > 6)
				tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
			
			if( tmp.length > 9)
				tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2,$3");
		
			if( tmp.length > 12)
				tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g,".$1.$2.$3,$4");
			
			if(tmp.indexOf(".") == 0) tmp = tmp.replace(".","");
			if(tmp.indexOf(",") == 0) tmp = tmp.replace(",","0,");
		
		return (neg ? '-'+tmp : tmp);
	}