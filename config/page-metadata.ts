export interface PageMetadata {
  title: string;
  description: string;
}

export const pageMetadata: Record<string, PageMetadata> = {
  // Páginas principales
  '': {
    title: 'Dashboard',
    description: 'Panel principal del gimnasio con estadísticas y resumen',
  },
  dashboard: {
    title: 'Dashboard',
    description: 'Panel principal del gimnasio con estadísticas y resumen',
  },

  // Gestión de clientes
  customers: {
    title: 'Clientes',
    description: 'Gestión y administración de clientes del gimnasio',
  },
  'customers/create_user': {
    title: 'Crear Cliente',
    description: 'Registrar un nuevo cliente en el sistema',
  },
  'customers/edit': {
    title: 'Editar Cliente',
    description: 'Modificar información de un cliente existente',
  },

  // Gestión de personal
  staff: {
    title: 'Personal',
    description: 'Administración del personal y empleados del gimnasio',
  },
  'staff/create_staff': {
    title: 'Crear Empleado',
    description: 'Registrar un nuevo empleado en el sistema',
  },
  'staff/edit': {
    title: 'Editar Empleado',
    description: 'Modificar información de un empleado existente',
  },

  // Clases y horarios
  activities: {
    title: 'Actividades',
    description: 'Gestión de clases y actividades del gimnasio',
  },
  timetable_sessions: {
    title: 'Horarios',
    description: 'Programación y horarios de clases y sesiones',
  },

  // Pagos y facturación
  payment: {
    title: 'Pagos',
    description: 'Gestión de pagos, facturación y transacciones',
  },

  // Zonas del gimnasio
  zones: {
    title: 'Zonas',
    description: 'Administración de áreas y zonas del gimnasio',
  },

  // Perfil de usuario
  user: {
    title: 'Perfil',
    description: 'Perfil y configuración del usuario',
  },
  'user/home': {
    title: 'Inicio',
    description: 'Página de inicio del usuario',
  },
  'user/profile': {
    title: 'Mi Perfil',
    description: 'Información personal y configuración del perfil',
  },
  'user/promotions': {
    title: 'Promociones',
    description: 'Ofertas y promociones disponibles',
  },
};

export function getPageMetadata(pathname: string): PageMetadata {
  // Limpiar la ruta y obtener el segmento principal
  const cleanPath = pathname.replace(/^\/+|\/+$/g, ''); // Eliminar barras del inicio y final

  // Buscar coincidencia exacta primero
  if (pageMetadata[cleanPath]) {
    return pageMetadata[cleanPath];
  }

  // Buscar coincidencia parcial para rutas anidadas
  const pathSegments = cleanPath.split('/');

  // Intentar coincidencias de mayor a menor longitud
  for (let i = pathSegments.length; i > 0; i--) {
    const partialPath = pathSegments.slice(0, i).join('/');
    if (pageMetadata[partialPath]) {
      return pageMetadata[partialPath];
    }
  }

  // Si no hay coincidencia, generar metadatos dinámicos basados en la ruta
  const lastSegment = pathSegments[pathSegments.length - 1];
  const parentSegment = pathSegments[pathSegments.length - 2];

  // Generar título y descripción basados en la estructura de la URL
  if (parentSegment && lastSegment) {
    const parentTitle =
      pageMetadata[parentSegment]?.title ||
      parentSegment.charAt(0).toUpperCase() + parentSegment.slice(1);

    if (lastSegment === 'create_staff' || lastSegment === 'create_user') {
      return {
        title: `Crear ${parentTitle}`,
        description: `Registrar un nuevo ${parentTitle.toLowerCase()} en el sistema`,
      };
    } else if (lastSegment === 'edit') {
      return {
        title: `Editar ${parentTitle}`,
        description: `Modificar información de ${parentTitle.toLowerCase()} existente`,
      };
    } else if (lastSegment.match(/^[a-f0-9-]+$/)) {
      // Es un ID o DNI
      return {
        title: `Editar ${parentTitle}`,
        description: `Modificar información de ${parentTitle.toLowerCase()} existente`,
      };
    }
  }

  // Fallback por defecto
  return {
    title: 'Página',
    description: 'Descripción de la página',
  };
}
