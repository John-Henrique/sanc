//Small hack to remove the backdrop which cause the page to freeze by removing elements with class name 'backdrop'
//Based on the answer at http://stackoverflow.com/questions/4777077/removing-elements-by-class-name by vepasto
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

document.on( 'pageopened', function( evt ){
	console.log( "Page opened "+ evt.detail.page );
	removeElementsByClass('backdrop-panel');
});



/**
 * Se o usuário estiver logado 
 * redireciona para a tela principal 
 * utilizando as configurações do app
 **/
if( ( localStorage.getItem( 'userID' ) != undefined ) && ( localStorage.getItem( 'userID' ) != null ) ){
	console.log( "Principal");
	phonon.options({
		navigator: {
			defaultPage: 'principal', 
			animatePages: true, 
			enableBrowserBackButton: true, 
			templateRootDirectory: './telas'
		}, 
		i18n: null
	});

}else{
	
	/**
	 * Se não estiver logado 
	 * o app inicia com as configurações 
	 * iniciais para a tela login
	 * */
	phonon.options({
		navigator: {
			defaultPage: 'login', 
			animatePages: true, 
			enableBrowserBackButton: true, 
			templateRootDirectory: './telas'
		}, 
		i18n: null
	});
	console.log( "login");
}

var app = phonon.navigator();


app.on({page:'principal', preventClose:false, content: 'principal.html', readDelay: 1}, function( activity ){
	
	activity.onCreate(function(){
		avaliacoes.init();
		
		d = new Date();
		$( '.mes' ).val(d.getMonth());
		$( '.ano' ).val(d.getFullYear());
	});
	
	
	activity.onReady(function(){
		mes_ano_atual();
		avaliacoes.grafico();
	});
});



app.on({page:'adicionar', preventClose:false, content: 'adicionar.html', readDelay: 1}, function( activity ){
	
	activity.onCreate(function(){
		
		//avaliacoes.init();
		
		areasvida.questoes_areas_vida();
		
		//helper();
	});
	
	activity.onReady(function(){
		
	});
	
	
	activity.onHashChanged(function( param_dia, param_editar ){
		setTimeout(function(){
			//console.log( $( 'adicionar .btn-salvar' ).prop( 'class' ) );
			
			if( ( param_dia != undefined ) && ( param_dia != '00' ) ){
				$( 'adicionar .btn-salvar' ).data( 'dia', param_dia );
			}
			console.log( param_dia );
			
			
			// informa o ID da avaliação para editar
			if( param_editar != undefined ){
				avaliacoes.ver( param_editar );
				$( 'adicionar .btn-salvar' ).data( 'post_id', param_editar );
			}
			
		},2000);
	});
	
	activity.onHidden(function(){
		
	});
});



app.on({page:'avaliacoes', preventClose:false, content: 'avaliacoes.html', readDelay: 1}, function( activity ){
	
	activity.onCreate(function(){
		
	});
	
	activity.onReady(function(){
		avaliacoes.dias();
	});
	
	
	activity.onHidden(function(){
		
	});
});



app.on({page:'login', preventClose:false, content: 'login.html', readDelay: 1}, function( activity ){
	
	activity.onCreate(function(){
		//init(); //facebook.js
		/*
		if( ( localStorage.setItem( 'userID' ) != undefined ) && ( localStorage.setItem( 'userID' ) != null ) ){
			phonon.navigator().changePage( 'principal' );
		}else{
			phonon.navigator().changePage( 'login' );
		}
		 * */
	});
	
	activity.onReady(function(){
		
		// evitando problemas com o carregamento do plugin
		document.addEventListener( "deviceready", function(){
			//facebook.facebookStatus()//facebook.js
		}, false );
	});
	
	
	activity.onHidden(function(){
		
		avatar = localStorage.getItem( 'avatar' );
		//console.log( avatar );
		if( ( avatar != '' ) && ( avatar != null ) ){
			$( 'img.perfil-foto' ).prop( 'src', avatar );
			$( '.status' ).text( "Conectado" );
		}
	});
});


app.on({page:'fatos', preventClose:false, content: 'fatos.html', readDelay: 1}, function( activity ){
	
	activity.onCreate(function(){
		fatos.init();
	});
	
	activity.onReady(function(){
		fatos.listar();
	});
});


app.on({page:'desempenho', preventClose:false, content: 'desempenho.html', readDelay: 1}, function( activity ){
	
	activity.onCreate(function(){
		desempenho.init();
		areasvida.areas_vida();
	});
	
	
	activity.onReady(function(){
		desempenho.grafico();
	});
	
});


app.on({page:'sobre', preventClose:false, content: 'sobre.html', readDelay: 1}, function( activity ){});


app.on({page:'configuracoes', preventClose:false, content: 'configuracoes.html', readDelay: 1}, function( activity ){
	
	activity.onCreate(function(){
		
		$( '.sexo' ).text( sessionStorage.getItem( 'sexo' ) );
		$( '.email' ).text( sessionStorage.getItem( 'email' ) );
		
		nascimento = sessionStorage.getItem( 'nascimento' );
		idade = ( nascimento != null)? parseInt( nascimento.substring( nascimento.length, 6 ) - new Date().getFullYear() ):"Não informado";
		
		$( '.idade' ).text( idade );
		
		
		configuracoes.init();
	});
	
	
	activity.onReady(function(){
		configuracoes.areas_vida();
		
		
		
		avatar = localStorage.getItem( 'avatar' );
		//console.log( avatar );
		if( ( avatar != '' ) && ( avatar != null ) ){
			$( 'img.perfil-foto' ).prop( 'src', avatar );
		}
	});
});


$(function(){
	app.start();
});