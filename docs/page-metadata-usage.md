# Sistema de Metadatos de Páginas

Este sistema permite gestionar automáticamente los títulos y descripciones de cada página del dashboard basándose en la URL.

## Características

- **Títulos automáticos**: Se generan automáticamente basándose en la ruta de la URL
- **Descripciones contextuales**: Cada página tiene una descripción específica y relevante
- **Personalización**: Permite sobrescribir títulos y descripciones por defecto
- **Consistencia**: Mantiene un diseño uniforme en toda la aplicación

## Componentes Disponibles

### 1. SiteHeader (Automático)

El `SiteHeader` ahora muestra automáticamente el título y descripción de la página actual. No requiere configuración adicional.

### 2. PageHeader (Opcional)

Componente que se puede usar en páginas individuales para mostrar metadatos más prominentes:

```tsx
import { PageHeader } from '@/components/page-header';

export default function StaffPage() {
  return (
    <ProductLayout>
      <PageHeader
        customTitle="Gestión del Personal"
        customDescription="Administra el personal del gimnasio, sus roles y permisos"
      />
      {/* Contenido de la página */}
    </ProductLayout>
  );
}
```

### 3. Hook usePageMetadata

Hook personalizado para acceder a los metadatos desde cualquier componente:

```tsx
import { usePageMetadata } from '@/hooks/use-page-metadata';

function MyComponent() {
  const metadata = usePageMetadata();

  return (
    <div>
      <h2>{metadata.title}</h2>
      <p>{metadata.description}</p>
    </div>
  );
}
```

## Configuración de Metadatos

Los metadatos se configuran en `config/page-metadata.ts`. Para añadir una nueva página:

```tsx
export const pageMetadata: Record<string, PageMetadata> = {
  'nueva-pagina': {
    title: 'Nueva Página',
    description: 'Descripción de la nueva página',
  },
};
```

## Rutas Soportadas

El sistema soporta rutas anidadas y busca coincidencias de la más específica a la más general:

- `staff` → Coincide con la ruta `/staff`
- `staff/create_staff` → Coincide con la ruta `/staff/create_staff`
- `user/profile` → Coincide con la ruta `/user/profile`

## Personalización

### Sobrescribir Metadatos por Defecto

```tsx
<PageHeader
  customTitle="Mi Título Personalizado"
  customDescription="Mi descripción personalizada"
/>
```

### Usar Metadatos por Defecto

```tsx
<PageHeader /> // Usa automáticamente los metadatos de la URL
```

## Ejemplos de Uso

### Página Simple

```tsx
export default function CustomersPage() {
  return (
    <ProductLayout>
      <PageHeader />
      {/* El título y descripción se generan automáticamente */}
    </ProductLayout>
  );
}
```

### Página con Metadatos Personalizados

```tsx
export default function CreateUserPage() {
  return (
    <ProductLayout>
      <PageHeader
        customTitle="Crear Nuevo Cliente"
        customDescription="Completa el formulario para registrar un nuevo cliente en el sistema"
      />
      {/* Formulario de creación */}
    </ProductLayout>
  );
}
```

### Componente con Metadatos Dinámicos

```tsx
function UserCard({ user }) {
  const metadata = usePageMetadata();

  return (
    <div>
      <h3>{user.name}</h3>
      <p>Página: {metadata.title}</p>
    </div>
  );
}
```

## Beneficios

1. **SEO mejorado**: Cada página tiene metadatos únicos y descriptivos
2. **UX consistente**: Los usuarios siempre saben en qué página están
3. **Mantenimiento fácil**: Los metadatos se centralizan en un solo archivo
4. **Flexibilidad**: Permite personalización cuando es necesario
5. **Automatización**: Reduce la necesidad de configurar manualmente cada página
