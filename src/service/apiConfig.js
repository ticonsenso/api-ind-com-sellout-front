const ipServe = import.meta.env.VITE_API_URL;

// apiConfig.js
export const apiConfig = {
  login: {
    url: ipServe + "api/login",
    method: "POST",
  },
  users: {
    url: ipServe + "api/management/users",
  },
  roles: {
    url: ipServe + "api/management/roles",
  },
  permissions: {
    url: ipServe + "api/management/permissions",
  },
  empresasUrl: {
    url: ipServe + "api/comissions/config/companies",
  },
  cargosEmpresaUrl: {
    url: ipServe + "api/comissions/config/company-positions",
  },
  storeSizeUrl: {
    url: ipServe + "api/comissions/config/store-size",
  },
  categoriasUrl: {
    url: ipServe + "api/comissions/config/parameter-categories",
  },
  configuracionesComisionesUrl: {
    url: ipServe + "api/comissions/config/parameters",
  },
  parametrosUrl: {
    url: ipServe + "api/comissions/config/parameters/commission",
  },
  versionesUrl: {
    url: ipServe + "api/comissions/config/versions",
  },
  lineasProductosUrl: {
    url: ipServe + "api/comissions/config/product-lines/commission",
  },
  reglasComisionesUrl: {
    url: ipServe + "api/comissions/config/rules/commission",
  },
  escalasUrl: {
    url: ipServe + "api/comissions/config/variable-scale",
  },
  lineasParametrosUrl: {
    url: ipServe + "api/comissions/config/parameter-lines",
  },
  kpiConfigUrl: {
    url: ipServe + "api/comissions/config/kpi-config",
  },
  extraccionConfigUrl: {
    url: ipServe + "api/configure/etl/data-sources",
  },
  columnasUrl: {
    url: ipServe + "api/configure/etl/data-source-column-configs",
  },
  guardarExtraccionUrl: {
    url: ipServe + "api/configure/etl/extracted-data",
  },
  tablaEnvioUrl: {
    url: ipServe + "api/configure/etl/detail-tables-config/search",
  },
  nominaUrl: {
    url: ipServe + "api/comissions/config/employees",
  },
  calculoComisionesUrl: {
    url: ipServe + "api/commission/calculation/product-compliance",
  },
  productosKpiUrl: {
    url: ipServe + "api/commission/calculation/product-extrategic",
  },
  consolidadoUrl: {
    url:
      ipServe +
      "api/commission/calculation/consolidated-commission-calculation",
  },
  detalleComisionUrl: {
    url: ipServe + "api/commission/calculation/consolidate-data",
  },
  aplicaBonoUrl: {
    url: ipServe + "api/commission/calculation/bonus-summary-by-month-year",
  },
  eatadisticasUrl: {
    url: ipServe + "api/statistics/data",
  },
  eatadisticasCumplimientoUrl: {
    url: ipServe + "api/commission/calculation/summary-by-month-company-region",
  },
  rotacionComisionesUrl: {
    url: ipServe + "api/comissions/config/sales-rotation",
  },
  configuracionTiendaUrl: {
    url: ipServe + "api/store/configuration",
  },
  guardarSizeStoreUrl: {
    url: ipServe + "api/store/store-configuration/batch",
  },
  presupuestoTiendaUrl: {
    url: ipServe + "api/store/ppto",
  },
  monthSizeStoreUrl: {
    url: ipServe + "api/store/advisor-configuration",
  },
  calculoComisionesMarcimexUrl: {
    url: ipServe + "api/commission/advisor/search-commission",
  },

  deleteConsolidadoUrl: {
    url: ipServe + "api/statistics/delete-year-month",
  },
  maestrosStoresUrl: {
    url: ipServe + "api/sellout/masters/store",
  },
  maestrosProductsUrl: {
    url: ipServe + "api/sellout/masters/product",
  },
  extractionsConfigUrl: {
    url: ipServe + "api/sellout/configuration",
  },
  columnsExtraccionSelloutUrl: {
    url: ipServe + "api/sellout/configuration/column/configs",
  },
  storesSicUrl: {
    url: ipServe + "api/stores",
  },
  productsSicUrl: {
    url: ipServe + "api/stores/product-sic",
  },
  sendSelloutUrl: {
    url: ipServe + "api/sellout/configuration/extracted/data",
  },
  consolidatedSelloutUrl: {
    url: ipServe + "api/sellout/consolidated/store",
  },
  matriculacionUrl: {
    url: ipServe + "api/matriculation/templates",
  },
  matriculacionLogsUrl: {
    url: ipServe + "api/matriculation/logs",
  },
  exportarExcelUrl: {
    url: ipServe + "api/export/data/",
  },
  bulkConsolidatedUrl: {
    url: ipServe + "api/sellout/consolidated/batch",
  },
  datosPresupuestoSelloutUrl: {
    url: ipServe + "api/base/sellout/ppto",
  },
  valoresSelloutUrl: {
    url: ipServe + "api/base/sellout/values",
  },
  configuracionCierreUrl: {
    url: ipServe + "api/matriculation/closing/configuration",
  },
  agruparTiendaUrl: {
    url: ipServe + "api/store/grouped-store",
  },
  agruparAsesorUrl: {
    url: ipServe + "api/store/grouped-advisor",
  },
  storeManagerUrl: {
    url: ipServe + "api/store/manager/calculation/search-commission",
  },
  estadisticasComisionesUrl: {
    url: ipServe + "api/statistics/report",
  },
  optionEstadisticasComisionesUrl: {
    url: ipServe + "api/comissions/config/employees/filters",
  },
};
