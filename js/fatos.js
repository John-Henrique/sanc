$(function(){
	
	fatos = {
		
		init:function(){
			
			$( '.mes, .ano' ).on( 'change', function(){
				fatos.listar();
			});
			
			
			$( document ).on( 'click', '.comparar', function( e ){
				
				if( phonon.navigator().currentPage == 'fatos' ){
					e.preventDefault();
					
					phonon.panel( "#panel-comparar" ).close();
					
					fatos.listar();
				}
			});
		},
		
		
		
		
		
		listar:function(){
			
			var labels = [], data = [], graficoTipo = 'doughnut';
			var mes = jQuery( '.mes' ).val();
			var ano = jQuery( '.ano' ).val();
			
			$( 'span.mes' ).text( ' - '+ mes  +'/' );
			$( 'span.ano' ).text( ano );
			
			/**
			 * A listagem será limitada a 31 
			 * por causa da quantidade de dias 
			 * do mês
			 * 
			 * Não será necessário utilizar 
			 * paginação porque o usuário 
			 * pode escolher o mês e ano 
			 **/
			consulta.query( '/fatos/listar?order=ASC&posts_per_page=31&nopaging=0', {author:localStorage.getItem('user_id'),mes:mes,ano:ano,mes2:jQuery( '.mes2' ).val(),ano2:jQuery( '.ano2' ).val()}, function( retorno ){
				//html2  = '<li class="divider">Dados de sessão</li>';
				html2  = '';
				//console.log( retorno );
				
				
				$.each( retorno, function(i, v ){
					
					html2 += fatos.html( v );
				});
				
				$( '.fatos' ).html( html2 );
				
			}, function( erro ){
				phonon.notif( erro, 4000, true );
				console.log( erro );
			});
		},
		
		
		html:function(v){
			html ='';
			
			fato = (v.fato!='')?v.fato:"Não informado";
			
			/*
			html += '<li class="item-expanded">';
			//html += '	<a href="#!avaliacoes/'+ v.id +'">';
			html += '		<div class="item-content">';
			html += '			<span class="title">'+ v.fato +'</span>';
			html += '			<span class="body">'+ v.data +'</span>';
			html += '		</div>';
			//html += '	</a>';
			html += '</li>';
			*/
			html += '<li>';
			//html += '	<a href="#!adicionar/00/'+ v.id +'" class="pull-left">'+ v.data +'</a>';
			html += '	<a href="#!adicionar/00/'+ v.id +'" class="padded-list">'+ v.data +' - '+ fato +'</a>';
			html += '</li>';
			
			return html;
		}
	}
});