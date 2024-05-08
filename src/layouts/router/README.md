# App Router

Este es un web component que facilita el manejo de las rutas en una applicacion web

## Ejemplo

```html
<nav>
  <a href="#">index</a>
  <a href="#page-1">page 1</a>
  <a href="#page-2">page 2</a>
  
</nav>

<app-router>

  <!-- this is the default page, since it does not have the hash attribute -->
  <app-route>
    <h1>this is the index</h1>
    <p>this is also de default page</p>
  </app-router>

  <app-route hash="page-1">
    <h1>Pagina 1</h1>
    <p>Contenido de la pagina uno.</p>
  </app-router>
  

  <app-route hash="page-2">
    <h1>Pagina 2</h1>
    <p>Contenido de la pagina dos.</p>
  </app-router>

</app-router>

```