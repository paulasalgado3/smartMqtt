var mqtt = require('mqtt');  
var express = require("express");
var bodyParser = require("body-parser");

var client  = mqtt.connect("mqtt://localhost",{
  protocolId: 'MQIsdp',
  protocolVersion: 3,
  username: "usuario1",
  password: "password3"
});

var app = express();
app.use(bodyParser.json());
app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});

//Dispositivos
var dispositivos = new Array();
var dispositivo1 = new Object();
    dispositivo1.id = "39e0ie";
    dispositivo1.posicion = "1";
    dispositivo1.tipo = "outlet";
    dispositivo1.estado = "false";
    dispositivo1.ubicacion = "comedor";
var dispositivo2 = new Object();
    dispositivo2.id = "39e0ie";
    dispositivo2.posicion = "2";
    dispositivo2.tipo = "outlet";
    dispositivo2.estado = "true";
    dispositivo2.ubicacion = "pieza1";
var dispositivo3 = new Object();
    dispositivo3.id = "mddid9e";
    dispositivo3.posicion = "1";
    dispositivo3.tipo = "outlet";
    dispositivo3.estado = "true";
    dispositivo3.ubicacion = "jardin";
var dispositivo4 = new Object();
    dispositivo4.id = "md4id9e";
    dispositivo4.posicion = "1";
    dispositivo4.tipo = "outlet";
    dispositivo4.estado = "true";
    dispositivo4.ubicacion = "jardin2";
    dispositivos.push(dispositivo2);
    dispositivos.push(dispositivo1);
    dispositivos.push(dispositivo4);
    dispositivos.push(dispositivo3);

//Metodos
function existe_dispositivo(id,posicion){
	var existe = false;
	for (i = 0; i < dispositivos.length; i++) {
            if(dispositivos[i].id==id && dispositivos[i].posicion == posicion){
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
            if(dispositivos[i].id==dispositivo.id && dispositivos[i].posicion == dispositivo.posicion){
                        dispositivos.splice(i,1);
            }
        }
}
function modificar_dispositivo(dispositivo){
	for (i = 0; i < dispositivos.length; i++){
		if(dispositivos[i].id==dispositivo.id && dispositivos[i].posicion == dispositivo.posicion){
			dispositivos[i]=dispositivo;
		}
	}

}
/*
home/feature/outlet/new
home/feature/outlet/delete
*/

client.subscribe ('home/feature/outlet/new', {qos:1});
client.subscribe ('home/feature/outlet/delete', {qos:1});
client.subscribe ('home/feature/outlet/change_state', {qos:1});
client.on('message', function(topic,message){
	if(topic.toString() == "home/feature/outlet/new"){
		var dispositivo = JSON.parse(message.toString()); 
		if(!existe_dispositivo(dispositivo.id, dispositivo.posicion)){
			crear_dispositivo(dispositivo);
			console.log("Nuevo Dispositivo Id: " + dispositivo.id + ":"+ dispositivo.posicion );  
		}	
	}else if (topic.toString() == "home/feature/outlet/delete"){
		var dispositivo = JSON.parse(message.toString());
		if(existe_dispositivo(dispositivo.id)){
			borrar_dispositivo(dispositivo);
			console.log("Dispositivo Borrado Id: " + dispositivo.id+":"+dispositivo.posicion);
		}
	}else if(topic.toString() == "home/feature/outlet/change_state"){
		var dispositivo = JSON.parse(message.toString());
		modificar_dispositivo(dispositivo);
		console.log("Dispositivo Modificado Id: " + dispositivo.id+":"+dispositivo.posicion);
	}
});


app.get(/^(.+)$/, function(req, res){ 
    switch(req.params[0]) {
	case '/dispositivos':
		var jdispositivos = JSON.stringify(dispositivos);
		res.send(jdispositivos);
		res.end();
	    break;

    	default: res.sendFile( __dirname + req.params[0]); 
    }
 });
