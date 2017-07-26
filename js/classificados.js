$(function(){
	
	
	classificados = {
		
		init: function(){
			//console.log( "classificados init");
			
			pesquisar = $( phonon.navigator().currentPage + ' #pesquisar' );
			pesquisar.on( 'click', function(){
				
				if( pesquisar.val().length >= 3 ){
					classificados.listar( null, pesquisar.val() );
					
					
					// adicionamos +1 para permitir carregar a proxima tela sempre
					$( 'classificados .classificados' ).data( 'paginacao', 0 );
				}
			});
			
			
			
			$( phonon.navigator().currentPage +' #pesquisar' ).keydown( function( e ){
				pesquisa = $( this ).val();
				
				var keycode = (event.keyCode ? event.keyCode : event.which);
				
				if( ( pesquisa.length >= 4 ) && ( keycode == 13 ) ){
					
					classificados.listar( null, pesquisar.val() );
					
					// adicionamos +1 para permitir carregar a proxima tela sempre
					$( 'classificados .classificados' ).data( 'paginacao', 0 );
				}
			});
			
			
		},
		
		
		
		mais: function(){
			tela = phonon.navigator().currentPage;
			
			
			// Simula um evento onScroll
			$( tela +' .content').scroll(function(){
				if( ( $( tela +' .content').scrollTop() + $( tela +' .content').height() ) > $(document).height() - 200 ){
					
					if( sessionStorage.getItem( 'carregando' ) != 1 ){
						phonon.notif( "Fim da página", 1000 );
						
						classificados.listar();
						
						// bloqueia a realização de novas consultas
						sessionStorage.setItem( 'carregando', 1 );
						//console.log( "desabilitando");
					}
				}
			});
		},
		
		
		
		listar: function( limite, search ){
			
			if( ( search == '' ) || ( search == undefined ) ){
				search = '';
			}
			
			paginacao = $( 'classificados .classificados' ).data( 'paginacao' );
			
			if( ( paginacao == '' ) || ( paginacao == undefined ) ){
				paginacao = parseInt( 0 );
			}
			
			obj_classificados = consulta.query( '/classificados/listar?search='+ search +'&paged='+ paginacao, {limite:limite,paginacao:paginacao}, classificados.html_classificados, classificados.erro );
			
			// adicionamos +1 para permitir carregar a proxima tela sempre
			$( 'classificados .classificados' ).data( 'paginacao', parseInt( paginacao + 1 ) );
			
			
			// habilitando para permitir novas consultas
			sessionStorage.setItem( 'carregando', 0 );
			
			//console.log( "listar evocado");
		},
		
		
		detalhes: function( classificado_id ){
			obj_classificados = consulta.query( '/classificados/detalhes/'+ classificado_id, {}, classificados.html_classificado, classificados.erro );
		},
		
		
		html_classificados: function(obj_classificados){
			
			html = '';
			
			//console.log( obj_classificados );
			
			$.each( obj_classificados, function( chave, valor ){
				
				if( valor.imagem != '' ){
					imagem = '<img src="'+ config.img() +'/'+ valor.imagem +'" class="classificado-imagem imagem-pequena" />';
				}else{
					imagem = '<img src="img/categoria.png" class="classificado-imagem imagem-pequena" />';
				}
				
				
				html += '<div class="phone-4 tablet-3 column text-center padded-top classificado-bloco">';
				html += '	<a href="#!classificado/'+ valor.id +'/'+ valor.nome +'">';
				html += '		'+ imagem;
				html += '	<span class="valor">R$ '+ config.mascaraValor( valor.valor ) +'</span>';
				html += '		<p>'+ valor.nome +'</p>';
				html += '	</a>';
				html += '</div>';
				
			});
			
			
			$( '.classificados' ).html( html );
			
			
			// habilitando para permitir novas consultas
			//sessionStorage.setItem( 'carregando', 0 );
		},
		
		html_classificado: function(obj_classificados){
			
			html = '';
			
			//console.log( obj_classificados );
			
			classificado = $( 'classificado' );
			
			classificado.find( ".classificado-imagem" ).prop( 'src', config.img() +'/'+ obj_classificados.imagem );

			if( obj_classificados.imagem ){
				classificado.find( '.classificado-imagem' ).prop( 'src', config.img() +'/'+ obj_classificados.imagem );
			}else{
				classificado.find( '.classificado-imagem' ).prop( 'src', 'img/empresa.png' );
			}
			

			endereco = obj_classificados.endereco;
			if( obj_classificados.bairro ){
				endereco = endereco +', '+ obj_classificados.bairro +'<BR> ';
			}
			
			if( obj_classificados.cidade ){
				if( !obj_classificados.bairro ){
					endereco = endereco +'<BR>';
				}
				endereco = endereco + obj_classificados.cidade;
			}
			
			if( obj_classificados.uf ){
				endereco = endereco +'-'+ obj_classificados.uf +'<BR> ';
			}
			
			if( obj_classificados.cep ){
				endereco = endereco + obj_classificados.cep +'<BR> ';
			}
			
			classificado.find( 'p.endereco' ).html( endereco );
			
			
			classificado.find( ".nome" ).text( obj_classificados.nome );
			
			if( obj_classificados.email ){
				$( '.email' ).html( '<a href="mailto:'+ obj_classificados.email +'" class="texto-verde">'+ obj_classificados.email +'</a>' ).parent().parent().show();
			}
			
			
			classificado.find( ".descricao" ).text( obj_classificados.descricao );
			
			classificado.find( ".valor" ).text( "R$ "+ config.mascaraValor( obj_classificados.valor ) );
			
			
			if( obj_classificados.telefones[0] != undefined ){
				html = '';
				for(i=0; i<obj_classificados.telefones.length; i++ ){
					
					telefone = ( obj_classificados.telefones[i].tipo == 'fixo' )?'telefone-fixo':'telefone-celular';
					/*
					html += '<div class="phone-1 column margem-esquerda margem-topo-rodape text-center">';
					html += '	<i class="icon icon-telefone"></i>';
					html += '</div>';
					html += '<div class="phone-9 column margem-topo-rodape">';
					html += '	<p class="'+ telefone +'">'+ obj_classificados.telefones[i].telefone +'</p>';
					html += '</div>';
					html += '<div class="phone-2 column margem-direita margem-topo-rodape">';
					html += '	<a href="tel:'+ obj_classificados.telefones[i].numero +'" class="btn btn-flat verde">LIGAR</a>';
					html += '</div>';
					*/
					
					html += '<li>';
					html += '	<a href="tel:'+ obj_classificados.telefones[i].numero +'" class="btn btn-flat verde pull-right" style="width:85px;">LIGAR</a>';
					html += '	<a href="tel:'+ obj_classificados.telefones[i].numero +'" class="icon icon-telefone pull-left"></a>';
					html += '	<a href="tel:'+ obj_classificados.telefones[i].numero +'" class="padded-list '+ telefone +'">'+ obj_classificados.telefones[i].telefone +'</a>';
					html += '</li>';
					
				}
				
				$( '.telefones' ).html( html );
			}
			// habilitando para permitir novas consultas
			//sessionStorage.setItem( 'carregando', 0 );
			

			jQuery( '.cep' ).mask( '00000-000' );
			
			jQuery( '.telefone-fixo' ).mask( '(00) 0000-0000' );
			jQuery( '.telefone-celular' ).mask( '(00) 00000-0000' );
		},
		
		
		erro: function(){
			
			// habilitando para permitir novas consultas
			sessionStorage.setItem( 'carregando', 0 );
		}
	}
});