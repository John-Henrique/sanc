$(function(){
	
	desempenho = {
		
		init:function(){
			
			$( '.area1, .area2' ).on( 'change', function(){
				desempenho.grafico();
			});
			
			
			
			$( document ).on( 'click', '.comparar', function( e ){
				e.preventDefault();
				
				phonon.panel( "#panel-comparar" ).close();
				
				desempenho.grafico();
			});
			
			
			
			
			$( document ).on( 'click', '#periodo a', function(){
				
				periodo =  $( this ).prop( 'id' );
				
				switch( periodo ){
					case "ano":
						periodo = $( '.ano' ).val();
						break;
						
					case "mes":
						periodo = $( '.mes' ).val();
						break;
						
					default:
						/**
						 * esconde ano2 e mes2
						 * */
						$( 'form.comparar' ).hide();
						phonon.panel( "#panel-comparar" ).open();
						break;
				}
				
				localStorage.setItem( 'periodo', periodo );
			});
			
			
			
			/**
			 * volta a mostrar os campos ano2 e mes2
			 **/
			$( document ).on( 'click', '.icon-close, .comparar', function(){
				$( 'form.comparar' ).show();
			});
		},
		
		
		
		corrige:function(str){
			return str.replace( 'í', 'i' );
		},
		
		grafico:function(){
			
			var labels = [], data = {};
			area1 	= ($( '.area1' ).val() == null )?'Geral':$( '.area1' ).val();
			area2 	= ($( '.area2' ).val() == null )?'Geral':$( '.area2' ).val();
			ano 	= ($( '.ano' ).val() == '' )? new Date().getFullYear():$( '.ano' ).val();
			mes 	= ($( '.mes' ).val() == null )? new Date().getMonth():$( '.mes' ).val();
			
			console.log(ano);
			console.log(mes);
			
			periodo = (localStorage.getItem( 'periodo' ) != null)?localStorage.getItem( 'periodo' ):'';
			user_id = localStorage.getItem('user_id');
			
			consulta.query( '/desempenho/listar', {area1:desempenho.corrige(area1),area2:desempenho.corrige(area2),user_id:user_id,mes:mes,ano:ano,periodo:periodo}, function( retorno ){
				//console.log( retorno );
				
				if( retorno.labels.length != 0 ){
					
					$( '#desempenho' ).slideDown( 'fast' );
					console.log( retorno.datasets );
					console.log( retorno.labels );
					
					var data = {
						labels: retorno.labels,
						labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Sep', 'Out', 'Nov', 'Dez'],
						datasets: [{
							label: retorno.datasets[1].label,
							//new option, type will default to bar as that what is used to create the scale
							type: "line",
							//backgroundColor: window.chartColors.green,
							borderColor: window.chartColors.blue,
							borderWidth: 2,
							fill: false,
							/*
							fillColor: "rgba(220,20,220,0.2)",
							strokeColor: "rgba(220,20,220,1)",
							pointColor: "rgba(220,20,220,1)",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							 * */
							data: retorno.datasets[1].data
						},{
							label: retorno.datasets[0].label,
							//new option, type will default to bar as that what is used to create the scale
							type: "bar",
							backgroundColor: window.chartColors.red,
							/*
							fillColor: "rgba(220,220,220,0.2)",
							strokeColor: "rgba(220,220,220,1)",
							pointColor: "rgba(220,220,220,1)",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							*/
							data: retorno.datasets[0].data
						}]
					};
					
					setTimeout(function(){
						var ctx = document.getElementById('desempenho').getContext('2d');
						var myDoughnutChart = new Chart(ctx, {
									type: 'bar',
									data: data,
									options: {
										responsive: true,
										title: {
											display: true,
											text: 'Comparação de áreas da vida'
										},
										tooltips: {
											mode: 'index',
											intersect: true
										}
									}
								});
					},300);
				}else{
					$( '#desempenho' ).slideUp( 'fast' );
				}
				
			}, function( erro ){
				phonon.notif( erro, 4000, true );
				console.log( erro );
			});
		}
		
	}
});