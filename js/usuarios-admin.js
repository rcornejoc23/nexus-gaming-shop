/*
    ==============================================
    USUARIOS ADMINISTRATIVOS - NEXUS GAMING
    ==============================================

    Este archivo contiene:

    1. Arreglo de regiones y comunas.
    2. Carga de regiones en el <select>.
    3. Cambio automático de comunas.
    4. Validación del RUN chileno.
    5. Validación del formulario de usuario.
    6. Confirmación para eliminar usuarios.
    7. Administración dinámica de usuarios.

*/


/*
    ==============================================
    1. ARREGLO DE REGIONES
    ==============================================

    Cada elemento tiene:

    - nombre de la región
    - arreglo de comunas

    Así relacionamos una región con sus comunas.
*/

let regiones = [

    {
        nombre: "Región Metropolitana",

        comunas: [
            "Santiago",
            "Puente Alto",
            "La Florida",
            "Maipú",
            "San Miguel",
            "Providencia"
        ]
    },

    {
        nombre: "Región de Valparaíso",

        comunas: [
            "Valparaíso",
            "Viña del Mar",
            "Quilpué",
            "Villa Alemana"
        ]
    },

    {
        nombre: "Región del Biobío",

        comunas: [
            "Concepción",
            "Talcahuano",
            "Chiguayante",
            "San Pedro de la Paz"
        ]
    }

];



/*
    ==============================================
    2. DATOS DE USUARIOS
    ==============================================

    En esta primera evaluación no existe
    base de datos.

    Usamos localStorage para simular
    persistencia de información.

*/


let usuariosBase = [

    {
        run: "190110222",
        nombre: "Usuario Administrador",
        correo: "admin@duoc.cl",
        tipo: "Administrador",
        region: "Metropolitana"
    },


    {
        run: "201234565",
        nombre: "Cliente Ejemplo",
        correo: "cliente@gmail.com",
        tipo: "Cliente",
        region: "Metropolitana"
    },


    {
        run: "183456784",
        nombre: "Vendedor Ejemplo",
        correo: "vendedor@gmail.com",
        tipo: "Vendedor",
        region: "Valparaíso"
    }

];



/*
    Recuperamos usuarios guardados.

    Si no existen, cargamos los usuarios
    iniciales.
*/


let usuariosAdmin =
JSON.parse(localStorage.getItem("usuariosAdmin"));



if(usuariosAdmin == null){


    usuariosAdmin = usuariosBase;


    localStorage.setItem(
        "usuariosAdmin",
        JSON.stringify(usuariosAdmin)
    );


}



/*
    Función encargada de guardar cambios.
*/


function guardarUsuarios(){


    localStorage.setItem(
        "usuariosAdmin",
        JSON.stringify(usuariosAdmin)
    );


}



/*
    ==============================================
    3. ELEMENTOS DEL HTML
    ==============================================

    Puede ocurrir que este archivo se cargue
    desde usuarios.html o usuarios-form.html.

    Por eso verificamos si existen.
*/


let regionAdmin =
document.getElementById("regionAdmin");


let comunaAdmin =
document.getElementById("comunaAdmin");


let formUsuarioAdmin =
document.getElementById("formUsuarioAdmin");



/*
    ==============================================
    4. CARGAR REGIONES
    ==============================================

    Solo ejecutamos si existe el select.
*/


if(regionAdmin != null){


    for(let i = 0; i < regiones.length; i++){


        regionAdmin.innerHTML += `

        <option value="${i}">
            ${regiones[i].nombre}
        </option>

        `;


    }


}



/*
    ==============================================
    5. CAMBIO DE REGIÓN Y COMUNAS
    ==============================================
*/


if(regionAdmin != null){


regionAdmin.addEventListener(
"change",
function(){


    comunaAdmin.innerHTML = `

    <option value="">
        Seleccione una comuna
    </option>

    `;



    if(regionAdmin.value == ""){

        return;

    }



    let posicionRegion =
    parseInt(regionAdmin.value);



    let comunas =
    regiones[posicionRegion].comunas;



    for(let i = 0; i < comunas.length; i++){


        comunaAdmin.innerHTML += `

        <option value="${comunas[i]}">
            ${comunas[i]}
        </option>

        `;


    }


});


}
/*
    ==============================================
    6. VALIDACIÓN DEL RUN
    ==============================================
*/


function validarRun(run){


    run = run.toUpperCase();



    if(run.length < 7 || run.length > 9){

        return false;

    }



    let cuerpo =
    run.substring(0, run.length - 1);



    let digitoVerificador =
    run.substring(run.length - 1);



    if(isNaN(cuerpo)){

        return false;

    }



    let suma = 0;

    let multiplicador = 2;



    for(let i = cuerpo.length - 1; i >= 0; i--){


        suma =
        suma + parseInt(cuerpo[i]) * multiplicador;



        multiplicador++;



        if(multiplicador == 8){

            multiplicador = 2;

        }


    }



    let resto = suma % 11;


    let resultado = 11 - resto;



    let digitoCalculado;



    if(resultado == 11){

        digitoCalculado = "0";


    }else if(resultado == 10){


        digitoCalculado = "K";


    }else{


        digitoCalculado = resultado.toString();


    }



    return digitoCalculado == digitoVerificador;



}




/*
    ==============================================
    7. GUARDAR / EDITAR USUARIO
    ==============================================
*/


if(formUsuarioAdmin != null){


formUsuarioAdmin.addEventListener(
"submit",
function(evento){


evento.preventDefault();



let run =
document.getElementById("runAdmin").value;



let nombre =
document.getElementById("nombreAdmin").value;



let apellidos =
document.getElementById("apellidosAdmin").value;



let correo =
document.getElementById("correoAdmin").value;



let tipo =
document.getElementById("tipoUsuario").value;



let region =
regionAdmin.options[regionAdmin.selectedIndex].text;



let usuarioExistente =
usuariosAdmin.find(
usuario => usuario.run == run
);



if(usuarioExistente){


usuarioExistente.nombre =
nombre + " " + apellidos;


usuarioExistente.correo =
correo;


usuarioExistente.tipo =
tipo;


usuarioExistente.region =
region;



}else{


usuariosAdmin.push({


run:run,


nombre:nombre + " " + apellidos,


correo:correo,


tipo:tipo,


region:region



});


}




guardarUsuarios();



alert(
"Usuario guardado correctamente."
);



window.location.href="usuarios.html";



});


}




/*
    ==============================================
    8. CARGAR TABLA DE USUARIOS
    ==============================================
*/


function cargarTablaUsuarios(){


let tabla =
document.getElementById("tablaUsuarios");



if(tabla == null){

    return;

}



tabla.innerHTML = "";



usuariosAdmin.forEach(usuario => {



let fila =
document.createElement("tr");



fila.innerHTML = `


<td>
${usuario.run}
</td>


<td>
${usuario.nombre}
</td>


<td>
${usuario.correo}
</td>


<td>
${usuario.tipo}
</td>


<td>
${usuario.region}
</td>


<td>


<a class="btn-editar"
href="usuarios-form.html?run=${usuario.run}">
Editar
</a>



<button class="btn-eliminar-admin"
onclick="confirmarEliminarUsuario('${usuario.run}')">
Eliminar
</button>



</td>



`;



tabla.appendChild(fila);



});


}




/*
    ==============================================
    9. ELIMINAR USUARIO
    ==============================================
*/


function confirmarEliminarUsuario(run){



let respuesta =
confirm(
"¿Está seguro de eliminar este usuario?"
);



if(respuesta == true){



usuariosAdmin =
usuariosAdmin.filter(
usuario => usuario.run != run
);



guardarUsuarios();



cargarTablaUsuarios();



alert(
"Usuario eliminado correctamente."
);



}



}




/*
    ==============================================
    10. MODO EDICIÓN
    ==============================================

    Los botones Editar envían el RUN por la URL.

    Ejemplo:

    usuarios-form.html?run=201234565

    Busca el usuario en localStorage
    y carga sus datos en el formulario.
*/

function cargarUsuarioParaEditar(){


    if(formUsuarioAdmin == null){

        return;

    }



    let parametros =
    new URLSearchParams(window.location.search);



    let runEditar =
    parametros.get("run");



    if(runEditar == null){

        return;

    }



    let usuario =
    usuariosAdmin.find(
        usuario => usuario.run == runEditar
    );



    if(usuario){



        let partes =
        usuario.nombre.split(" ");



        document.getElementById("runAdmin").value =
        usuario.run;



        document.getElementById("nombreAdmin").value =
        partes[0];



        document.getElementById("apellidosAdmin").value =
        partes.slice(1).join(" ");



        document.getElementById("correoAdmin").value =
        usuario.correo;



        document.getElementById("tipoUsuario").value =
        usuario.tipo;



        /*
            Cargar región
        */

        for(let i = 0; i < regiones.length; i++){


            if(
                usuario.region.includes(
                    regiones[i].nombre
                    .replace("Región ","")
                    .replace("de ","")
                )
            ){

                regionAdmin.value = i;

                regionAdmin.dispatchEvent(
                    new Event("change")
                );


                break;

            }

        }



        /*
            Cambiar título del formulario
        */

        let titulo =
        document.querySelector(
            ".admin-header h1"
        );


        if(titulo != null){

            titulo.innerHTML =
            "Editar usuario";

        }



        /*
            Cambiar texto del botón
        */

        let boton =
        formUsuarioAdmin.querySelector(
            'button[type="submit"]'
        );


        if(boton != null){

            boton.innerHTML =
            "Guardar cambios";

        }



    }


}




/*
    ==============================================
    11. EJECUCIÓN INICIAL
    ==============================================
*/


cargarTablaUsuarios();


cargarUsuarioParaEditar();