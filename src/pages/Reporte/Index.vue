<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card flat bordered class="filter-card">
          <q-card-section>
            <div class="row items-center q-gutter-md">
              <div class="text-h6 text-wine">
                Filtros de Reporte
              </div>
              <q-space />
              <q-input
                v-model="filters.startDate"
                type="date"
                dense
                outlined
                label="Fecha Inicio"
                class="filter-input"
              />
              <q-input
                v-model="filters.endDate"
                type="date"
                dense
                outlined
                label="Fecha Fin"
                class="filter-input"
              />
              <q-btn
                color="grey-8"
                icon="refresh"
                label="Actualizar"
                @click="fetchAllData"
                flat
                no-caps
              />
              <q-btn
                color="grey-8"
                icon="download"
                label="Descargar Excel"
                @click="downloadExcel"
                flat
                no-caps
              />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Métricas principales -->
      <div class="col-12">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="metric-card">
              <q-card-section>
                <div class="text-h4 text-wine">{{ totalMovements }}</div>
                <div class="text-caption text-wine-light">Total Movimientos</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="metric-card">
              <q-card-section>
                <div class="text-h4 text-wine">{{ formatCurrency(totalValue) }}</div>
                <div class="text-caption text-wine-light">Valor Total</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="metric-card">
              <q-card-section>
                <div class="text-h4 text-wine">{{ entriesCount }}</div>
                <div class="text-caption text-wine-light">Entradas</div>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="metric-card">
              <q-card-section>
                <div class="text-h4 text-wine">{{ exitsCount }}</div>
                <div class="text-caption text-wine-light">Salidas</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>

      <!-- Gráficos principales -->
      <div class="col-12 col-lg-8">
        <q-card flat bordered class="chart-card">
          <q-card-section>
            <div class="text-h6 text-wine q-mb-md">
              Evolución Mensual de Movimientos
            </div>
            <div id="monthlyChart" style="height: 350px"></div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-4">
        <q-card flat bordered class="chart-card">
          <q-card-section>
            <div class="text-h6 text-wine q-mb-md">
              Distribución por Tipo
            </div>
            <div id="movementsPieChart" style="height: 350px"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráficos secundarios -->
      <div class="col-12 col-md-6">
        <q-card flat bordered class="chart-card">
          <q-card-section>
            <div class="text-h6 text-wine q-mb-md">
              Valor por Categoría
            </div>
            <div id="inventoryValueChart" style="height: 300px"></div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card flat bordered class="chart-card">
          <q-card-section>
            <div class="text-h6 text-wine q-mb-md">
              Top 5 Proveedores
            </div>
            <div id="suppliersChart" style="height: 300px"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gráfico de razones de movimientos -->
      <div class="col-12">
        <q-card flat bordered class="chart-card">
          <q-card-section>
            <div class="text-h6 text-wine q-mb-md">
              Movimientos por Razón
            </div>
            <div id="reasonChart" style="height: 300px"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Tabla de productos con bajo stock -->
      <div class="col-12">
        <q-card flat bordered class="table-card">
          <q-card-section>
            <div class="text-h6 text-wine q-mb-md">
              <q-icon name="warning" class="q-mr-sm text-amber-8" />
              Productos con Bajo Stock
            </div>
            <q-table
              :rows="lowStockProducts"
              :columns="lowStockColumns"
              row-key="id"
              flat
              dense
              :pagination="{ rowsPerPage: 10, sortBy: 'stock' }"
              class="low-stock-table"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'
import Highcharts from 'highcharts'
import { date } from 'quasar'
import { api } from 'src/boot/axios'

export default defineComponent({
  name: 'ReportePage',

  data() {
    return {
      filters: {
        startDate: date.formatDate(date.subtractFromDate(new Date(), { days: 30 }), 'YYYY-MM-DD'),
        endDate: date.formatDate(new Date(), 'YYYY-MM-DD')
      },
      movementsData: null,
      inventoryData: null,
      suppliersData: null,
      lowStockProducts: [],
      lowStockColumns: [
        {
          name: 'code',
          field: 'code',
          label: 'Código',
          align: 'left',
          style: 'font-weight: 500;'
        },
        { name: 'name', field: 'name', label: 'Nombre', align: 'left' },
        {
          name: 'stock',
          field: 'stock',
          label: 'Stock Actual',
          align: 'right',
          style: 'color: #a13950; font-weight: 500;'
        },
        { name: 'category', field: 'category', label: 'Categoría', align: 'left' },
        {
          name: 'value',
          field: 'value',
          label: 'Valor',
          align: 'right',
          format: val => this.formatCurrency(val)
        }
      ]
    }
  },

  computed: {
    totalMovements() {
      if (!this.movementsData?.direction_summary) return 0
      return this.movementsData.direction_summary.reduce((sum, item) => sum + item.total, 0)
    },
    totalValue() {
      if (!this.movementsData?.direction_summary) return 0
      return this.movementsData.direction_summary.reduce((sum, item) => sum + item.total_value, 0)
    },
    entriesCount() {
      if (!this.movementsData?.direction_summary) return 0
      const entry = this.movementsData.direction_summary.find(item => item.direction === 'IN')
      return entry ? entry.total : 0
    },
    exitsCount() {
      if (!this.movementsData?.direction_summary) return 0
      const exit = this.movementsData.direction_summary.find(item => item.direction === 'OUT')
      return exit ? exit.total : 0
    }
  },

  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value || 0)
    },

    async downloadExcel() {
      try {
        this.$q.loading.show();
        const response = await this.$store.dispatch('general/downloadExcelReport', {
          startDate: this.filters.startDate,
          endDate: this.filters.endDate
        });

        const url = window.URL.createObjectURL(new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte_movimientos_${this.filters.startDate}_${this.filters.endDate}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        this.$q.notify({
          type: 'positive',
          message: 'Reporte Excel generado correctamente.',
          icon: 'download'
        });
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al generar el reporte Excel.',
          icon: 'error'
        });
      } finally {
        this.$q.loading.hide();
      }
    },

    async fetchAllData() {
      this.$q.loading.show('Cargando datos...');
      try {
        await Promise.all([
          this.fetchMovements(),
          this.fetchInventory(),
          this.fetchSuppliers()
        ]);
        this.renderCharts();
      } finally {
        this.$q.loading.hide();
      }
    },

    async fetchMovements() {
      try {
        const { data } = await api.get('api/reports/movements/', {
          params: this.filters
        })
        this.movementsData = data
      } catch (error) {
        console.error('Error fetching movements:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar datos de movimientos',
          icon: 'error'
        })
      }
    },

    async fetchInventory() {
      try {
        const { data } = await api.get('api/reports/inventory/')
        this.inventoryData = data
        this.lowStockProducts = data.low_stock
      } catch (error) {
        console.error('Error fetching inventory:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar datos de inventario',
          icon: 'error'
        })
      }
    },

    async fetchSuppliers() {
      try {
        const { data } = await api.get('api/reports/suppliers/')
        this.suppliersData = data
      } catch (error) {
        console.error('Error fetching suppliers:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar datos de proveedores',
          icon: 'error'
        })
      }
    },

    renderCharts() {
      this.$nextTick(() => {
        if (this.movementsData) {
          this.renderMovementsPieChart()
          this.renderMonthlyChart()
          this.renderReasonChart()
        }
        if (this.inventoryData) {
          this.renderInventoryValueChart()
        }
        if (this.suppliersData) {
          this.renderSuppliersChart()
        }
      })
    },

    renderMovementsPieChart() {
      const data = this.movementsData.direction_summary.map(item => ({
        name: item.direction === 'IN' ? 'Entradas' : 'Salidas',
        y: item.total,
        value: item.total_value,
        color: item.direction === 'IN' ? '#712736' : '#a13950'
      }))

      Highcharts.chart('movementsPieChart', {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent'
        },
        title: { text: null },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br>{point.percentage:.1f}%',
              style: { fontSize: '12px', color: '#616161' }
            },
            showInLegend: true,
            size: '80%'
          }
        },
        tooltip: {
          pointFormat: 'Cantidad: <b>{point.y}</b><br/>Valor: <b>S/ {point.value:,.2f}</b>'
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          itemStyle: { color: '#712736' }
        },
        series: [{
          name: 'Movimientos',
          data: data
        }]
      })
    },

    renderMonthlyChart() {
      const categories = []
      const entradas = []
      const salidas = []
      const valores = []

      this.movementsData.monthly_summary.forEach(item => {
        categories.push(date.formatDate(item.month, 'MMM YYYY'))
        entradas.push(item.total)
        salidas.push(0)
        valores.push(item.total_value)
      })

      Highcharts.chart('monthlyChart', {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        title: { text: null },
        xAxis: {
          categories,
          labels: { style: { fontSize: '11px', color: '#712736' } }
        },
        yAxis: [{
          title: { text: 'Cantidad', style: { color: '#712736' } },
          labels: { style: { color: '#712736' } }
        }, {
          title: { text: 'Valor (S/)', style: { color: '#712736' } },
          labels: {
            style: { color: '#712736' },
            formatter: function() {
              return 'S/ ' + Highcharts.numberFormat(this.value, 0);
            }
          },
          opposite: true
        }],
        tooltip: {
          shared: true,
          formatter: function() {
            let tooltip = '<b>' + this.x + '</b><br/>';
            this.points.forEach(point => {
              if (point.series.name === 'Valor') {
                tooltip += point.series.name + ': <b>S/ ' + Highcharts.numberFormat(point.y, 2) + '</b><br/>';
              } else {
                tooltip += point.series.name + ': <b>' + point.y + '</b><br/>';
              }
            });
            return tooltip;
          }
        },
        series: [{
          name: 'Movimientos',
          data: entradas,
          color: '#712736'
        }, {
          name: 'Valor',
          data: valores,
          yAxis: 1,
          type: 'spline',
          color: '#a13950',
          marker: { enabled: true, radius: 4 }
        }],
        legend: {
          align: 'center',
          verticalAlign: 'top',
          itemStyle: { color: '#712736' }
        }
      })
    },

    renderReasonChart() {
      if (!this.movementsData?.reason_summary) return;

      const data = this.movementsData.reason_summary.map((item, index) => ({
        name: item.reason_type__name,
        y: item.total,
        value: item.total_value,
        color: `hsl(285, ${30 + index * 10}%, ${35 + index * 5}%)` // Actualizado para usar una paleta armónica basada en #712736
      }))

      Highcharts.chart('reasonChart', {
        chart: {
          type: 'bar',
          backgroundColor: 'transparent'
        },
        title: { text: null },
        xAxis: {
          type: 'category',
          labels: { style: { fontSize: '12px', color: '#616161' } }
        },
        yAxis: {
          title: { text: 'Cantidad de Movimientos', style: { color: '#616161' } },
          labels: { style: { color: '#616161' } }
        },
        legend: { enabled: false },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              format: '{point.y}',
              style: { color: '#616161', fontSize: '11px' }
            }
          }
        },
        tooltip: {
          pointFormat: 'Movimientos: <b>{point.y}</b><br/>Valor: <b>S/ {point.value:,.2f}</b>'
        },
        series: [{
          name: 'Razón',
          data: data
        }]
      })
    },

    renderInventoryValueChart() {
      const data = []
      const categories = {}

      this.inventoryData.products.forEach(product => {
        if (!categories[product.category]) {
          categories[product.category] = 0
        }
        categories[product.category] += product.value
      })

      let index = 0
      for (const [category, value] of Object.entries(categories)) {
        data.push({
          name: category,
          y: value,
          color: `hsl(345, ${30 + index * 10}%, ${35 + index * 5}%)`
        })
        index++
      }

      Highcharts.chart('inventoryValueChart', {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent'
        },
        title: { text: null },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br>S/ {point.y:,.0f}',
              style: { fontSize: '11px', color: '#712736' }
            },
            showInLegend: true,
            size: '75%'
          }
        },
        tooltip: {
          pointFormat: 'Valor: <b>S/ {point.y:,.2f}</b><br/>Porcentaje: <b>{point.percentage:.1f}%</b>'
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          layout: 'horizontal',
          itemStyle: { color: '#712736' }
        },
        series: [{
          name: 'Categoría',
          data: data
        }]
      })
    },

    renderSuppliersChart() {
      const data = this.suppliersData.suppliers
        .slice(0, 5)
        .map((supplier, index) => ({
          name: supplier.name,
          y: supplier.total_value,
          color: `hsl(345, ${30 + index * 10}%, ${35 + index * 5}%)`
        }))

      Highcharts.chart('suppliersChart', {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        title: { text: null },
        xAxis: {
          type: 'category',
          labels: {
            style: { fontSize: '11px', color: '#616161' },
            rotation: -45
          }
        },
        yAxis: {
          title: { text: 'Valor Total (S/)', style: { color: '#616161' } },
          labels: {
            style: { color: '#616161' },
            formatter: function() {
              return 'S/ ' + Highcharts.numberFormat(this.value, 0);
            }
          }
        },
        legend: { enabled: false },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              format: 'S/ {point.y:,.0f}',
              style: { fontSize: '10px', color: '#712736' }
            }
          }
        },
        tooltip: {
          pointFormat: 'Valor total: <b>S/ {point.y:,.2f}</b>'
        },
        series: [{
          name: 'Proveedor',
          data: data
        }]
      })
    }
  },

  mounted() {
    this.fetchAllData()
  }
})
</script>

<style scoped>
.filter-card {
  background: #f9f2f4;
  border: 1px solid #e0d0d4;
}

.metric-card {
  background: white;
  border: 1px solid #e0d0d4;
  padding: 8px;
  transition: all 0.2s ease;
}

.metric-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.chart-card {
  background: white;
  border: 1px solid #e0d0d4;
  transition: all 0.2s ease;
}

.chart-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-card {
  background: white;
  border: 1px solid #e0d0d4;
}

.low-stock-table {
  border-radius: 0;
}

.filter-input {
  min-width: 150px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .filter-input {
    min-width: 120px;
  }
}

/* Dark mode support */
.body--dark .filter-card {
  background: #2c1418;
  border-color: #3d1c22;
}

.body--dark .metric-card,
.body--dark .chart-card,
.body--dark .table-card {
  background: #1e1414;
  border-color: #3d1c22;
}

.body--dark .metric-card:hover,
.body--dark .chart-card:hover {
  box-shadow: 0 2px 8px rgba(113, 39, 54, 0.2);
}

/* Clases de color personalizadas */
.text-wine {
  color: #712736 !important;
}

.text-wine-light {
  color: #a13950 !important;
}
</style>
