let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
// ✅ FUNCION PARA CONVERTIR IMAGEN A BASE64
function convertirABase64(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}


function guardarDatos() {
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("ventas", JSON.stringify(ventas));
  actualizarSelect();
  mostrarInventario();
}

function registrarProducto() {
  const nombre = document.getElementById("nombre").value;
  const costo = parseFloat(document.getElementById("costo").value);
  const precio = parseFloat(document.getElementById("precio").value);
  const stock = parseInt(document.getElementById("stock").value);
  const fotoInput = document.getElementById("foto");
  const foto = fotoInput.files[0];

  if (!nombre || isNaN(costo) || isNaN(precio) || isNaN(stock) || !foto) {
    alert("Faltan datos válidos");
    return;
  }

  convertirABase64(foto, (fotoBase64) => {
    productos.push({ nombre, costo, precio, stock, foto: fotoBase64 });
    guardarDatos();
    alert("Producto registrado");
    document.getElementById("nombre").value = "";
    document.getElementById("costo").value = "";
    document.getElementById("precio").value = "";
    document.getElementById("stock").value = "";
    document.getElementById("foto").value = "";
  });
}

function registrarVenta() {
  const index = parseInt(document.getElementById("producto-select").value);
  const cantidad = parseInt(document.getElementById("cantidad-vendida").value);

  if (isNaN(index) || isNaN(cantidad)) return alert("Datos incorrectos");
  if (productos[index].stock < cantidad) return alert("No hay suficiente stock");

  productos[index].stock -= cantidad;
  const producto = productos[index];
  const total = producto.precio * cantidad;
  const ganancia = (producto.precio - producto.costo) * cantidad;
  const fecha = new Date().toISOString().split("T")[0];

  ventas.push({ nombre: producto.nombre, cantidad, total, ganancia, fecha });
  guardarDatos();
  alert("Venta registrada");
  document.getElementById("cantidad-vendida").value = "";
}

function mostrarInventario() {
  const lista = document.getElementById("lista-inventario");
  if (!lista) return;
  lista.innerHTML = "";

  productos.forEach((p, index) => {
    const li = document.createElement("li");
  li.innerHTML = `
  <img src="${p.foto}" alt="${p.nombre}" class="img-producto"><br>
  📦 <strong>${p.nombre}</strong><br>
  Precio: $${p.precio} | Costo: $${p.costo} | Stock: ${p.stock}
  <br>
  <button onclick="eliminarProducto(${index})" class="btn-borrar">🗑️ Eliminar</button>
  <button onclick="editarProducto(${index})" class="btn-editar">✏️ Editar</button>
`;

    lista.appendChild(li);
  });
}

function mostrarSeccion(seccion) {
  document.querySelectorAll(".seccion").forEach(sec => sec.style.display = "none");

  if (seccion === "producto") {
    document.getElementById("registro-producto").style.display = "block";
  } else if (seccion === "venta") {
    document.getElementById("registro-venta").style.display = "block";
  } else if (seccion === "inventario") {
    document.getElementById("inventario").style.display = "block";
    mostrarInventario();
  } else if (seccion === "historial") {
    document.getElementById("historial").style.display = "block";
    mostrarHistorial();
  } else if (seccion === "resumen") {
    document.getElementById("resumen").style.display = "block";
    mostrarResumen();
  }
  
}

function eliminarProducto(index) {
  if (confirm("¿Estás seguro de eliminar este producto?")) {
    productos.splice(index, 1); // elimina producto por posición
    guardarDatos(); // actualiza localStorage, select y UI
  }
}

function mostrarHistorial() {
  const lista = document.getElementById("lista-historial");
  if (!lista) return;

  lista.innerHTML = "";

  if (ventas.length === 0) {
    lista.innerHTML = "<li>No hay ventas registradas.</li>";
    return;
  }

  ventas.forEach(v => {
    const li = document.createElement("li");
    li.innerHTML = `
      🧾 <strong>${v.nombre}</strong> x${v.cantidad} — 
      Total: $${v.total}, Ganancia: $${v.ganancia} 
      <br><small>📅 Fecha: ${v.fecha}</small>
    `;
    lista.appendChild(li);
  });
}

function editarProducto(index) {
  const producto = productos[index];

  const nuevoNombre = prompt("Nuevo nombre:", producto.nombre);
  const nuevoCosto = parseFloat(prompt("Nuevo costo:", producto.costo));
  const nuevoPrecio = parseFloat(prompt("Nuevo precio:", producto.precio));
  const nuevoStock = parseInt(prompt("Nuevo stock:", producto.stock));

  if (
    !nuevoNombre || isNaN(nuevoCosto) || isNaN(nuevoPrecio) || isNaN(nuevoStock)
  ) {
    alert("Datos inválidos. No se actualizó el producto.");
    return;
  }

productos[index] = {
  ...producto,
  nombre: nuevoNombre,
  costo: nuevoCosto,
  precio: nuevoPrecio,
  stock: nuevoStock,
  foto: producto.foto // ← conserva la imagen original
};

  guardarDatos();
  alert("Producto actualizado.");
}

function mostrarResumen() {
  // Inversión total
  const cuerpoInversion = document.getElementById("cuerpo-inversion");
  const totalInversion = document.getElementById("total-inversion");
  cuerpoInversion.innerHTML = "";
  let sumaInversion = 0;

  productos.forEach(p => {
    const subtotal = p.costo * p.stock;
    sumaInversion += subtotal;
    cuerpoInversion.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>$${p.costo}</td>
        <td>${p.stock}</td>
        <td>$${subtotal}</td>
      </tr>
    `;
  });

  totalInversion.textContent = `$${sumaInversion}`;

  // Ganancia total
  const cuerpoGanancia = document.getElementById("cuerpo-ganancia");
  const totalGanancia = document.getElementById("total-ganancia");
  cuerpoGanancia.innerHTML = "";
  let sumaGanancia = 0;

  ventas.forEach(v => {
    sumaGanancia += v.ganancia;
    cuerpoGanancia.innerHTML += `
      <tr>
        <td>${v.nombre}</td>
        <td>$${v.ganancia}</td>
      </tr>
    `;
  });

  totalGanancia.textContent = `$${sumaGanancia}`;
}

// Inicializar
actualizarSelect();
mostrarInventario();
mostrarSeccion("ventas");



