let productosBase = [

{
codigo:"TEC001",
nombre:"Teclado Mecánico RGB",
descripcion:"Teclado mecánico con iluminación RGB.",
precio:39990,
stock:15,
stockCritico:5,
categoria:"Teclados"
},

{
codigo:"MOU001",
nombre:"Mouse Gamer Pro",
descripcion:"Mouse gamer ergonómico.",
precio:24990,
stock:8,
stockCritico:3,
categoria:"Mouse"
},

{
codigo:"AUD001",
nombre:"Headset Gaming 7.1",
descripcion:"Audífonos gamer.",
precio:49990,
stock:2,
stockCritico:3,
categoria:"Audio"
},

{
codigo:"ACC001",
nombre:"Mousepad XL",
descripcion:"Mousepad grande.",
precio:14990,
stock:20,
stockCritico:5,
categoria:"Accesorios"
},

{
codigo:"ACC002",
nombre:"Soporte para Audífonos",
descripcion:"Soporte de escritorio.",
precio:12990,
stock:12,
stockCritico:4,
categoria:"Accesorios"
},

{
codigo:"CON001",
nombre:"Control Gamer Inalámbrico",
descripcion:"Control inalámbrico.",
precio:34990,
stock:9,
stockCritico:3,
categoria:"Controles"
}

];



let productosAdmin = JSON.parse(localStorage.getItem("productosAdmin"));


if(productosAdmin == null){

productosAdmin = productosBase;

localStorage.setItem(
"productosAdmin",
JSON.stringify(productosAdmin)
);

}



function guardarProductos(){

localStorage.setItem(
"productosAdmin",
JSON.stringify(productosAdmin)
);

}




function cargarTablaProductos(){


let tabla=document.getElementById("tablaProductos");


if(!tabla){
return;
}


tabla.innerHTML="";


productosAdmin.forEach(producto=>{


let fila=document.createElement("tr");


if(producto.stock <= producto.stockCritico){

fila.className="stock-critico";

}


fila.innerHTML=`

<td>${producto.codigo}</td>

<td>${producto.nombre}</td>

<td>${producto.categoria}</td>

<td>$${producto.precio.toLocaleString("es-CL")}</td>

<td>${producto.stock}</td>


<td>

<a class="btn-editar"
href="producto-form.html?codigo=${producto.codigo}">
Editar
</a>


<button class="btn-eliminar-admin"
onclick="confirmarEliminarProducto('${producto.codigo}')">
Eliminar
</button>

</td>

`;


tabla.appendChild(fila);


});


}




function cargarProductoParaEditar(){


let formulario=document.getElementById("formProducto");


if(!formulario){

return;

}



let parametros=new URLSearchParams(window.location.search);

let codigo=parametros.get("codigo");


if(!codigo){

return;

}



let producto=productosAdmin.find(p=>p.codigo==codigo);



if(producto){


document.getElementById("codigoProducto").value=producto.codigo;
document.getElementById("nombreProducto").value=producto.nombre;
document.getElementById("descripcionProducto").value=producto.descripcion;
document.getElementById("precioProducto").value=producto.precio;
document.getElementById("stockProducto").value=producto.stock;
document.getElementById("stockCritico").value=producto.stockCritico;
document.getElementById("categoriaProducto").value=producto.categoria;


document.getElementById("tituloFormularioProducto").innerHTML="Editar producto";

document.getElementById("btnGuardarProducto").innerHTML="Guardar cambios";


}



}





let formulario=document.getElementById("formProducto");


if(formulario){


formulario.addEventListener("submit",function(e){


e.preventDefault();



let codigo=document.getElementById("codigoProducto").value;

let producto=productosAdmin.find(p=>p.codigo==codigo);



if(producto){


producto.nombre=document.getElementById("nombreProducto").value;

producto.descripcion=document.getElementById("descripcionProducto").value;

producto.precio=Number(document.getElementById("precioProducto").value);

producto.stock=Number(document.getElementById("stockProducto").value);

producto.stockCritico=Number(document.getElementById("stockCritico").value);

producto.categoria=document.getElementById("categoriaProducto").value;


}else{


productosAdmin.push({

codigo:codigo,

nombre:document.getElementById("nombreProducto").value,

descripcion:document.getElementById("descripcionProducto").value,

precio:Number(document.getElementById("precioProducto").value),

stock:Number(document.getElementById("stockProducto").value),

stockCritico:Number(document.getElementById("stockCritico").value),

categoria:document.getElementById("categoriaProducto").value


});


}



guardarProductos();


alert("Producto guardado correctamente");


window.location.href="productos.html";


});


}




function confirmarEliminarProducto(codigo){


if(confirm("¿Eliminar producto?")){


productosAdmin =
productosAdmin.filter(p=>p.codigo!=codigo);


guardarProductos();


cargarTablaProductos();


}


}



cargarProductoParaEditar();

cargarTablaProductos();

function cargarDashboard(){

let totalProductos = document.getElementById("totalProductos");

if(totalProductos){

totalProductos.innerHTML = productosAdmin.length;

}



let stockCritico = document.getElementById("stockCritico");


if(stockCritico){

let cantidad = productosAdmin.filter(producto => 
producto.stock <= producto.stockCritico
).length;


stockCritico.innerHTML = cantidad;

}



let totalUsuarios = document.getElementById("totalUsuarios");


if(totalUsuarios){

totalUsuarios.innerHTML = 3;

}

}


cargarDashboard();