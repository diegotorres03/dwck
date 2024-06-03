
// import {
//   html,
//   mapComponentEvents,
//   updateVars,
//   registerTriggers,
//   sleep,
//   onDomReady,
// } from '../web-tools.js'
import {DWCKComponent} from '../dwck-component.js'

// import { Chart } from '../../node_modules/chart.js/dist/chart.umd.js'


export class DataChartComponent extends DWCKComponent {

  path = import.meta.url
  template = './data-chart.html'
  
  static get observedAttributes(){
    return [ 'type', 'width', 'height' ]
  }

  set type(value) {
    this.chart.config.type = value //this.getAttribute('type')
    this.chart.update()
  }
  
  constructor() {
    super()

    // this.addEventListener('componentReady', () => {
    //   // mapComponentEvents(this)
    //   console.log('data-chart ready')
    //   this.renderChart()
    // })

  }


  async connectedCallback() {
    const { onDomReady, registerTriggers, sleep } = await import('../web-tools.js')
    await onDomReady()
    registerTriggers(this, (event) => console.log(event))
    await sleep(100)
    this.renderChart()
  }

  async renderChart() {
    const { sleep } = await import('../web-tools.js')

    let chartData
    // const {Chart}  = await import('../../node_modules/chart.js/dist/chart.umd.js')
    // const Chart = await import('https://cdn.jsdelivr.net/npm/chart.js')
    // datapoints
    console.log('rendering chart')
    /*
      // const Chart = await import('../../node_modules/chart.js/dist/chart.umd.js') 
    const canvas = this.shadowRoot.querySelector('#chart')
    console.log('canvas', canvas, Chart)
    // return
    const chart = new Chart(canvas,{
      type: 'bar',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
    console.log(chart)
    return
    /* */
      await sleep(10)

      const dataSets = Array.from(this.querySelectorAll('data-set'))

      // const dataPoints = Array.from(this.querySelectorAll('data-point'))

      // [ ] enable chart from table
      if(this.hasAttribute('from')) {
        const selector = this.getAttribute('from')
        const table = document.querySelector(selector) || this.shadowRoot.querySelector(selector)

        const columnNames = [...table.querySelectorAll('th')].map(th => th.textContent)

        chartData = Array.from(table.querySelectorAll('tbody'))
          .reduce((acc, tbody, bodyIndex) => {
            const x = this.getAttribute('x')
            const y = this.getAttribute('y')
            const xIndex = columnNames.findIndex(col => col === x)
            const yIndex = columnNames.findIndex(col => col === y)
            
            const label = tbody.title || tbody.id || 'no-label'
            const data = [...tbody.querySelectorAll('tr')]
              .map((tr, index) => {
                // get all the values in order
                const rows = [...tr.querySelectorAll('td')]
                if(bodyIndex === 0) acc.labels.push(rows[xIndex].textContent)
                const value = [
                  dataCellToNumber(rows[xIndex]),
                  dataCellToNumber(rows[yIndex])
                ]
                
                

                  function dataCellToNumber(td) {
                    const initialValue = td.textContent
                      .replace('$', '')
                      .replace(/[, ]/g, '')
                    const numberValue = Number(initialValue)
                    return Number.isNaN(numberValue) ? initialValue : numberValue
                  }
                return value
              })
            acc.datasets.push({label, data})
            return acc
          }, {labels: [], datasets: []})


        Array.from(table.querySelectorAll('tbody'))
          .map(tbody => [...tbody.querySelectorAll('tr')].map((tr, index) => [...tr.querySelectorAll('td')].map(td => {
            const initialValue = td.textContent
              .replace('$', '')
              .replace(/[,]/g, '')
            const numberValue = Number(initialValue)
            return Number.isNaN(numberValue) ? initialValue : numberValue
          })))

      } else {
    

      /**
       * This will be when data-set and data-point us used
       *
       * @param {*} dataSet
       * @return {*} 
       */
      function getDataPoints(dataSet) {
          const dataPoints = Array.from(dataSet.querySelectorAll('data-point'))

          const entries = dataPoints.map(point => {
              const attributes = [...point.attributes]
              const keyValuePairs = attributes.map(attr => {
                  return { key: attr.nodeName, value: attr.nodeValue }
              })
              return keyValuePairs
          })

          const data = entries.map(entry => {
              let record = {}
              entry.forEach(item => {
                  record[item.key] = item.value
              })
              return record
          })

          return {
              label: dataSet.getAttribute('label') || 'no-label',
              data: data.map(item => Number(item.count)),
              rawData: data,
          }
      }

      const datasets = dataSets.map(getDataPoints)
      console.log('datasets', datasets)

      chartData = {
          labels: datasets[0].rawData.map(row => row.year),
          datasets,
          // [
          //     {
          //         label: 'Acquisitions by year',
          //         data: data.map(row => row.count)
          //     }
          // ]
      }

          
    }


    console.log('222222222222222222222222222222222')
    console.log('chartData', chartData)
      const displayLegend = this.hasAttribute('legend')

      this.chart = new Chart(
          this.shadowRoot.getElementById('chart'),
          {
              // type:  'line',
              type: this.getAttribute('type') || 'line',
              data: chartData,
              options: {
                plugins: {
                  legend: { display: displayLegend }
                }
              }
              // options
          }
      );

      // const labels = Utils.months({count: 7});
     
      // new Chart(this.shadowRoot.getElementById('chart'), {
      //   type: 'bar',
      //   data: {
      //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      //     datasets: [{
      //       label: '# of Votes',
      //       data: [12, 19, 3, 5, 2, 3],
      //       borderWidth: 1
      //     }]
      //   },
      // });

  }

}

window.customElements.define('data-chart', DataChartComponent)
