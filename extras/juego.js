//Variables

var canvas = document.getElementById('main');
var contexto = canvas.getContext('2d');

var velocidad = 45;
var velocidadEnemigo = 20;
var personaje={
	x:100,
	y:400,
	estado: 'save',
	width:210,
	height:294	
}
var juego={
	estado: "iniciando",
	horda : 1
}
var limite = -1800; //ayuda a conotrolar desde donde comenzaran a salir los enemigos
var teclado={};

var Texto = {
	titulo :'',
	subtitulo : '',
	contador : -1
}
var fondo, imgPavo,imgEnemigo,imgRobo,imgGolpe;
var imgEscudo;
var huevos = [];
var enemigos = [];

var contadorHuevos= 20;
var huevosTomados = 0;
var numerosZorros= 20;

var golpeados=0, fuera=0;



//Funciones 
function Init(){
	fondo = new Image();
	fondo.src = 'Extras/imagenes/fondo_juego.png';
	
	imgPavo = new Image();
	imgPavo.src = 'Extras/imagenes/principal.png'
	
	
	imgEnemigo = new Image();
	imgEnemigo.src = 'Extras/imagenes/zorro.png';

	imgRobo = new Image();
	imgRobo.src = 'Extras/imagenes/conHuevo.png';

	imgGolpe = new Image();
	imgGolpe.src = 'Extras/imagenes/golpeado.png';

	imgEscudo = new Image();
	imgEscudo.src = 'Extras/imagenes/escudo.png';

	fondo.onload = function(){
		var intervalo = window.setInterval(Visor,1000/55);
	}
}

function dibujarFondo(){
	contexto.drawImage(fondo,0,0);
}
function DibujaTexto(){
	
	contexto.save();
	//contexto.globalAlpha = alpha;
	if(juego.estado=='jugando'){
		contexto.fillStyle = 'black';
		contexto.font = 'Bold 60pt Arial';
		contexto.fillText("Huevos : ",10,80);
		contexto.fillStyle = 'red';
		contexto.font = '60pt Arial';
		contexto.fillText((contadorHuevos-huevosTomados),350,80)
	}


	if(juego.estado =='perdiste'){
		velocidadEnemigo=0;
		contexto.fillStyle = 'black';
		contexto.font = 'Bold 90pt Arial';
		contexto.fillText("Perdiste  ",440,600);
		contexto.font = '60pt Arial';
		contexto.fillText("R para jugar con siguiente Nivel",440,700);
		Reiniciar();
	}

	
	
	if(juego.estado == 'Ganaste'){
		velocidadEnemigo=0;
		contexto.fillStyle = 'white';
		contexto.font = 'Bold 80pt Arial';
		contexto.fillText("Ganaste son 100 puntos",400,600);
		contexto.font = '50pt Arial';
		contexto.fillText("R para reiniciar",400,700);
		Reiniciar();
	}


}
function Reiniciar(){
	
	if(juego.estado== 'Ganaste' || juego.estado == 'perdiste'){
		if(teclado[82]){
			contadorHuevos= 1000;
			juego.estado='iniciando';
			juego.horda=1;
			limite=-2500;
			velocidadEnemigo= 20;
		}
	}

}

function dibujarPersonaje(){
	contexto.save();
	if(personaje.estado=='save'){
		contexto.drawImage( imgPavo,personaje.x,personaje.y,personaje.width,personaje.height);	
	}if (personaje.estado=='escudo'){
		contexto.drawImage( imgEscudo,personaje.x,personaje.y,personaje.width,personaje.height);
	}
	
	contexto.restore();
}

function agregarEventosTeclado(){
	agregarEvento(document,'keydown',function(e){
		//Ponemos en true la tecla presionada
		teclado[e.keyCode] = true;

	});
	agregarEvento(document,'keyup',function(e){
		//Ponemos en false la tecla que dejo de ser presionada
		teclado[e.keyCode] = false;
	});
	
	function agregarEvento(elemento,nombreEvento,funcion){
		if(elemento.addEventListener){ //Navegadores 
			elemento.addEventListener(nombreEvento,funcion,false);
		}
	}

}
function moverPersonaje(){


		if(teclado[37]){
			personaje.x -=velocidad;//Movimiento a la izquierda
				if(personaje.x <0) personaje.x =0;
		}
		if(teclado[39]){
			var limite = canvas.width - personaje.width;
			personaje.x +=velocidad;//Movimiento a la Derecha
				if(personaje.x > limite) personaje.x =limite;
		}
		if(teclado[38]){
			personaje.y -=velocidad;//Movimiento a la arriba
				if(personaje.y <0) personaje.y =0;
		}
		if(teclado[40]){
			personaje.y +=velocidad;//Movimiento a la abajo
				if(personaje.y >canvas.height-180) personaje.y =canvas.height-180;
		}

	

	
	if(teclado[32]){
		if(!teclado.fire){
			teclado.fire = true;
			personaje.estado= 'escudo';
			personaje.width = 290;
		}

	}else {
	personaje.estado ='save';
	personaje.width = 210;
	teclado.fire = false;	
	}
}

function colocarEscudo(){
	contexto.save();
	contexto.drawImage(escudo,personaje.x,personaje.y-120,40,70);
	contexto.restore();
}



function aleatorio(inferior,superior){
	var posibilidades = superior - inferior;
	var aleatorio = Math.random()*posibilidades;
	aleatorio = Math.floor(aleatorio);
	return parseInt(inferior)+aleatorio;
}
function HordaZorros(numero){
	if(numero == 1)return numerosZorros;
	if(numero == 2)return numerosZorros+(5);
	if(numero == 3)return numerosZorros+(10);
}

function Zorros(){
		var maximo = HordaZorros(juego.horda);
		for(var x =0; x<maximo; x++){
			enemigos.push({
				x:aleatorio(0,2700),
				y :aleatorio(limite,0),
				height: 289,
				width : 210,
				img : 'Extras/imagenes/zorro.png',
				estado:'vivo'

			});
				console.log("Enemigos");
		}
		juego.estado= 'jugando';
		DibujaTexto();
		

}
function dibujarZorros(){
	for(i in enemigos){
	
		var zorro = enemigos[i];
		contexto.save();
		contexto.restore();
		if(zorro.estado =='vivo'){
			contexto.drawImage(imgEnemigo,zorro.x,zorro.y, zorro.width,zorro.height);
		}
		if(zorro.estado == 'robo'){
				contexto.drawImage(imgRobo,zorro.x,zorro.y, zorro.width,zorro.height);
		}
		if(zorro.estado =='golpeado'){
			contexto.drawImage(imgGolpe,zorro.x,zorro.y, zorro.width,zorro.height);	
		}

		
	}
}

var zorrosGolpeados= 0;

function movimientoZorros(){
	for(var i in enemigos){
		var zorro = enemigos[i];
		if(zorro.estado==='vivo'){
			if(!(zorro.y > canvas.height+200)){
				zorro.y +=velocidadEnemigo;
			}else{
				zorro.estado="robo";
				limite = -10;
				zorro.img ="Extras/imagenes/conHuevo.png";
			}
		}
		if(zorro.estado=='robo'){
			zorro.y -=(velocidadEnemigo+10);		
		}if(zorro.estado=='golpeado'){
			zorro.y -=(velocidadEnemigo+15);		
		}

	}
	for(i in enemigos){
		var zorro = enemigos[i];
		if(zorro.estado==='robo') {
			zorro.img = "Extras/imagenes/zorro.png";
		}
	}

}
function perdiste(){
	juego.estado="perdiste";
	DibujaTexto();
	velocidad= 0;

}
function Collisiones(a,b){
	var hit = false;
	if(b.x + b.width >= a.x && b.x < a.x +a.width){
		if(b.y + b.height >= a.y && b.y <a.y + a.height){
			hit= true;
		}
	}
	if( b.x <= a.x && b.x + b.width >= a.x + a.width){
		if(b.y <= a.y && b.y + b.height >= a.y + a.height){
			hit= true;
		}
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width){
		if(a.y <= b,y && a.y + a.height >= b.y + b.height+10){
			hit= true;
		}
			
	}

	return hit;
}

function DetectorCollisiones(){
	if(personaje.estado=='escudo'){
		for(i in enemigos){
			var zorro = enemigos[i];
			if(!(zorro.estado=='golpeado')){//Condicional que me ayuda con un problema que no se
				if(Collisiones(personaje,zorro)){
				zorro.estado="golpeado";
				zorro.y -=15;
				zorrosGolpeados= zorrosGolpeados+1;
					if(zorrosGolpeados==HordaZorros(juego.horda)) limite = -10;					
					
				}	
			}
			
		}
	}


}
function hordasprogreso(){
	
	if(juego.horda <4){
		if(juego.estado=='iniciando'){
			Zorros();	
			
		}
		if(juego.estado==='jugando'){
		
			if(limite== -10){//NO borrar si no quieres tronar el browser ;)
				enemigos = enemigos.filter(function(zorro){
					if(zorro.y >-20){
						return zorro.y >-20;	
					}else{ //me ayudo a saber cuandos huevos me robaron
						if(enemigos.length >1){
							if(zorro.estado=='robo'){
								huevosTomados++;
								fuera++
								console.log(huevosTomados);
								if(huevosTomados >contadorHuevos){
									perdiste();
						
								}
							}else{
								golpeados++;
							}
						}//Fin de legth 
						else{//Se acabo toda la Horda
							console.log("huevos protegidos "+ (contadorHuevos -huevosTomados) + ".");
							console.log("Se cabo la horda "+ juego.horda + ".");
							
							if((contadorHuevos-huevosTomados) >0){
								
							if(juego.horda==3){
								console.log("Fin del juego ????");
								if(huevosTomados==10){
									juego.estado="perdiste";
									DibujaTexto();
								}else{
									juego.estado="Ganaste";
									DibujaTexto();
								}
									
								}else{
									
									var intervalo = window.setInterval(function(){
										console.log("Preparado para la siguiente Horda");
									},8000);
									setTimeout(function(){
										window.clearInterval(intervalo);
										juego.estado='iniciando';
										juego.horda= juego.horda+1;
										if(juego.horda == 2) limite= -2800;
										if(juego.horda == 3) {
											limite= -3800;
											velocidad= 30;
										}
										

									},10000);

								}

							}//Fin del if contadorHuevos
						}						
					}

				});

			}//Fin de el if Limite

			}

		}
	//	console.log(golpeados+ " y se escaparon "+ fuera);
	
}
	
Init();
agregarEventosTeclado();

function Visor(){

	dibujarFondo();
	moverPersonaje();
	hordasprogreso();
	dibujarPersonaje();
	dibujarZorros();
	movimientoZorros();
	DibujaTexto();
	DetectorCollisiones();


}