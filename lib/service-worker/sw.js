
console.log('this is the service worker')

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('my-cache').then(function (cache) {
      return cache.addAll([
        '../dwck-component.js',
        '../web-tools.js',
        // ${cacheItems.map(cache => `'${cache.getAttribute('path')}'`).join(', ')}
      ])
    })
  )
})

// Listen for the fetch event and return the cached asset, if available
self.addEventListener('fetch',async function (event) {
  console.log('fetching')
  console.log(event.request)

  const client = await self.clients.get(event.source.id);
  client.postMessage('fetchign')

  // event.source.postMessage('fetching')
  event.respondWith(fetch('http://localhost:8080/demos/kanban-demo.html'))


  // event.respondWith(
  //   caches.match(event.request).then(function (response) {
  //     return response || fetch(event.request);
  //   })
  // )
})

self.addEventListener('message',async  event => {
  console.log('Received message from main page:', event.data, event.source.id);
  const client = await self.clients.get(event.source.id);
  console.log('Client:', client, client.postMessage)
  setTimeout(() => {
    console.log('Sending message to main page');
    client.postMessage('Message received from service worker')
    
  }, 1000);
  // Handle the message from the main page
  // if (event.data === 'updateCache') {
  //   // Perform cache update logic here
  //   console.log('Updating cache...');
    // event.source.postMessage('Cache updated');
  // }
})
