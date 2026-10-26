// ---------- Datos ----------
const productos = [
  { id: 1, nombre: "Torta de chocolate", categoria: "Tortas", descripcion: "Bizcocho húmedo con cobertura de chocolate.", precio: 45 },
  { id: 2, nombre: "Pan de yema", categoria: "Panes", descripcion: "Pan suave y dulce, recién horneado.", precio: 1.5 },
  { id: 3, nombre: "Alfajores", categoria: "Dulces", descripcion: "Galletas rellenas de manjar blanco.", precio: 3 },
  { id: 4, nombre: "Empanada de carne", categoria: "Salados", descripcion: "Masa crujiente rellena de carne y verduras.", precio: 4 },
  { id: 5, nombre: "Pan con chicharrón", categoria: "Salados", descripcion: "Pan francés con chicharrón y camote.", precio: 8 },
  { id: 6, nombre: "Empanada de queso", categoria: "Salados", descripcion: "Masa dorada rellena de queso fundido.", precio: 3.5 },
  { id: 7, nombre: "Tamal", categoria: "Salados", descripcion: "Tamal tradicional con salsa criolla.", precio: 6 }
];

// ---------- Funciones de la Semana 10 ----------

// Función flecha con return implícito
const soles = (monto) => `S/ ${monto.toFixed(2)}`;

// Parámetro rest
const sumar = (...numeros) => numeros.reduce((a, n) => a + n, 0);

// Parámetro por defecto: porcentaje = 10
const aplicarDescuento = (total, porcentaje = 10) => total - (total * porcentaje) / 100;

// Recursividad: caso base + llamada a sí misma
function contarUnidades(lista) {
  if (lista.length === 0) return 0;
  const [primero, ...resto] = lista;
  return primero.cantidad + contarUnidades(resto);
}

// Closure: "items" es privado, solo se usa con estos métodos
function crearCarrito() {
  let items = [];
  return {
    // Parámetro por defecto: cantidad = 1
    agregar(producto, cantidad = 1) {
      const existente = items.find((it) => it.id === producto.id);
      if (existente) {
        existente.cantidad += cantidad;
      } else {
        items.push({ ...producto, cantidad });
      }
    },
    vaciar() { items = []; },
    obtener: () => items,
    subtotal: () => sumar(...items.map((it) => it.precio * it.cantidad)),
    unidades: () => contarUnidades(items)
  };
}

const carrito = crearCarrito();

// ---------- Mostrar en pantalla ----------
const tarjetaProducto = (p) => `
  <div class="col">
    <article class="card card-body">
      <span class="badge theme-primary mb-3">${p.categoria}</span>
      <h3 class="card-title">${p.nombre}</h3>
      <p class="fg-secondary">${p.descripcion}</p>
      <p><strong>${soles(p.precio)}</strong></p>
      <button class="btn btn-solid theme-primary" data-id="${p.id}">Agregar</button>
    </article>
  </div>`;

const mostrarProductos = (categoria = "Todos") => {
  const lista = categoria === "Todos"
    ? productos
    : productos.filter((p) => p.categoria === categoria);
  document.querySelector("#productos").innerHTML = lista.map(tarjetaProducto).join("");
};

const mostrarCarrito = () => {
  const items = carrito.obtener();
  const lista = document.querySelector("#lista-carrito");

  lista.innerHTML = items.length === 0
    ? `<li class="list-group-item">Tu carrito está vacío</li>`
    : items.map((it) => `<li class="list-group-item">${it.cantidad} x ${it.nombre} — ${soles(it.precio * it.cantidad)}</li>`).join("");

  const subtotal = carrito.subtotal();
  const total = subtotal > 100 ? aplicarDescuento(subtotal) : subtotal;
  document.querySelector("#subtotal").textContent = soles(subtotal);
  document.querySelector("#total").textContent = soles(total);
  document.querySelector("#contador").textContent = carrito.unidades();
};

// Muestra el toast y lo oculta solo después de unos segundos
const mostrarToast = (id, milisegundos = 4000) => {
  const toast = document.querySelector(id);
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), milisegundos);
};

// ---------- Eventos ----------
document.querySelector("#productos").addEventListener("click", (e) => {
  const boton = e.target.closest("button[data-id]");
  if (!boton) return;
  const producto = productos.find((p) => p.id === Number(boton.dataset.id));
  carrito.agregar(producto);
  mostrarCarrito();
});

document.querySelector("#filtros").addEventListener("click", (e) => {
  const enlace = e.target.closest("a[data-categoria]");
  if (!enlace) return;
  e.preventDefault();
  document.querySelectorAll("#filtros .nav-link").forEach((a) => a.classList.remove("active"));
  enlace.classList.add("active");
  mostrarProductos(enlace.dataset.categoria);
});

document.querySelector("#btn-vaciar").addEventListener("click", () => {
  carrito.vaciar();
  mostrarCarrito();
});

document.querySelector("#form-pedido").addEventListener("submit", (e) => {
  e.preventDefault();
  mostrarToast("#toast-pedido");
  e.target.reset();
});

// ---------- Inicio ----------
mostrarProductos();
mostrarCarrito();