/* =============================================
   FLEXY ADMIN — charts.js
   Requires ApexCharts  (cdn.jsdelivr.net/npm/apexcharts)
   ============================================= */

'use strict';

/* ── Shared palette pulled from CSS vars ── */
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const C = {
  primary:   '#5d87ff',
  secondary: '#49beff',
  success:   '#13deb9',
  warning:   '#ffae1f',
  danger:    '#fa896b',
  info:      '#539bff',
  muted:     '#7c8fac',
  border:    '#e5eaef',
  dark:      '#2a3547',
  gridColor: 'rgba(0,0,0,.05)',
  fontFamily: "'Plus Jakarta Sans', sans-serif",
};

const MONTHS  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const QUARTERS = ['Q1 2023','Q2 2023','Q3 2023','Q4 2023','Q1 2024','Q2 2024'];

/* ── Shared defaults ── */
const baseChart = {
  fontFamily: C.fontFamily,
  foreColor:  C.muted,
  toolbar:    { show: true, tools: { download: true, selection: false, zoom: false, zoomin: false, zoomout: false, pan: false, reset: false } },
};

const baseGrid = {
  borderColor: C.gridColor,
  strokeDashArray: 4,
  xaxis: { lines: { show: false } },
  yaxis: { lines: { show: true } },
};

const baseLegend = {
  position: 'top',
  horizontalAlign: 'right',
  fontSize: '13px',
  fontFamily: C.fontFamily,
  fontWeight: 600,
  markers: { radius: 6, width: 10, height: 10 },
  itemMargin: { horizontal: 12 },
};

const baseTooltip = {
  theme: 'light',
  style: { fontSize: '13px', fontFamily: C.fontFamily },
};

/* ──────────────────────────────────────────────
   DASHBOARD CHARTS
   ────────────────────────────────────────────── */

/* 1. Sales Overview (Line) */
(function salesChart() {
  const el = document.getElementById('salesChart');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'line', height: 320, animations: { enabled: true, easing: 'easeinout', speed: 800 } },
    series: [
      { name: 'Ample Admin',  data: [38000, 42000, 38500, 51000, 47500, 60000, 55000, 67000, 62000, 71000, 69000, 80000] },
      { name: 'Pixel Admin',  data: [28000, 30500, 31000, 33000, 36000, 38500, 41000, 44000, 46500, 52000, 54000, 58000] },
    ],
    xaxis: { categories: MONTHS, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { fontFamily: C.fontFamily, fontSize: '12px' } } },
    yaxis: { labels: { formatter: v => '$' + (v/1000).toFixed(0) + 'k', style: { fontFamily: C.fontFamily } } },
    colors: [C.primary, C.secondary],
    stroke: { curve: 'smooth', width: [3, 2.5] },
    grid: baseGrid,
    legend: baseLegend,
    tooltip: { ...baseTooltip, y: { formatter: v => '$' + v.toLocaleString() } },
    markers: { size: 4, strokeWidth: 2, hover: { size: 6 } },
  }).render();
})();

/* 2. Weekly Stats (Bar — sparkline-like) */
(function weeklyChart() {
  const el = document.getElementById('weeklyChart');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'bar', height: 260, sparkline: { enabled: false } },
    series: [
      { name: 'Revenue', data: [1200, 1900, 1500, 2100, 1800, 2400, 2000] },
      { name: 'Expenses', data: [900, 1200, 1100, 1400, 1300, 1600, 1400] },
    ],
    xaxis: { categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    colors: [C.primary, C.secondary],
    plotOptions: { bar: { columnWidth: '55%', borderRadius: 4 } },
    grid: { ...baseGrid, yaxis: { lines: { show: false } } },
    legend: { ...baseLegend, position: 'bottom', horizontalAlign: 'center' },
    tooltip: { ...baseTooltip, y: { formatter: v => '$' + v.toLocaleString() } },
    dataLabels: { enabled: false },
  }).render();
})();

/* 3. Traffic Sources (Donut) */
(function trafficChart() {
  const el = document.getElementById('trafficChart');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'donut', height: 280 },
    series: [38, 24, 20, 12, 6],
    labels: ['Organic Search','Direct','Social','Referral','Other'],
    colors: [C.primary, C.secondary, C.success, C.warning, C.danger],
    legend: { ...baseLegend, position: 'bottom', horizontalAlign: 'center' },
    dataLabels: { enabled: true, style: { fontFamily: C.fontFamily, fontSize: '12px' } },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              fontSize: '13px',
              fontFamily: C.fontFamily,
              fontWeight: 700,
              color: C.dark,
              formatter: () => '100%',
            },
          },
        },
      },
    },
    tooltip: baseTooltip,
  }).render();
})();

/* 4. Revenue Overview (Area) — if exists */
(function revenueAreaChart() {
  const el = document.getElementById('revenueChart');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'area', height: 200, sparkline: { enabled: false } },
    series: [{ name: 'Revenue', data: [31, 40, 28, 51, 42, 82, 56, 65, 74, 61, 81, 90] }],
    xaxis: { categories: MONTHS, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: v => '$' + v + 'k' } },
    colors: [C.primary],
    fill: { type: 'gradient', gradient: { opacityFrom: .35, opacityTo: .02 } },
    stroke: { curve: 'smooth', width: 2.5 },
    grid: baseGrid,
    dataLabels: { enabled: false },
    tooltip: baseTooltip,
  }).render();
})();

/* ──────────────────────────────────────────────
   CHARTS PAGE
   ────────────────────────────────────────────── */

/* 5. Line Chart Main */
(function lineChartMain() {
  const el = document.getElementById('lineChartMain');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'line', height: 360, animations: { enabled: true, easing: 'easeinout', speed: 900 } },
    series: [
      { name: 'Revenue',  data: [44000, 55000, 57000, 56000, 61000, 58000, 63000, 70000, 68000, 75000, 72000, 88000] },
      { name: 'Expenses', data: [31000, 38000, 35000, 42000, 38000, 45000, 40000, 48000, 43000, 51000, 46000, 53000] },
    ],
    xaxis: { categories: MONTHS, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: v => '$' + (v/1000).toFixed(0) + 'k', style: { fontFamily: C.fontFamily } } },
    colors: [C.primary, C.danger],
    stroke: { curve: 'smooth', width: [3, 2.5] },
    grid: baseGrid,
    legend: baseLegend,
    tooltip: { ...baseTooltip, y: { formatter: v => '$' + v.toLocaleString() } },
    markers: { size: 4, strokeWidth: 2, hover: { size: 7 } },
    dataLabels: { enabled: false },
  }).render();
})();

/* 6. Area Chart Main */
(function areaChartMain() {
  const el = document.getElementById('areaChartMain');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'area', height: 360 },
    series: [
      { name: 'Users',    data: [31, 40, 28, 51, 42, 82, 56, 74, 66, 80, 85, 100] },
      { name: 'Sessions', data: [11, 32, 45, 32, 34, 52, 41, 60, 52, 65, 70, 82] },
    ],
    xaxis: { categories: MONTHS, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { style: { fontFamily: C.fontFamily } } },
    colors: [C.primary, C.success],
    fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.02 } },
    stroke: { curve: 'smooth', width: [2.5, 2.5] },
    grid: baseGrid,
    legend: baseLegend,
    tooltip: baseTooltip,
    dataLabels: { enabled: false },
  }).render();
})();

/* 7. Bar Chart Main */
(function barChartMain() {
  const el = document.getElementById('barChartMain');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'bar', height: 360 },
    series: [
      { name: 'Product A', data: [44, 55, 57, 56, 61, 58] },
      { name: 'Product B', data: [76, 85, 101, 98, 87, 105] },
      { name: 'Product C', data: [35, 41, 36, 26, 45, 48] },
    ],
    xaxis: { categories: QUARTERS, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { labels: { formatter: v => '$' + v + 'k', style: { fontFamily: C.fontFamily } } },
    colors: [C.primary, C.success, C.warning],
    plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 5 } },
    grid: baseGrid,
    legend: baseLegend,
    tooltip: { ...baseTooltip, y: { formatter: v => '$' + v + 'k' } },
    dataLabels: { enabled: false },
  }).render();
})();

/* 8. Pie Chart Main */
(function pieChartMain() {
  const el = document.getElementById('pieChartMain');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'pie', height: 340 },
    series: [44, 25, 18, 13],
    labels: ['Electronics', 'Clothing', 'Furniture', 'Books'],
    colors: [C.primary, C.success, C.warning, C.danger],
    legend: { ...baseLegend, position: 'bottom', horizontalAlign: 'center' },
    dataLabels: { style: { fontFamily: C.fontFamily, fontSize: '12px', fontWeight: '600' } },
    tooltip: baseTooltip,
    stroke: { width: 0 },
    plotOptions: { pie: { expandOnClick: true } },
  }).render();
})();

/* 9. Radial Bar Chart Main */
(function radialChartMain() {
  const el = document.getElementById('radialChartMain');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'radialBar', height: 340 },
    series: [75, 60, 85, 50],
    labels: ['Revenue', 'Orders', 'Customers', 'Growth'],
    colors: [C.primary, C.success, C.warning, C.danger],
    plotOptions: {
      radialBar: {
        hollow: { size: '20%' },
        track: { background: '#f2f6fa', strokeWidth: '97%' },
        dataLabels: {
          name: { fontSize: '13px', fontFamily: C.fontFamily, fontWeight: 600 },
          value: { fontSize: '14px', fontFamily: C.fontFamily, fontWeight: 700 },
          total: {
            show: true,
            label: 'Overall',
            fontSize: '13px',
            fontFamily: C.fontFamily,
            fontWeight: 700,
            color: C.dark,
            formatter: () => '67%',
          },
        },
      },
    },
    legend: { ...baseLegend, position: 'bottom', horizontalAlign: 'center' },
    tooltip: baseTooltip,
  }).render();
})();

/* 10. Radar Chart Main */
(function radarChartMain() {
  const el = document.getElementById('radarChartMain');
  if (!el) return;

  new ApexCharts(el, {
    chart: { ...baseChart, type: 'radar', height: 380 },
    series: [
      { name: 'Product Alpha', data: [80, 50, 30, 40, 100, 20] },
      { name: 'Product Beta',  data: [20, 30, 40, 80, 20, 80] },
    ],
    xaxis: { categories: ['Speed','Reliability','Design','Support','Price','Updates'] },
    colors: [C.primary, C.warning],
    fill: { opacity: 0.18 },
    stroke: { width: 2.5 },
    markers: { size: 4 },
    yaxis: { show: false },
    legend: { ...baseLegend, position: 'top', horizontalAlign: 'center' },
    tooltip: baseTooltip,
    dataLabels: { enabled: true, style: { fontSize: '11px', fontFamily: C.fontFamily } },
  }).render();
})();