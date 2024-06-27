document.addEventListener('DOMContentLoaded', () => {
    const queueElement = document.getElementById('queue');
    const arrivalRateInput = document.getElementById('arrivalRate');
    const serviceRateInput = document.getElementById('serviceRate');
    const maxQueueLengthInput = document.getElementById('maxQueueLength');
    const maxWaitTimeInput = document.getElementById('maxWaitTime');
    const averageQueueLengthElement = document.getElementById('averageQueueLength');
    const averageWaitTimeElement = document.getElementById('averageWaitTime');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const ctx = document.getElementById('queueLengthChart').getContext('2d');

    let queue = [];
    let lastArrivalTime = Date.now();
    let lastServiceTime = Date.now();
    let queueLengths = [];
    let waitTimes = [];
    let isPaused = false;
    let startTime = Date.now();

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Longitud de la cola',
                data: queueLengths,
                borderColor: 'blue',
                fill: false
            }]
        },
        options: {
            scales: {
                x: { 
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function addPersonToQueue() {
        if (queue.length < parseInt(maxQueueLengthInput.value)) {
            const person = document.createElement('div');
            person.classList.add('person');
            person.arrivalTime = Date.now();
            queueElement.appendChild(person);
            queue.push(person);
        }
    }

    function removePersonFromQueue() {
        if (queue.length > 0) {
            const person = queue.shift();
            const waitTime = (Date.now() - person.arrivalTime) / 1000;
            waitTimes.push(waitTime);
            queueElement.removeChild(person);
        }
    }

    function updateQueue() {
        if (isPaused) return;

        const arrivalRate = parseFloat(arrivalRateInput.value);
        const serviceRate = parseFloat(serviceRateInput.value);
        const maxWaitTime = parseInt(maxWaitTimeInput.value);

        const currentTime = Date.now();

        if (currentTime - lastArrivalTime >= 1000 / arrivalRate) {
            addPersonToQueue();
            lastArrivalTime = currentTime;
        }

        if (currentTime - lastServiceTime >= 1000 / serviceRate) {
            removePersonFromQueue();
            lastServiceTime = currentTime;
        }

        queue = queue.filter(person => {
            if ((currentTime - person.arrivalTime) / 1000 > maxWaitTime) {
                queueElement.removeChild(person);
                return false;
            }
            return true;
        });

        queueLengths.push(queue.length);
        chart.data.labels.push((currentTime - startTime) / 1000);
        chart.update();

        if (queueLengths.length > 100) {
            queueLengths.shift();
            chart.data.labels.shift();
        }

        const averageQueueLength = queueLengths.reduce((a, b) => a + b, 0) / queueLengths.length;
        const averageWaitTime = waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length || 0;

        averageQueueLengthElement.textContent = averageQueueLength.toFixed(2);
        averageWaitTimeElement.textContent = averageWaitTime.toFixed(2);

        requestAnimationFrame(updateQueue);
    }

    function resetSimulation() {
        isPaused = true;
        queue.forEach(person => queueElement.removeChild(person));
        queue = [];
        queueLengths = [];
        waitTimes = [];
        chart.data.labels = [];
        chart.data.datasets[0].data = [];
        averageQueueLengthElement.textContent = '0';
        averageWaitTimeElement.textContent = '0';
        startTime = Date.now();
        isPaused = false;
        updateQueue();
    }

    pauseButton.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseButton.textContent = isPaused ? 'Reanudar' : 'Pausar';
        if (!isPaused) updateQueue();
    });

    resetButton.addEventListener('click', resetSimulation);

    updateQueue();
});
