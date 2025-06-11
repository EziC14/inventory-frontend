<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <!-- Filtros de fecha -->
      <div class="col-12">
        <q-card class="my-card">
          <q-card-section>
            <div class="row items-center q-gutter-sm">
              <div class="text-h6">Filtros</div>
              <q-space />
              <q-input v-model="filters.startDate" type="date" dense outlined label="Fecha Inicio" />
              <q-input v-model="filters.endDate" type="date" dense outlined label="Fecha Fin" />
              <q-btn color="primary" icon="refresh" label="Actualizar" @click="fetchAllData" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Resumen de Movimientos -->
      <div class="col-12 col-md-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Movimientos por Tipo</div>
            <div id="movementsPieChart" style="height: 300px"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Movimientos por Mes -->
      <div class="col-12 col-md-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Movimientos por Mes</div>
            <div id="monthlyChart" style="height: 300px"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Valor Total del Inventario -->
      <div class="col-12 col-md-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Valor del Inventario por Categoría</div>
            <div id="inventoryValueChart" style="height: 300px"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Top Proveedores -->
      <div class="col-12 col-md-6">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Top 5 Proveedores</div>
            <div id="suppliersChart" style="height: 300px"></div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Productos con Bajo Stock -->
      <div class="col-12">
        <q-card class="my-card">
          <q-card-section>
            <div class="text-h6">Productos con Bajo Stock</div>
            <q-table
              :rows="lowStockProducts"
              :columns="lowStockColumns"
              row-key="id"
              dense
              :pagination="{ rowsPerPage: 5 }"
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
        { name: 'code', field: 'code', label: 'Código', align: 'left' },
        { name: 'name', field: 'name', label: 'Nombre', align: 'left' },
        { name: 'stock', field: 'stock', label: 'Stock Actual', align: 'right' },
        { name: 'category', field: 'category', label: 'Categoría', align: 'left' },
        {
          name: 'value',
          field: 'value',
          label: 'Valor',
          align: 'right',
          format: val => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val)
        }
      ]
    }
  },

  methods: {
    async fetchAllData() {
      await Promise.all([
        this.fetchMovements(),
        this.fetchInventory(),
        this.fetchSuppliers()
      ])
      this.renderCharts()
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
          message: 'Error al cargar datos de movimientos'
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
          message: 'Error al cargar datos de inventario'
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
          message: 'Error al cargar datos de proveedores'
        })
      }
    },

    renderCharts() {
      if (this.movementsData) {
        this.renderMovementsPieChart()
        this.renderMonthlyChart()
      }
      if (this.inventoryData) {
        this.renderInventoryValueChart()
      }
      if (this.suppliersData) {
        this.renderSuppliersChart()
      }
    },

    renderMovementsPieChart() {
      const data = this.movementsData.direction_summary.map(item => ({
        name: item.direction === 'IN' ? 'Entrada' : 'Salida',
        y: item.total,
        value: item.total_value
      }))

      Highcharts.chart('movementsPieChart', {
        chart: { type: 'pie' },
        title: { text: null },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %'
            }
          }
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y}</b><br/>Valor: <b>S/ {point.value:,.2f}</b>'
        },
        series: [{
          name: 'Movimientos',
          colorByPoint: true,
          data: data
        }]
      })
    },

    renderMonthlyChart() {
      const categories = []
      const totals = []
      const values = []

      this.movementsData.monthly_summary.forEach(item => {
        categories.push(date.formatDate(item.month, 'MMM YYYY'))
        totals.push(item.total)
        values.push(item.total_value)
      })

      Highcharts.chart('monthlyChart', {
        chart: { type: 'column' },
        title: { text: null },
        xAxis: { categories },
        yAxis: [{
          title: { text: 'Cantidad' }
        }, {
          title: { text: 'Valor (S/)' },
          opposite: true
        }],
        series: [{
          name: 'Cantidad',
          data: totals
        }, {
          name: 'Valor',
          data: values,
          yAxis: 1,
          tooltip: {
            valuePrefix: 'S/ ',
            valueDecimals: 2
          }
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

      for (const [category, value] of Object.entries(categories)) {
        data.push({
          name: category,
          y: value
        })
      }

      Highcharts.chart('inventoryValueChart', {
        chart: { type: 'pie' },
        title: { text: null },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: S/ {point.y:,.2f}'
            }
          }
        },
        series: [{
          name: 'Valor',
          colorByPoint: true,
          data: data
        }]
      })
    },

    renderSuppliersChart() {
      const data = this.suppliersData.suppliers
        .slice(0, 5)
        .map(supplier => ({
          name: supplier.name,
          y: supplier.total_value
        }))

      Highcharts.chart('suppliersChart', {
        chart: { type: 'column' },
        title: { text: null },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          title: { text: 'Valor Total (S/)' }
        },
        legend: { enabled: false },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              format: 'S/ {point.y:,.2f}'
            }
          }
        },
        series: [{
          name: 'Valor',
          colorByPoint: true,
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
.my-card {
  width: 100%;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}
</style>
