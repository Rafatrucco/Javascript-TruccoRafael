AOS.init ();

const contenedorProductos = document.getElementById('contenedor-productos'); 

const contenedorCarritoCompras = document.querySelector("#items"); 

const contenedorFooterCarrito = document.querySelector("#footer"); 

class producto{
    constructor (nombre,precio, fuente){
    this.nombre = nombre;
    this.precio= parseFloat(precio);
    this.fuente = fuente;
    }
}

class itemsDelCarrito {
    constructor(producto, cantidad) {
        this.producto = producto;
        this.cantidad = cantidad;
    }
}

const productos = []; 

let miCarrito = [];

miCarrito = JSON.parse(localStorage.getItem('miCarrito')) || []  // micarrito podemos retomarlo o hacer uno nuevo


//FUNCIONES PRINCIPALES
dibujarCatalogoJSONLocal()
dibujarCarrito()

// PRODUCTOS 

function dibujarCatalogoJSONLocal(){
    const URLJSON="./datos.json";
    fetch(URLJSON)
    .then(resp => resp.json())
    .then(data => {
        contenedorProductos.innerHTML = "";

        data.productos.forEach(
            (producto) => {
                let carta = crearCard(producto);
                contenedorProductos.append(carta);
            }
        );





    })
}

// ------------------------------------------------------- CARDS ---------------------------------------------------

function crearCard(producto) {
    //Botón
    let botonAgregar = document.createElement("button");
    botonAgregar.className = "btn btn-dark";
    botonAgregar.innerText = "Agregar";

    //Card body
    let cuerpoCarta = document.createElement("div");
    cuerpoCarta.className = "card-body";
    cuerpoCarta.innerHTML = `
        <h5>${producto.nombre}</h5>
        <p>$ ${producto.precio} USD</p>
    `;
    cuerpoCarta.append(botonAgregar);

    //Imagen
    let imagen = document.createElement("img");
    imagen.src = producto.fuente;
    imagen.className = "card-img-top";
    imagen.style= "height: 380px"
    imagen.alt = producto.nombre;

    //Card
    let carta = document.createElement("div");
    carta.className = "card m-2 p-2";
    carta.style = "width: 20rem ";

    
    //INYECTO AL DOM    
    carta.append(imagen); // cargamos primero la imagen
    carta.append(cuerpoCarta); // luego el cuerpo con el nombre,precio,descripcion
    //FUNCION ON.CLICK
    botonAgregar.onclick = () => {
        //alert("Hiciste click en el producto" + producto.nombre);

        let itemaComprar= new itemsDelCarrito(producto, 1);
        miCarrito.push(itemaComprar);
        localStorage.setItem("miCarrito",JSON.stringify(miCarrito));

        dibujarCarrito();

        swal({
            title: "¡Producto agregado!",
            text: `${producto.nombre} agregado al carrito de compra.`,
            icon: "success",
            buttons: {
                cerrar: {
                    text: "Continuar comprando",
                    value: false
                },
                carrito: {
                    text: "Ir a carrito",
                    value: true
                }
            }
        }).then((irACarrito) => {

            if(irACarrito) {
               
                const myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {keyboard: true});
                const modalToggle = document.getElementById('toggleMyModal');
                myModal.show(modalToggle);

            }
        });

    } 
    
    return carta;

}

// ----------------------------------------------- CARRITO ---------------------------------------------------------------

function dibujarCarrito() {

    let precioFinal = 0;

    contenedorCarritoCompras.innerHTML = '';

    miCarrito.forEach(
        (elemento) => {
            let renglonesCarrito= document.createElement("tr");
          
            
            renglonesCarrito.innerHTML = `
                <td>${elemento.producto.nombre}</td>
                <td><input id="cantidad-producto-${elemento.producto.nombre}" type="number" value="${elemento.cantidad}" min="1" max="50" step="1" style="width: 50px;"/></td>
                <td>$ ${elemento.producto.precio}</td>
                <td> <button class='btn btn-light' onclick='eliminar("${elemento.producto.nombre}")'>❌</button>
                <td>$ ${elemento.producto.precio*elemento.cantidad}</td>
            `;

            contenedorCarritoCompras.append(renglonesCarrito);

            
            //sintaxis optimizada//
            precioFinal+=elemento.cantidad*elemento.producto.precio;

            //agregamos evento a carrito
            let cantidadProductos = document.getElementById(`cantidad-producto-${elemento.producto.nombre}`);
            
            cantidadProductos.addEventListener("change", (e) => {
                let nuevaCantidad = e.target.value;
                elemento.cantidad = nuevaCantidad;
                dibujarCarrito();
            });

        }
    );
    
    //sintaxis optimizada//
    miCarrito.length === 0 ? contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>`:
        contenedorFooterCarrito.innerHTML = `<th scope="row" colspan="5">Total de la compra: $${precioFinal}</th>`;
    

}  

let botonVaciarCompra = document.getElementById("Finish");
let ultCompra = [] 
botonVaciarCompra.addEventListener("click", (i) => {
    i.preventDefault();
    if (miCarrito.length !== 0){
        swal({
       position: 'center',
       icon: "success",
       text: 'Tu compra fue realizada con exito',
       title: 'Gracias por tu compra',
       button: false,
       })
       
       
       const URLPOST = "https://jsonplaceholder.typicode.com/posts";
       const nuevaOrden = miCarrito
       fetch(URLPOST, {
           method: 'POST',
           body: JSON.stringify(nuevaOrden),
           headers: {
               'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            //lo que retorna
            // console.log("Detalles de su orden: ");
            // console.log(datos);
            localStorage.setItem("ultCompra",JSON.stringify(miCarrito));   
                     
            miCarrito = [];
            items.innerHTML= "";
            dibujarCarrito();
         localStorage.removeItem("miCarrito", JSON.stringify(miCarrito));
        })
        
}else{
    swal({
        position: 'center',
        icon: 'error',
        title: 'No hay nada en tu carrito',
        text: 'Elige un producto e intentalo de nuevo',
        button: false,
        timer: 3000
      })
 }}
)

//ELIMINAR PRODUCTO DEL CARRITO 
// const getLocalCarrito = localStorage.getItem("miCarrito");
// const validateCarrito = JSON.parse(getLocalCarrito); 

function eliminar(nombre) {

    let item = miCarrito.find(el => el.producto.nombre === nombre);
console.log(item)

    console.table(miCarrito);
    let indice= miCarrito.indexOf(item);
    console.log(nombre);

    console.log(indice);

    miCarrito.splice(indice, 1);//eliminando del carro

    
    let fila = document.getElementById(`fila${nombre}`);
    
    localStorage.setItem("miCarrito", JSON.stringify(miCarrito));
    swal({
        text:"Producto eliminado del carro!",
        position: 'center',
        icon: "success",})
    dibujarCarrito();
}

/// DETALLE COMPRA 
const detalleUCompra = document.getElementById("detalleUCompra");

detalleUCompra.addEventListener("click",(i) => {
  i.preventDefault()
    
    let precioFinal = 0;
    let ultCompraSS = localStorage.getItem("ultCompra")
    const uc = JSON.parse(ultCompraSS)

    if (uc !== null){
        
    const myModal = new bootstrap.Modal(document.getElementById('exampleModalUC'), {keyboard: true});
    const modalToggle = document.getElementById('toggleMyModal');
    myModal.show(modalToggle);    
    const contenedorUc = document.querySelector("#itemsUc"); 
    const contenedorFUc = document.querySelector("#footerUc")
    contenedorUc.innerHTML = '';
    uc.forEach(
    (elemento) => {

        let ruc= document.createElement("tr");
            
                
        ruc.innerHTML = `
            <td>${elemento.producto.nombre}</td>
            <td> ${elemento.cantidad}</td>
            <td>$ ${elemento.producto.precio}</td>
            <td>$ ${elemento.producto.precio*elemento.cantidad}</td>
        `;

        contenedorUc.append(ruc); 
        
        //sintaxis optimizada//
        precioFinal+=elemento.producto.precio*elemento.cantidad;

    });
    //sintaxis optimizada//
    uc.length === 0 ? contenedorFUc.innerHTML = `<th scope="row" colspan="5">No existe compra anterior - comience a comprar!</th>`:
    contenedorFUc.innerHTML = `<th scope="row" colspan="5">Total de la compra: $${precioFinal}</th>`;
    

    }

    else{
        swal({
            position: 'center',
            icon: "warning",
            title: 'No existe compra anterior',
            text: 'Comience a comprar!',
            button: true,
            })
        
    }

})

// ------------------------------------------------------------------------------------------- VALIDACIONES -----------------

// --------------------------------------------------- REGISTRO --------------------------------------------------------

const frmRegistro = document.getElementById("frm-register");
const fullName = document.getElementById("fullName");
const userName = document.getElementById("userName");
const  email=document.getElementById ("correo")
const  telefono=document.getElementById ("telefono")
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

const userRegistered = [];

const getLocal = localStorage.getItem("user");
const validateUser = JSON.parse(getLocal); 


frmRegistro.addEventListener("submit", RegisterUser);


// Registrar Usuario
function RegisterUser(event) {


  const getLocal = localStorage.getItem("user");
  const validateUser = JSON.parse(getLocal); 

  // Prevenir los eventos precargados  
  event.preventDefault();

  // Crear usuario objeto
  const user = {
    nameFull: fullName.value,
    user: userName.value,
    pass: password.value,
    confPassword: confirmPassword.value
  };
  // Validar que los campos no estén vacíos
  if (
    fullName.value === "" ||
    userName.value === "" ||
    email.value === "" ||
    telefono.value === "" ||
    password.value === "" ||
    confirmPassword.value === ""
    ) {
      swal({
        position: 'center',
        icon: "warning",
        title: 'Por favor llene todos los campos',
        button: true,
        })
    }
    // Validar que las contraseñas coincidan
  else if (password.value !== confirmPassword.value) {
    swal({
      position: 'center',
      icon: "error",
      title: 'Las contraseñas no coinciden',
      button: true,
      })
  }

  else if (validateUser !== null) {
    if(validateUser.find(user => user.user === userName.value)){
        swal({
            position: 'center',
            icon: "warning",
            title: 'El usuario ya existe',
            button: true,
            })
    }
  }

  else {
    // Agregar usuario
    userRegistered.push(user);
    console.table(user)
    // guardar array en localStorage
    localStorage.setItem("userRegistered",JSON.stringify(userRegistered));              
    swal({
      position: 'center',
      icon: "success",
      text: 'Bienvenido al sistema.',
      title: 'Usuario registrado con éxito!',
      button: false,
      })

    // usted esta logueado como userName.value
    
    
   


    // Limpiar campos
    fullName.value = "";
    userName.value = "";
    email.value = ""; 
    telefono.value = ""; 
    password.value = "";
    confirmPassword.value = "";  
    
  }
}


// --------------------------------------------------------------- LOGIN -----------------------------------------------
//Variables y Constantes Globales

const userNombre = document.getElementById('userNombre');
const contraseña = document.getElementById('contraseña');
const login = document.getElementById('ingreso');

const cerrarSesion = document.getElementById('cerrarSesion');

const frmLogin = document.getElementById('frm-Login');

// const busqueda = localStorage.getItem("userRegistered"); // borrarlo 
// const validarUsuario = JSON.parse(busqueda); 

//Loggear Usuario
frmLogin.addEventListener('submit', LoginUser);
const eliminarUsuarioBoton = document.getElementById("eliminarUsuario");
  eliminarUsuarioBoton.style.visibility = "hidden";
  cerrarSesion.style.visibility ="hidden";
  const bienvenido = document.getElementById("bienvenidoID")
  const ingresar = document.getElementById("ingresoUser")

function LoginUser(event) {

  const getLocal = localStorage.getItem("userRegistered");
  const validateUser = JSON.parse(getLocal); 

  const eliminarUsuarioBoton = document.getElementById("eliminarUsuario");
  
  
  // Prevenir los eventos precargados
  event.preventDefault();

  // Validar que los campos no estén vacíos
  if (userNombre.value === "" || contraseña.value === "") {
    swal({
      position: 'center',
      icon: "warning",
      title: 'Por favor llene todos los campos',
      button: true,
      })
  }
  // Validar que el usuario exista
  else if (!validateUser.find(user => user.user === userNombre.value)) {
    swal({
      position: 'center',
      icon: "warning",
      title: 'El usuario no existe',
      button: true,
      })
  }
  // Validar que la contraseña coincida
  else if (
    validateUser.find(user => user.user === userNombre.value).pass !== contraseña.value) {
      swal({
        position: 'center',
        icon: "error",
        title: 'La contraseña no coincide',
        button: true,
        })
    }
  else {
    swal({
      position: 'center',
      icon: "success",
      text: 'Bienvenido al simulador de Carrito',
      title: 'Usuario logueado con éxito',
      button: false,
      })

      eliminarUsuarioBoton.style.visibility = "";
      login.style.visibility ="hidden";
      cerrarSesion.style.visibility ="";
      sessionStorage.setItem("usuarioLogueado",userNombre.value)

      bienvenido.innerHTML ="BIENVENIDO "+ (userNombre.value).toUpperCase();
      ingresar.innerHTML="LOGUEADO COMO: "+(userNombre.value).toUpperCase();

      // un emoji o un cambio de algo en algun lado // listo
    
  }    
  
  userNombre.value = "";
  contraseña.value = "";
}
    
cerrarSesion.addEventListener("click", (i) => {
    i.preventDefault();
    if (sessionStorage.getItem("usuarioLogueado") !== null){
        swal({
       position: 'center',
       icon: "success",
       text: 'Se ha cerrado sesion.',
       title: 'Sesion finalizada!',
       button: false,
       })
       
       eliminarUsuarioBoton.style.visibility = "hidden";
       ingresar.innerHTML="Ingresar";
       cerrarSesion.style.visibility="hidden";
       login.style.visibility ="";
       bienvenido.innerHTML ="BIENVENIDO";
       sessionStorage.removeItem("usuarioLogueado")


       
        
}else{
    swal({
        position: 'center',
        icon: 'error',
        title: 'No esta logueado',
        text: 'Inicie sesion e intentalo de nuevo',
        button: false,
        timer: 3000
      })
 }}
)

// ELIMINAR USUARIO

eliminarUsuarioBoton.addEventListener("click",(i) => {
  i.preventDefault();
  const getLocal = localStorage.getItem("userRegistered");
  const validateUser = JSON.parse(getLocal); 
  const user = sessionStorage.getItem("usuarioLogueado")
  swal({
    title: "Esta seguro?",
    text: `No podrá revertir su acción`,
    icon: "warning",
    buttons: {
        cerrar: {
            text: "Cancelar",
            value: false
        },
        carrito: {
            text: "Eliminar de todas formas",
            value: true
        }
    }
}).then((eliminarUsuario) => {

    if(eliminarUsuario) {
       
     let usEliminar = validateUser.find(us => us.user === user)
      let indice = validateUser.indexOf(usEliminar)
    
      validateUser.splice(indice,1);
      localStorage.setItem("userRegistered",JSON.stringify(validateUser))


      eliminarUsuarioBoton.style.visibility = "hidden";
      login.style.visibility ="";
      bienvenido.innerHTML ="BIENVENIDO";
     ingresar.innerHTML="INGRESAR"

      swal({
        position: 'center',
        icon: "success",
        text: user.toUpperCase()+' Eliminado del sistema.',
        title: 'Usuario Eliminado!',
        button: false,
        })

        sessionStorage.removeItem("usuarioLogueado")
    }

  

})
})


