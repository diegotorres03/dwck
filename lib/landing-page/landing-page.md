# Landing Page Component

`<landing-page>` es un componente web diseñado para estructurar las secciones principales de una página de aterrizaje (Landing Page). Funciona como un contenedor semántico que facilita la organización y presentación de los diferentes elementos que componen la página.

### Atributos personalizados

Este componente no tiene atributos personalizados específicos, pero permite la inclusión de otros componentes dentro de él.

### Slots

El componente está diseñado para aceptar los siguientes slots:

- `header`: Este slot se utiliza para introducir el header, asegurando que siempre esté en la parte superior, independientemente de su posición en el componente.
- `footer`: Este slot proporciona un área para el contenido del pie de página, garantizando que siempre esté al final del orden del componente.
- **Contenido principal**: Secciones adicionales, como características, testimonios y llamadas a la acción, se insertan directamente dentro de la etiqueta `<landing-page>` sin necesidad de definir un slot específico.

### Importación

Este componente se implementa a través de un script, que también importa todos los subcomponentes pertenecientes a él, como `<landing-header>`, `<landing-hero>`, entre otros...`

```html
<head>
  <!-- Importar el componente LandingPage -->
  <script type="module" src="path-to-components/landing-page.js"></script>
</head>
```

### Implementación

```html
<body>
  <landing-page>
    <!-- Las secciones se insertan aquí...-->
  </landing-page>
</body>
```

<br>

# Landing Header Component

`<landing-header>` es un componente que representa la sección **header** de la landing page. Es utilizado para mostrar el título de la empresa, el logotipo, el eslogan y los enlaces de navegación de manera estructurada en la parte superior de la página.

### Atributos personalizados

El componente cuenta con los siguientes atributos personalizados para configurar el contenido del header:

- `title`: Define el nombre de la empresa o propietario de la landing page, el cual aparecerá como el encabezado principal.
- `subtitle`: Añade un eslogan o lema opcional debajo del título principal, proporcionando un contexto o mensaje adicional.

### Slots

El componente también incluye slots que permiten una mayor personalización:

- `logo`: Un slot para insertar el logotipo de la empresa. Este slot debe contener una etiqueta `<img>` para definir la imagen que representará la marca.
- **Enlaces de navegación**: No requiere un slot específico. Los enlaces de navegación se definen utilizando etiquetas `<a>` directamente dentro del componente. Estos enlaces se posicionan automáticamente en la barra de navegación.

### Implementación

```html
<landing-page>
  <landing-header slot="header" title="DwCK" subtitle="HTML On Fire">
    <!-- Logo de la empresa -->
    <img slot="logo" src="./dwck-logo" alt="Logo de DwCK" />

    <!-- Enlaces de navegación -->
    <a href="#1">Enlace de Navegación 1</a>
    <a href="#2">Enlace de Navegación 2</a>
    <a href="#3">Enlace de Navegación 3</a>
  </landing-header>

  <!-- Otras secciones de la landing page... -->
</landing-page>
```

<br />

# Landing Hero Component

`<landing-hero>` es un componente que representa la sección **hero** de la landing page.

Esta sección es utilizada para destacar el contenido principal de la página de manera visualmente atractiva, siendo usualmente lo primero que los usuarios ven.

### Atributos personalizados

Este componente cuenta con los siguientes atributos personalizados (custom attributes) para personalizar su contenido:

- `title`: Define el texto principal del hero, usualmente un mensaje o
  título importante.
- `subtitle`: Contiene la descripción o texto secundario que aparece debajo del título principal.
- `background`: Especifica una imagen de fondo para la sección hero. Acepta una URL o una ruta relativa como valor para definir la imagen.

### Slots

Además, `<landing-hero> ` proporciona los siguientes slots para contenido adicional:

- `hero-image`: Un slot destinado a añadir una imagen en la parte derecha de la sección hero. Generalmente se utiliza para una imagen representativa o gráfica que complemente el texto principal.

### Implementación

```html
<landing-page>
  <landing-hero
    title="Bienvenido a DWCK"
    subtitle="Descubre el poder de los componentes html!"
    background="./assets/hero-background.jpg"
  >
    <!-- Imagen principal del Hero -->
    <img
      slot="hero-image"
      src="./assets/hero-image.png"
      alt="Imagen destacada"
    />
  </landing-hero>

  <!-- Otras secciones de la landing page... -->
</landing-page>
```

---

Hay que seguir con la guia...
