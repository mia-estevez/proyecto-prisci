// src/utils/notificacionesHelper.js

export function dispararNotificacionConservador(titulo, mensaje, tipo = 'info', inmuebleId = null) {
  const notifActuales = JSON.parse(localStorage.getItem('notificaciones_conservador') || '[]');
  
  const nuevaNotif = {
    id: Date.now(),
    titulo,
    mensaje,
    emisor: 'Sistema PRISCI (Automático)',
    fecha: new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    leida: false,
    tipo, // 'alerta', 'info', 'exito'
    inmuebleId
  };

  const actualizadas = [nuevaNotif, ...notifActuales];
  localStorage.setItem('notificaciones_conservador', JSON.stringify(actualizadas));
}