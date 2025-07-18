export const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  y: {
    type: 'value',
    position: 'right',
    axis: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
}

export const hBarOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  barThickness: 25,
  borderRadius: 5,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      grid: {
        display: false,
      },
    },
    x: {
      grid: {
        display: true,
        drawBorder: false,
        borderDash: [5, 5], // Dash pattern [length of dash, length of gap]
        color: 'rgba(0, 0, 0, 0.1)', // Optional: set line color
        zeroLineBorderDash: [5, 5], // Make zero line dashed too
        zeroLineColor: 'rgba(0, 0, 0, 0.1)', // Optional: zero line color
      },
    },
  },
}

export const vBarOptions: any = {
  responsive: true,
  maintainAspectRatio: false,
  borderRadius: 5,
  barThickness: 40,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
  },
}
