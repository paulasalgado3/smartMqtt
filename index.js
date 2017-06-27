var mqtt = require('mqtt');  

var client  = mqtt.connect("mqtt://localhost",{
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  username: "usuario1",
  password: "password3"
});



//Dispositivos
var dispositivos = new Array();
var dispositivo1 = new Object();
    dispositivo1.id = "39e0ie";
    dispositivo1.tipo = "outlet";
    dispositivo1.estado = 0;
    dispositivo1.ubicacion = "comedor";
    dispositivo1.editar = "";
var dispositivo2 = new Object();
    dispositivo2.id = "4rfj3l4";
    dispositivo2.tipo = "outlet";
    dispositivo2.estado = 1;
    dispositivo2.ubicacion = "pieza1";
    dispositivo2.editar="";
    dispositivos.push(dispositivo2);
    dispositivos.push(dispositivo1);

//Metodos
function existe_dispositivo(id){
	var existe = false;
	for (i = 0; i < dispositivos.length; i++) {
            if(dispositivos[i].id==id){
			existe = true;
            }
        }
	return existe;
}
function crear_dispositivo(dispositivo){
	dispositivos.push(dispositivo);
}
function borrar_dispositivo(dispositivo){
	for (i = 0; i < dispositivos.length; i++) {
            if(dispositivos[i].id==dispositivo.id){
                        dispositivos.splice(i,1);
            }
        }
}
/*
home/feature/outlet/new
home/feature/outlet/delete
*/

client.subscribe ('home/feature/outlet/new', {qos:1});

client.on('message', function(topic,message){
	if(topic.toString() == "home/feature/outlet/new"){
		var dispositivoNuevo = JSON.parse(message.toString()); 
		if(!existe_dispositivo(dispositivoNuevo.id)){
			crear_dispositivo(dispositivoNuevo);
			console.log("Nuevo Dispositivo Id: " + dispositivoNuevo.id);  
		}	
	}else if (topic.toString() == "home/feature/outlet/delete"){
		
	
	}
});



