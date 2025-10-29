/**
 * Reportes.jsx - Página de análisis y estadísticas
 */
import { useState, useEffect } from 'react';
import { reportesService } from '../services/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  MapPin,
  AlertTriangle,
  Users,
  Download,
  RefreshCw,
} from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

export default function Reportes() {
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [periodo, setPeriodo] = useState('mes'); // mes, año, todo
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    cargarEstadisticas();
  }, [periodo, fechaInicio, fechaFin]);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (fechaInicio) params.fecha_desde = fechaInicio;
      if (fechaFin) params.fecha_hasta = fechaFin;

      const data = await reportesService.getEstadisticas(params);
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportarReporte = async () => {
    try {
      const params = {};
      if (fechaInicio) params.fecha_desde = fechaInicio;
      if (fechaFin) params.fecha_hasta = fechaFin;

      const blob = await reportesService.exportPDF(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
    } catch (error) {
      console.error('Error al exportar reporte:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <p className="text-gray-600 mt-1">Análisis detallado de siniestros viales</p>
        </div>
        <div className="flex gap-2">
          <button onClick={cargarEstadisticas} className="btn-secondary flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
          <button onClick={exportarReporte} className="btn-primary flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Filtros de fecha */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold">Período de análisis</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFechaInicio('');
                setFechaFin('');
              }}
              className="btn-secondary w-full"
            >
              Limpiar fechas
            </button>
          </div>
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Siniestros</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {estadisticas.total_siniestros || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Víctimas Totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {estadisticas.total_victimas || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Puntos Críticos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {estadisticas.puntos_criticos?.length || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MapPin className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tendencia</p>
              <p className="text-3xl font-bold text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-6 w-6" />
                {estadisticas.tendencia || '0%'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de siniestros por mes */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Evolución Mensual</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={estadisticas.por_mes || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="cantidad"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Siniestros"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Siniestros por gravedad */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Por Gravedad</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadisticas.por_gravedad || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="cantidad"
              >
                {(estadisticas.por_gravedad || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Siniestros por tipo */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Por Tipo de Accidente</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadisticas.por_tipo || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Puntos críticos */}
      {estadisticas.puntos_criticos && estadisticas.puntos_criticos.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold">Puntos Críticos (Top 10)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Siniestros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Víctimas
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {estadisticas.puntos_criticos.slice(0, 10).map((punto, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {punto.ubicacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                        {punto.cantidad}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {punto.victimas || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Siniestros por día de la semana */}
      {estadisticas.por_dia_semana && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Por Día de la Semana</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadisticas.por_dia_semana}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}