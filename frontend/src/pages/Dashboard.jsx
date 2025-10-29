/**
 * Dashboard principal con estadísticas y gráficos
 */
import { useState, useEffect } from 'react';
import { reportesService } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { AlertTriangle, TrendingUp, MapPin, Car } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [siniestrosPorZona, setSiniestrosPorZona] = useState([]);
  const [estadisticasPorTipo, setEstadisticasPorTipo] = useState([]);
  const [siniestrosPorDia, setSiniestrosPorDia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resumenData, zonasData, tiposData, diasData] = await Promise.all([
        reportesService.getResumenGeneral(),
        reportesService.getSiniestrosPorZona(),
        reportesService.getEstadisticasPorTipo(),
        reportesService.getSiniestrosPorDiaSemana(),
      ]);

      setResumen(resumenData);
      setSiniestrosPorZona(zonasData);
      setEstadisticasPorTipo(tiposData);
      setSiniestrosPorDia(diasData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vista general de siniestros viales</p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Siniestros</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {resumen?.total_siniestros || 0}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Víctimas Fatales</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {resumen?.total_fallecidos || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Heridos</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {resumen?.total_heridos || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Siniestros Graves</p>
              <p className="text-3xl font-bold text-red-900 mt-1">
                {resumen?.siniestros_graves || 0}
              </p>
            </div>
            <div className="p-3 bg-red-200 rounded-full">
              <MapPin className="w-6 h-6 text-red-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Siniestros por Zona */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Siniestros por Zona</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={siniestrosPorZona}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zona" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_siniestros" fill="#3b82f6" name="Siniestros" />
              <Bar dataKey="total_fallecidos" fill="#ef4444" name="Fallecidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas por Tipo */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadisticasPorTipo}
                dataKey="cantidad"
                nameKey="tipo_siniestro"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => entry.tipo_siniestro}
              >
                {estadisticasPorTipo.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Siniestros por Día de la Semana */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Siniestros por Día de la Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={siniestrosPorDia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia_semana" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="cantidad" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Total Siniestros"
              />
              <Line 
                type="monotone" 
                dataKey="fallecidos" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Fallecidos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de tipos de siniestro */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Detalle por Tipo de Siniestro</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Gravedad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fallecidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Heridos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fin de Semana
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {estadisticasPorTipo.map((tipo, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tipo.tipo_siniestro}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tipo.gravedad === 'alta' ? 'bg-red-100 text-red-800' :
                      tipo.gravedad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {tipo.gravedad.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {tipo.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                    {tipo.fallecidos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                    {tipo.heridos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {tipo.porcentaje_fin_semana}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}