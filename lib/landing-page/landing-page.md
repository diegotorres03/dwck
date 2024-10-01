# Landing Page Component

### Description

`LandingPage` es un componente web diseñado para estructurar las secciones principales de una página de aterrizaje (**Landing Page**). Actúa como un contenedor semántico que facilita la organización y presentación de los diferentes elementos que componen la página.

- El **header** de la página se inserta utilizando el atributo `slot="header"`.
- El **footer** también puede insertarse mediante un `slot="footer"`.
- Las demás secciones, como el contenido principal, características, testimonios, llamadas a la acción, etc., se insertan directamente dentro de la etiqueta `<landing-page>`, sin necesidad de definir un slot específico.
- El orden de las secciones es flexible, lo que permite una personalización más libre y adaptada a las necesidades de la página.

Este componente proporciona una forma limpia y modular de gestionar la estructura de la landing page, manteniendo el código organizado y semánticamente correcto.

### Ejemplo

#### Importación

Este componente se implementa a través de un script, que además importa otros componentes relacionados con la landing page, como el header, el footer, y secciones como el CTA, testimonios, etc.

```html
<head>
  <!-- Importar el componente LandingPage -->
  <script type="module" src="path-to-components/landing-page.js"></script>
</head>
```

#### Implementación

```html
<body>
  <!-- Componente LandingPage -->
  <landing-page>
    <!-- Header con slot específico -->
    <header slot="header">
      <!-- contenido del Header... -->
    </header>

    <!-- Secciones de Landing Page -->
    <section class="hero">
      <!-- Contenido de la sección Hero... -->
    </section>

    <!-- Demas secciones... -->

    <footer slot="footer">
      <!-- Contenido del Footer... -->
    </footer>
  </landing-page>
</body>
```

# Landing Page Sections

Quiero colocar acá los subcomponentes de landing page
