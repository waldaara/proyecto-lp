import React, { useEffect, useState } from "react";
import { eventService, participantService } from "../services";
import { Event, Participant } from "../api/types";
import { formatApiDate } from "../services/apiUtils";

export function ApiTest() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>("");

  // Test 1: Obtener eventos
  const testGetEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eventService.getEvents();
      setEvents(result);
      setTestResult(`✅ Obtuvimos ${result.length} eventos`);
    } catch (err: any) {
      setError(err.message);
      setTestResult(`❌ Error obteniendo eventos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: Obtener eventos futuros
  const testGetUpcomingEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await eventService.getEvents({ upcoming: true });
      setEvents(result);
      setTestResult(`✅ Obtuvimos ${result.length} eventos futuros`);
    } catch (err: any) {
      setError(err.message);
      setTestResult(`❌ Error obteniendo eventos futuros: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Obtener participantes de un evento
  const testGetParticipants = async (eventId: number) => {
    if (!eventId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await participantService.getEventParticipants(eventId);
      setTestResult(
        `✅ Evento ${eventId} tiene ${result.length} participantes`
      );
    } catch (err: any) {
      setError(err.message);
      setTestResult(`❌ Error obteniendo participantes: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 4: Crear un evento de prueba
  const testCreateEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const newEvent = await eventService.createEvent({
        event: {
          title: `Evento de Prueba ${Date.now()}`,
          description: "Este es un evento de prueba para verificar la API",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // +7 días
          location: "Ubicación de Prueba",
        },
      });
      setTestResult(`✅ Evento creado exitosamente con ID: ${newEvent.id}`);
      // Recargar la lista de eventos
      testGetEvents();
    } catch (err: any) {
      setError(err.message);
      setTestResult(`❌ Error creando evento: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 5: Verificar conexión con el backend
  const testBackendConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // Intentar hacer una petición simple
      const result = await eventService.getEvents();
      setTestResult(
        `✅ Conexión exitosa con el backend. API respondió correctamente.`
      );
    } catch (err: any) {
      setError(err.message);
      if (
        err.message.includes("Network Error") ||
        err.message.includes("Error de conexión")
      ) {
        setTestResult(
          `❌ No se puede conectar con el backend. Asegúrate de que esté ejecutándose en http://localhost:3000`
        );
      } else {
        setTestResult(`❌ Error de conexión: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        🧪 Pruebas de Integración de la API
      </h1>

      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">📋 Instrucciones</h2>
        <p className="text-sm text-gray-700">
          Este componente prueba la integración entre el frontend y el backend.
          Asegúrate de que el backend esté ejecutándose en http://localhost:3000
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">🔧 Pruebas Disponibles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="p-3 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            🔌 Probar Conexión Backend
          </button>

          <button
            onClick={testGetEvents}
            disabled={loading}
            className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            📅 Obtener Todos los Eventos
          </button>

          <button
            onClick={testGetUpcomingEvents}
            disabled={loading}
            className="p-3 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            🚀 Obtener Eventos Futuros
          </button>

          <button
            onClick={testCreateEvent}
            disabled={loading}
            className="p-3 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            ➕ Crear Evento de Prueba
          </button>
        </div>
      </div>

      {/* Resultado de la prueba */}
      {testResult && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">
            📊 Resultado de la Prueba
          </h3>
          <p className="font-mono text-sm">{testResult}</p>
        </div>
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800">⏳ Ejecutando prueba...</p>
        </div>
      )}

      {/* Errores */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-red-800">❌ Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Lista de eventos */}
      {events.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">
            📋 Eventos Obtenidos ({events.length})
          </h2>

          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-600 mb-2">{event.description}</p>
                    <p className="text-sm text-gray-500">
                      📅 {formatApiDate(event.date)}
                    </p>
                    <p className="text-sm text-gray-500">📍 {event.location}</p>
                  </div>

                  <button
                    onClick={() => testGetParticipants(event.id)}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    👥 Ver Participantes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información de estado */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          ℹ️ Información del Sistema
        </h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong>Backend URL:</strong> http://localhost:3000
          </p>
          <p>
            <strong>Estado:</strong> {loading ? "Ejecutando..." : "Listo"}
          </p>
          <p>
            <strong>Eventos en memoria:</strong> {events.length}
          </p>
          <p>
            <strong>Última prueba:</strong> {testResult || "Ninguna ejecutada"}
          </p>
        </div>
      </div>
    </div>
  );
}

