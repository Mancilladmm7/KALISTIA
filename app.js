let productos = JSON.parse(localStorage.getItem("productos")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];

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

  if (!nombre || isNaN(costo) || isNaN(precio) || isNaN(stock)) {
    alert("Faltan datos válidos");
    return;
  }

  productos.push({ nombre, costo, precio, stock });
  guardarDatos();
  alert("Producto registrado");
  document.getElementById("nombre").value = "";
  document.getElementById("costo").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("stock").value = "";
}

function actualizarSelect() {
  const select = document.getElementById("producto-select");
  select.innerHTML = "";
  productos.forEach((p, i) => {
    select.innerHTML += `<option value="${i}">${p.nombre} (Stock: ${p.stock})</option>`;
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
      📦 <strong>${p.nombre}</strong><br>
      Precio: $${p.precio} | Costo: $${p.costo} | Stock: ${p.stock}
      <br><button onclick="eliminarProducto(${index})" class="btn-borrar">🗑️ Eliminar</button>
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

// Inicializar
actualizarSelect();
mostrarInventario();
mostrarSeccion("ventas");

