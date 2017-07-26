$(function(){
	
	avaliacoes = {
		
		init:function(){
			
			console.log( "avaliacoes.js" );
			
			$( 'principal .mes, principal .ano' ).on( 'change', function(){
				avaliacoes.grafico();
			});
			
			
			$( document ).on( 'click', '.btn-comparar', function( e ){
				
				// permite acessar o painel, ele não está dentro da tela principal
				if( phonon.navigator().currentPage == 'principal' ){
					console.log( "comparar");
					e.preventDefault();
					
					phonon.panel( "#panel-comparar" ).close();
					
					avaliacoes.grafico();
				}
			});
			
			
			
			
			$( document ).on( 'click', 'avaliacoes .btn-comparar', function( e ){
				// permite acessar o painel, ele não está dentro da tela principal
				if( phonon.navigator().currentPage == 'principal' ){
					e.preventDefault();
					
					phonon.panel( "#panel-comparar" ).close();
					console.log("atualizando dias");
					avaliacoes.dias();
				}
			});
			
			
			$( document ).on( 'click', 'adicionar .btn-salvar', function(){
				console.log( "enviando avaliação" );
				avaliacoes.adicionar();
			});
			
			
		},
		
		
		ver: function( post_id ){
			
			consulta.query( '/avaliacoes/view/'+ post_id, {user_id:localStorage.getItem('user_id')}, function( retorno ){
				
				console.log( retorno );
				
				$( '[name=fato]' ).val( retorno.fato );
				
				$.each( retorno.meta, function(i, v){
					//console.log( '[name='+ i +']' );
					$( '[name='+ i +'][value="'+ v +'"]' ).prop( 'checked', true );
				});
				
				$( 'adicionar .btn-salvar' ).data( 'dia', retorno.dia );
				
				
			}, function(erro){
				//phonon.notif( "Houve um erro ao tentar recuperar suas áreas da vida", 10000, false );
				console.log( erro );
			});
		},
		
		
		
		adicionar: function(){
			
			hora = '';
			radio = '';
			respostas = {
				'user_id': localStorage.getItem( 'user_id' ), 
				'post_id': $( 'adicionar .btn-salvar' ).data( 'post_id' )
			};
					
			// Se hora possuir apenas 5 digitos
			if( hora.length <= 5 ){
				d = new Date();
				dia = $( '.btn-salvar' ).data( 'dia' );
				dia = (dia == undefined)?d.getDate():$( '.btn-salvar' ).data( 'dia' );
				hora = d.getFullYear() +'-'+ parseInt( d.getMonth() + 1 ) +'-'+ dia;
				respostas['dia'] = hora;
			}
			
			
			$.each( $( '.questao' ), function( index, valor ){
				
				$.each( $( valor ).find( 'input,textarea' ), function( index, valor ){
					
					elem = $( valor );
					
					
					if( elem.prop( 'name' ) != radio ){
							
						// auxiliar para impedir repetir os radios
						radio = elem.prop( 'name' );
						
						// campos de radio, checagem e select
						if( elem.prop( 'type' ) == 'radio' || elem.prop( 'type' ) == 'select' ){
							
							resposta = $( 'input[name='+ elem.prop( 'name' ) +']:checked' ).val();
							/*
							console.log( radio );
							console.log( resposta );
							*/
							respostas[radio] = resposta;
							//apneia_salvar( hora, radio, resposta );
						}else{
							// campos de texto, numeros, datas, horas e caixas de textos
							
							resposta = elem.val();
							/*
							console.log( radio );
							console.log( resposta );
							*/
							respostas[radio] = resposta;
							//apneia_salvar( hora, radio, resposta );
						}
						
					}// fim do if elem.prop( 'name' )
				});
			});
			
			
			console.log( respostas );
			
			consulta.send( '/avaliacoes/add', {campos:respostas}, function( retorno ){
				
				phonon.notif( retorno, 3000, false );
				console.log( retorno );
				
				phonon.navigator().changePage( 'principal' );
			}, function(erro){
				phonon.notif( erro, 10000, false );
				console.log( erro );
			});
			
		},
		
		
		
		
		dias:function(){
			
			d = new Date();
			dia = d.getDate();
			mes = d.getMonth();
			
			mes = ( mes < 10 )? '0'+ mes:mes; // caso o mês seja menor que 10
			
			html = '<li class="divider text-center">Avaliações recentes</li>';
			
			for(i=dia;i >= 1;i--){
				
				dia = ( i < 10 )? '0'+i:i; // caso o dia seja menor que 10
				
				html += '<li>';
				html += '	<a href="#!adicionar/'+ dia +'" class="pull-right icon icon-add"></a>';
				html += '	<a href="#!adicionar/'+ dia +'" class="padded-list dia-'+ dia +'">'+ dia +'/'+ mes +'</a>';
				html += '</li>';
				
			};
			
			
			if( html.length == 0 ){
				html = '<li class="divider">Não é possível avaliar agora</li>'+ html;
			}
			
			$( 'avaliacoes .dias' ).html( html );
		},
		
		
		
		/**
		 * Gera o HTML referente ao questionário
		 **/
		areas_vida:function(){
			
			consulta.query( '/areasvida/listar', {user_id:localStorage.getItem('user_id')}, function( retorno ){
				
				html = '';
				
				$.each( retorno, function( index, valor ){
					
					//console.log( valor );
					
					// imprimindo o HTML de cada área da vida
					html += avaliacoes.html( valor );
					//html += avaliacoes.html( valor );
				});
				
				
				html += avaliacoes.fato();
				
				$( '.swiper-wrapper' ).html( html );
				
				helper();
				
			}, function(erro){
				phonon.notif( "Houve um erro ao tentar recuperar suas áreas da vida", 10000, false );
			});
		},
		
		
		// retorna o HTML referente ao campo fato importante
		fato:function(){
			
			html  ='';
			html +='	<div class="questao swiper-slide">';
			html +='		<h2 class="text-center" >Qual foi o fato mais importante deste dia?</h2>';
			html +='		';
			html +='		<div class="padded-top"></div>';
			html +='		';
			html +='		<textarea name="fato" class="questao-fato" placeholder="Descreva o fato importante"></textarea>';
			html +='		';
			html +='		<div class="padded-top"></div>';
			html +='		<button class="btn btn-salvar fit-parent primary padded-top">Salvar avaliação</button>';
			html +='	</div>';
			
			return html;
		},
		
		
		html:function( area ){
			
			html  ='';
			html +='	<div class="questao swiper-slide">';
			html +='		<h2 class="text-center" >'+ area.nome +'</h2>';
			html +='		';
			html +='		<div class="padded-top"></div>';
			html +='		';
			html +='		<ul class="list">';
			html +='			<li class="padded-for-list">';
			html +='				<label class="radio">';
			html +='					<input type="radio" name="'+ area.nome.replace( 'í', 'i' ) +'" value="1" class="questao-'+ area.id +' campo">';
			html +='					<span></span>';
			html +='					<span class="text" >Péssimo</span>';
			html +='				</label>';
			html +='			</li>';
			html +='			<li class="padded-for-list">';
			html +='				<label class="radio">';
			html +='					<input type="radio" name="'+ area.nome.replace( 'í', 'i' ) +'" value="2" class="questao-'+ area.id +' campo">';
			html +='					<span></span>';
			html +='					<span class="text" >Ruim</span>';
			html +='				</label>';
			html +='			</li>';
			html +='			<li class="padded-for-list">';
			html +='				<label class="radio">';
			html +='					<input type="radio" name="'+ area.nome.replace( 'í', 'i' ) +'" value="3" class="questao-'+ area.id +' campo">';
			html +='					<span></span>';
			html +='					<span class="text" >Regular</span>';
			html +='				</label>';
			html +='			</li>';
			html +='			<li class="padded-for-list">';
			html +='				<label class="radio">';
			html +='					<input type="radio" name="'+ area.nome.replace( 'í', 'i' ) +'" value="4" class="questao-'+ area.id +' campo">';
			html +='					<span></span>';
			html +='					<span class="text" >Bom</span>';
			html +='				</label>';
			html +='			</li>';
			html +='			<li class="padded-for-list">';
			html +='				<label class="radio">';
			html +='					<input type="radio" name="'+ area.nome.replace( 'í', 'i' ) +'" value="5" class="questao-'+ area.id +' campo">';
			html +='					<span></span>';
			html +='					<span class="text" >Ótimo</span>';
			html +='				</label>';
			html +='			</li>';
			html +='		</ul>';
			html +='		';
			html +='	</div>';
			html +='	';
			
			return html;
		},
		
		
		grafico:function(){
			
			var labels = [], data = [], graficoTipo = 'doughnut';
			
			tipo = $( '.grafico-tipo' ).val();
			if( tipo != graficoTipo ){
				graficoTipo = tipo;
			}
			
			
			consulta.query( '/avaliacoes/listar', {mes:jQuery( '.mes' ).val(),ano:jQuery( '.ano' ).val(),mes2:jQuery( '.mes2' ).val(),ano2:jQuery( '.ano2' ).val()}, function( retorno ){
				//console.log( retorno );
				
				if( retorno.periodo1.labels.length != 0 ){
					
					$( '#areas-vida' ).slideDown( 'fast' );
					
					data = {
						// These labels appear in the legend and in the tooltips when hovering different arcs
						labels: retorno.periodo1.labels,
						
						datasets: [{
							label: "periodo1", 
							yAxisID: "1", 
							data: retorno.periodo1.valores, 
							backgroundColor: [
								'#2ecc71',
								'#3498db',
								'#95a5a6',
								'#9b59b6',
								'#f1c40f',
								'#e74c3c',
								'#34495e', 
								'#A0522D', 
								'#B22222',
								'#FA8072',
								'#DA70D6',
								'#9932CC',
								'#8A2BE2',
								'#FF6347',
								'#00BFFF',
								'#00FFFF',
								'#EEDC82',
								'#EEC900',
								'#EE6363',
								'#EE7942',
								'#EE2C2C',
								'#CD3700',
								'#FF6EB4',
								'#EE30A7',
								'#9B30FF'
							  ],
						}]
					}
				
					
					// caso o periodo2 tenha retornado valores
					if( ( retorno.periodo2 != undefined ) && ( retorno.periodo2.valores.length != 0 ) ){
						
						data.datasets[1] = {
							label: "periodo2", 
							yAxisID: "2", 
							data: retorno.periodo2.valores,
							backgroundColor: [
								'#2ecc71',
								'#3498db',
								'#95a5a6',
								'#9b59b6',
								'#f1c40f',
								'#e74c3c',
								'#34495e', 
								'#A0522D', 
								'#B22222',
								'#FA8072',
								'#DA70D6',
								'#9932CC',
								'#8A2BE2',
								'#FF6347',
								'#00BFFF',
								'#00FFFF',
								'#EEDC82',
								'#EEC900',
								'#EE6363',
								'#EE7942',
								'#EE2C2C',
								'#CD3700',
								'#FF6EB4',
								'#EE30A7',
								'#9B30FF'
							]
						}
					}
					
					
					setTimeout(function(){
						var ctx = document.getElementById('areas-vida').getContext('2d');
						var myDoughnutChart = new Chart(ctx, {
							type: graficoTipo,
							data: data,
							//options: options
						});
					},300);
				}else{
					$( '#areas-vida' ).slideUp( 'fast' );
				}
				
			}, function( erro ){
				window.alert( 'Erro: '+ erro );
			});
		}
		
	}
});