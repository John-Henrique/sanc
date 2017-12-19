$(function(){
	
	metas = {
		
		init:function(){
			
			$( 'metas .btn-salvar' ).on( 'click', function(){
				metas.adicionar();
			});
			
			$( 'detalhes .btn-salvar' ).on( 'click', function(){
				metas.adicionar_acao();
			});
			
			
			$( '.mes, .ano' ).on( 'change', function(){
				metas.listar();
			});
			
			
			$( document ).on( 'click', '.comparar', function( e ){
				
				if( phonon.navigator().currentPage == 'metas' ){
					e.preventDefault();
					
					phonon.panel( "#panel-comparar" ).close();
					
					metas.listar();
				}
			});
			
			
			
			$( '.nota' ).blur(function(){
				metas.meta_nota_geral();
			});
		},
		
		
		
		meta_nota_geral: function(){
			
			console.log( 'meta_nota_geral' );
			nota = 0;
			
			$.each( $( '.nota' ), function( chave, valor ){
				
				if( valor != '' ){
					nota = parseFloat( valor + nota );
				}
			});
			
			
			// atualizando a nota da meta
			consulta.send( '/metas/nota/'+ meta_id, {author:localStorage.getItem('user_id'),nota:nota}, function( retorno ){
				
				console.log( retorno );
				
				// valor da nota da meta
				$( '.nota-geral' ).val( nota );
			});
		},
		
		
		adicionar_acao: function(){
			
			var prompt = phonon.prompt( "Informe qual sua ação", "Nova meta", true, "Adicionar", "Cancelar" );
			prompt.on('confirm', function(inputValue){
				
				meta_id = $( '.meta_id' ).val();
				
				consulta.send( '/metas/add-action', {author:localStorage.getItem('user_id'),meta_id:meta_id,acao:inputValue}, function( retorno ){
					console.log( retorno );
					
					metas.detalhes( meta_id );
				});
			});
			
			prompt.on('cancel', function(){
				
			});
		},
		
		
		
		adicionar: function(){
			
			var prompt = phonon.prompt( "Informe qual sua meta", "Nova meta", true, "Adicionar", "Cancelar" );
			prompt.on('confirm', function(inputValue){
				
				consulta.send( '/metas/add', {author:localStorage.getItem('user_id'),meta:inputValue}, function( retorno ){
					console.log( retorno );
					
					phonon.navigator().changePage( 'detalhes', retorno );
				});
			});
			
			prompt.on('cancel', function(){
				
			});
		},
		
		
		detalhes: function( meta_id ){
			
			consulta.query( '/metas/view/'+ meta_id, {author:localStorage.getItem('user_id')}, function( retorno ){

				html  = '';
				console.log( retorno );

				html += '<div class="row">';
				html += '	<div class="column phone-3 tablet-3 large-3"><strong>Mês</strong></div>';
				html += '	<div class="column phone-3 tablet-3 large-3"><strong>Meta</strong></div>';
				html += '	<div class="column phone-3 tablet-3 large-3"><strong>Nota</strong></div>';
				html += '</div>';
				
				
				if( retorno == '' ){
					html  += '<div class="phone-12 column">Dados de sessão</div>';
					html  += '	<p>Dados de sessão</p>';
					html  += '</div>';
				}else{
					$.each( retorno.acoes, function(i, v ){
						
						html += metas.html2( v );
					});
				}
				$( '.metas' ).html( html );
				
			});
		},
		
		
		
		listar:function(){
			
			var ano = jQuery( '.ano' ).val();
			
			$( 'span.ano' ).text( ano );
			
			
			consulta.query( '/metas/listar?order=ASC', {author:localStorage.getItem('user_id'),ano:ano}, function( retorno ){
				//html  = '<li class="divider">Dados de sessão</li>'; 
				html  = '';
				console.log( retorno );

				html += '<div class="row">';
				html += '	<div class="column phone-8 tablet-8 large-8"><strong>Meta</strong></div>';
				html += '	<div class="column phone-4 tablet-4 large-4"><strong>Nota</strong></div>';
				html += '</div>';
				
				
				if( retorno == '' ){
					html  += '<div class="phone-12 column">Dados de sessão</div>';
					html  += '	<p>Dados de sessão</p>';
					html  += '</div>';
				}else{
					$.each( retorno, function(i, v ){
						
						html += metas.html( v );
					});
				}
				$( '.metas' ).html( html );
				
			}, function( erro ){
				phonon.notif( erro, 4000, true );
				console.log( erro );
			});
		},
		
		
		html:function(v){
			html ='';
			
			
			html += '<div class="row">';
			html += '	<div class="column phone-9 tablet-9 large-9"><a href="#!detalhes/'+ v.id +'">'+ v.meta +'</a></div>';
			html += '	<div class="column phone-3 tablet-3 large-3"><input type="number" class="nota text-center" value="'+ v.nota +'" ></div>';
			html += '</div>';
			//html += '<div class="row"></div>';
			
			return html;
		},
		
		
		html2:function(v){
			html ='';
			
			
			html += '<div class="row">';
			html += '	<div class="column phone-3 tablet-3 large-3">'+ v.mes +'</div>';
			html += '	<div class="column phone-6 tablet-6 large-6">'+ v.acao +'</div>';
			html += '	<div class="column phone-3 tablet-3 large-3"><input type="number" class="nota text-center" value="'+ v.nota +'" ></div>';
			html += '</div>';
			//html += '<div class="row"></div>';
			
			return html;
		}
	}
});