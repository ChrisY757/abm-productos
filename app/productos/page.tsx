"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import type { Producto } from "../types/Producto";
import FilaProducto from "../components/FilaProducto";

const API_URL = "http://localhost:4001/productos";

const estadoInicialFormulario = {
  codigo: "",
  nombre: "",
  categoria: "",
  precio: "",
  stock: "",
};

export default function ProductosPage() {
  // Estado para la lista de productos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [mensaje, setMensaje] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null);

  // Estados para filtros de búsqueda
  const [filtroNombre, setFiltroNombre] = useState<string>("");
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");

  // Estado para el formulario controlado
  const [form, setForm] = useState(estadoInicialFormulario);
  const [editando, setEditando] = useState<boolean>(false);

  // Estado para el modal de confirmación de eliminación
  const [productoAEliminar, setProductoAEliminar] = useState<{ codigo: string; nombre?: string } | null>(null);

  // Función para cargar productos desde la API (con filtros opcionales)
  async function cargarProductos() {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (filtroNombre.trim()) {
        params.append("nombre", filtroNombre.trim());
      }
      if (filtroCategoria.trim()) {
        params.append("categoria", filtroCategoria.trim());
      }

      const query = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`${API_URL}${query}`);

      if (!res.ok) {
        throw new Error("No se pudo obtener la lista de productos");
      }

      const datos: Producto[] = await res.json();
      setProductos(datos);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setMensaje({
        tipo: "error",
        texto: "Error de conexión con el backend (http://localhost:4001). Asegúrate de que la API esté corriendo.",
      });
    } finally {
      setCargando(false);
    }
  }

  // Cargar productos al montar el componente y cuando cambian los filtros
  useEffect(() => {
    cargarProductos();
  }, [filtroNombre, filtroCategoria]);

  // Manejo de cambios en los inputs del formulario
  function manejarCambio(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  }

  // Limpiar mensajes después de 4 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Guardar producto: POST (crear) o PUT (editar)
  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.codigo.trim() || !form.nombre.trim() || !form.categoria.trim()) {
      setMensaje({ tipo: "error", texto: "Completá todos los campos obligatorios." });
      return;
    }

    const payload = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim(),
      precio: Number(form.precio) || 0,
      stock: Number(form.stock) || 0,
    };

    try {
      const url = editando ? `${API_URL}/${payload.codigo}` : API_URL;
      const metodo = editando ? "PUT" : "POST";

      const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const respuesta = await res.json();

      if (!res.ok) {
        setMensaje({ tipo: "error", texto: respuesta.error || "Error al procesar la solicitud" });
        return;
      }

      setMensaje({
        tipo: "exito",
        texto: editando
          ? `Producto "${payload.nombre}" modificado correctamente.`
          : `Producto "${payload.nombre}" agregado con éxito.`,
      });

      // Resetear formulario y modo
      setForm(estadoInicialFormulario);
      setEditando(false);
      cargarProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setMensaje({ tipo: "error", texto: "Ocurrió un error al comunicarse con el servidor." });
    }
  }

  // Iniciar modo edición
  function editar(producto: Producto) {
    setForm({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      precio: String(producto.precio),
      stock: String(producto.stock),
    });
    setEditando(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Cancelar modo edición
  function cancelarEdicion() {
    setForm(estadoInicialFormulario);
    setEditando(false);
  }

  // Solicitar eliminación (abre el modal visual)
  function solicitarEliminar(codigo: string) {
    const prod = productos.find((p) => p.codigo === codigo);
    setProductoAEliminar({
      codigo,
      nombre: prod ? prod.nombre : codigo,
    });
  }

  // Ejecutar eliminación confirmada
  async function confirmarEliminar() {
    if (!productoAEliminar) return;
    const codigo = productoAEliminar.codigo;

    try {
      const res = await fetch(`${API_URL}/${codigo}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const respuesta = await res.json();
        setMensaje({ tipo: "error", texto: respuesta.error || "No se pudo eliminar el producto." });
        setProductoAEliminar(null);
        return;
      }

      setMensaje({ tipo: "exito", texto: `Producto ${codigo} eliminado exitosamente.` });

      // Si se estaba editando el producto que se eliminó, cancelar edición
      if (editando && form.codigo === codigo) {
        cancelarEdicion();
      }

      setProductoAEliminar(null);
      cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setMensaje({ tipo: "error", texto: "Error al intentar eliminar el producto." });
      setProductoAEliminar(null);
    }
  }

  return (
    <main className="space-y-8 py-2 w-full">
      {/* Título principal de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Gestión de Productos
          </h1>
          <p className="text-base text-slate-600 mt-1">
            ABM conectado en tiempo real a la API REST (
            <code className="text-sm font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
              http://localhost:4001/productos
            </code>
            )
          </p>
        </div>
      </div>

      {/* Alertas de Notificación */}
      {mensaje && (
        <div
          className={`p-5 rounded-xl text-base font-semibold border shadow-sm transition-all ${
            mensaje.tipo === "exito"
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-rose-50 text-rose-900 border-rose-300"
          }`}
        >
          {mensaje.tipo === "exito" ? "✓ " : "⚠ "} {mensaje.texto}
        </div>
      )}

      {/* Formulario Reutilizable para Alta (POST) y Modificación (PUT) */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-3">
            <span>{editando ? "✏️ Modificar Producto" : "➕ Alta de Nuevo Producto"}</span>
            {editando && (
              <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Modo Edición
              </span>
            )}
          </h2>
          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer self-start sm:self-auto"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={guardar} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              placeholder="Ej: P005"
              value={form.codigo}
              onChange={manejarCambio}
              disabled={editando}
              className={`w-full px-4 py-2.5 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium ${
                editando
                  ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
                  : "bg-white border-slate-300 text-slate-900 shadow-xs"
              }`}
              required
            />
            {editando && (
              <span className="text-xs text-slate-400 mt-1 block font-medium">El código no es modificable</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Auriculares Bluetooth"
              value={form.nombre}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 text-base border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Categoría *
            </label>
            <input
              type="text"
              name="categoria"
              placeholder="Ej: Audio, Perifericos"
              value={form.categoria}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 text-base border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Precio (Gs.) *
            </label>
            <input
              type="number"
              name="precio"
              placeholder="Ej: 150000"
              min="0"
              value={form.precio}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 text-base border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium shadow-xs"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              placeholder="Ej: 15"
              min="0"
              value={form.stock}
              onChange={manejarCambio}
              className="w-full px-4 py-2.5 text-base border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium shadow-xs"
              required
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3 lg:col-span-5 flex items-center justify-end gap-4 pt-3 border-t border-slate-100">
            {editando && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="px-6 py-3 text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className={`px-7 py-3 text-base font-extrabold text-white rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer ${
                editando
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {editando ? "Guardar Cambios" : "Agregar Producto"}
            </button>
          </div>
        </form>
      </section>

      {/* Sección de Filtros y Búsqueda */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              🔍 Filtrar por Nombre:
            </label>
            <input
              type="text"
              placeholder="Ej: mouse, notebook..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium shadow-xs"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              🏷️ Filtrar por Categoría:
            </label>
            <input
              type="text"
              placeholder="Ej: perifericos, monitores..."
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-4 py-2.5 text-base border border-slate-300 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium shadow-xs"
            />
          </div>
        </div>

        {(filtroNombre || filtroCategoria) && (
          <button
            type="button"
            onClick={() => {
              setFiltroNombre("");
              setFiltroCategoria("");
            }}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors self-start md:self-end cursor-pointer"
          >
            ✕ Limpiar Filtros
          </button>
        )}
      </section>

      {/* Tabla del Listado de Productos */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="font-extrabold text-slate-900 text-lg sm:text-xl">
            Listado de Productos
          </h2>
          <span className="text-sm font-semibold bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full shadow-2xs">
            {productos.length} {productos.length === 1 ? "producto registrado" : "productos registrados"}
          </span>
        </div>

        {cargando ? (
          <div className="p-16 text-center text-slate-500 font-medium">
            <p className="animate-pulse text-lg">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="p-16 text-center text-slate-500 space-y-3">
            <p className="text-xl font-bold text-slate-700">No se encontraron productos.</p>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {filtroNombre || filtroCategoria
                ? "Probá cambiando los términos de búsqueda o limpiando los filtros."
                : "Creá tu primer producto utilizando el formulario de arriba."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-xs sm:text-sm uppercase tracking-wider font-extrabold border-b border-slate-200">
                  <th className="p-4">Código</th>
                  <th className="p-4">Nombre</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4 text-right">Precio</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <FilaProducto
                    key={producto.codigo}
                    producto={producto}
                    onEditar={editar}
                    onEliminar={solicitarEliminar}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Modal / Popup de Confirmación para Eliminar */}
      {productoAEliminar && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 transform transition-all text-center space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-inner">
              🗑️
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900">
                ¿Eliminar producto?
              </h3>
              <p className="text-base text-slate-600 leading-relaxed">
                Estás a punto de eliminar el producto{" "}
                <span className="font-bold text-slate-900 block mt-1">
                  "{productoAEliminar.nombre}" ({productoAEliminar.codigo})
                </span>
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setProductoAEliminar(null)}
                className="flex-1 px-5 py-3 text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarEliminar}
                className="flex-1 px-5 py-3 text-base font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
