$(function(){
	
	configuracoes = {
		
		init:function(){
			
			
			$( document ).on( 'click', 'configuracoes .btn-salvar', function(){
				console.log( "enviando area vida" );
				configuracoes.adicionar();
			});
			
			
		},
		
		
		adicionar: function(){
			
		},
		
		
		/**
		 * Gera o HTML referente ao questionário
		 **/
		areas_vida:function(){
			
			consulta.query( '/areasvida/listar', {user_id:localStorage.getItem('user_id')}, function( retorno ){
				
				html = '<li class="divider text-center">Estas são suas áreas da vida</li>';
				
				$.each( retorno, function( index, valor ){
					
					//console.log( valor );
					
					// imprimindo o HTML de cada área da vida
					html += '<li>';
					//html += '	<a href="#action" class="pull-right icon icon-close"></a>';
					html += '	<span class="padded-list">'+ valor.nome +'</span>';
					html += '</li>';
				});
				
				$( '.config-areas-vida' ).html( html );
				
				
			}, function(erro){
				phonon.notif( "Houve um erro ao tentar recuperar suas áreas da vida", 10000, false );
			});
		}
		
	}
});