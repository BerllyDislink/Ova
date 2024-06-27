// calculator.js
document.getElementById('calculator-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const arrivalRate = parseFloat(document.getElementById('arrivalRate').value);
    const serviceRate = parseFloat(document.getElementById('serviceRate').value);
    const servers = parseInt(document.getElementById('servers').value);

    // Cálculos de métricas
    const utilization = arrivalRate / (servers * serviceRate);
    const avgTimeInSystem = 1 / (serviceRate - arrivalRate);
    const avgTimeInQueue = utilization * avgTimeInSystem;

    // Mostrar resultados
    document.getElementById('calculator-result').innerHTML = `
        <p>Utilización: ${utilization.toFixed(2)}</p>
        <p>Tiempo promedio en el sistema: ${avgTimeInSystem.toFixed(2)} unidades de tiempo</p>
        <p>Tiempo promedio en la cola: ${avgTimeInQueue.toFixed(2)} unidades de tiempo</p>
    `;
});
