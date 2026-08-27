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

  // Eliminar producto
  async function eliminar(codigo: string) {
    const confirmar = window.confirm(`¿Estás seguro de que deseas eliminar el producto ${codigo}?`);
    if (!confirmar) return;

    try {
      const res = await fetch(`${API_URL}/${codigo}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const respuesta = await res.json();
        setMensaje({ tipo: "error", texto: respuesta.error || "No se pudo eliminar el producto." });
        return;
      }

      setMensaje({ tipo: "exito", texto: `Producto ${codigo} eliminado exitosamente.` });

      // Si se estaba editando el producto que se eliminó, cancelar edición
      if (editando && form.codigo === codigo) {
        cancelarEdicion();
      }

      cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      setMensaje({ tipo: "error", texto: "Error al intentar eliminar el producto." });
    }
  }

  return (
    <main className="space-y-8 py-4">
      {/* Título de la sección */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Gestión de Productos
          </h1>
          <p className="text-sm text-slate-500">
            ABM conectado a la API REST (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded">http://localhost:4001/productos</code>)
          </p>
        </div>
      </div>

      {/* Alertas de Notificación */}
      {mensaje && (
        <div
          className={`p-4 rounded-lg text-sm font-medium border transition-all ${
            mensaje.tipo === "exito"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {mensaje.tipo === "exito" ? "✓ " : "⚠ "} {mensaje.texto}
        </div>
      )}

      {/* Formulario Reutilizable para Alta (POST) y Modificación (PUT) */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>{editando ? "✏️ Modificar Producto" : "➕ Alta de Nuevo Producto"}</span>
            {editando && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-normal">
                Modo Edición
              </span>
            )}
          </h2>
          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="text-xs text-slate-500 hover:text-slate-700 underline cursor-pointer"
            >
              Cancelar edición
            </button>
          )}
        </div>

        <form onSubmit={guardar} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              placeholder="Ej: P005"
              value={form.codigo}
              onChange={manejarCambio}
              disabled={editando}
              className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                editando ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200" : "bg-white border-slate-300"
              }`}
              required
            />
            {editando && (
              <span className="text-[10px] text-slate-400">El código no es modificable</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Auriculares Bluetooth"
              value={form.nombre}
              onChange={manejarCambio}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Categoría *
            </label>
            <input
              type="text"
              name="categoria"
              placeholder="Ej: Audio, Perifericos"
              value={form.categoria}
              onChange={manejarCambio}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Precio (Gs.) *
            </label>
            <input
              type="number"
              name="precio"
              placeholder="Ej: 150000"
              min="0"
              value={form.precio}
              onChange={manejarCambio}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Stock *
            </label>
            <input
              type="number"
              name="stock"
              placeholder="Ej: 15"
              min="0"
              value={form.stock}
              onChange={manejarCambio}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              required
            />
          </div>

          <div className="sm:col-span-2 md:col-span-3 lg:col-span-5 flex items-center justify-end gap-3 pt-2">
            {editando && (
              <button
                type="button"
                onClick={cancelarEdicion}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className={`px-5 py-2 text-sm font-medium text-white rounded-lg transition-colors shadow-sm cursor-pointer ${
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
      <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Filtrar por Nombre:
            </label>
            <input
              type="text"
              placeholder="Ej: mouse, notebook..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Filtrar por Categoría:
            </label>
            <input
              type="text"
              placeholder="Ej: perifericos, monitores..."
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium self-end sm:self-center cursor-pointer"
          >
            Limpiar Filtros
          </button>
        )}
      </section>

      {/* Tabla del Listado de Productos */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-base">
            Listado de Productos
          </h2>
          <span className="text-xs font-medium text-slate-500">
            {productos.length} {productos.length === 1 ? "producto encontrado" : "productos encontrados"}
          </span>
        </div>

        {cargando ? (
          <div className="p-12 text-center text-slate-500">
            <p className="animate-pulse">Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <p className="text-base font-medium">No se encontraron productos.</p>
            <p className="text-xs text-slate-400">
              {filtroNombre || filtroCategoria
                ? "Probá cambiando los términos de búsqueda o limpiando los filtros."
                : "Creá tu primer producto utilizando el formulario de arriba."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/75 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                  <th className="p-3.5">Código</th>
                  <th className="p-3.5">Nombre</th>
                  <th className="p-3.5">Categoría</th>
                  <th className="p-3.5 text-right">Precio</th>
                  <th className="p-3.5 text-center">Stock</th>
                  <th className="p-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <FilaProducto
                    key={producto.codigo}
                    producto={producto}
                    onEditar={editar}
                    onEliminar={eliminar}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
