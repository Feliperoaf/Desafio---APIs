const resultado = document.querySelector("#result");
const monto = document.querySelector("#monto");
const moneda = document.querySelector("#moneda");
const valor = document.querySelector("#valor");

const getData = async () => {
    const url = 'https://mindicador.cl/api/' + moneda.value;
    const res = await fetch(url);
    const datas = await res.json();
    return datas.serie.slice(0, 7);
};

const setData = async () => {
    if (!monto.value || !moneda.value) {
        resultado.innerHTML = "Por favor, completa todos los campos";
        return;
    }
    try {
        const shortData = await getData();
        const conversion = monto.value / shortData[0].valor;
        renderConversion(conversion);
        renderValor(shortData);
        newChart();
    } catch (error) {
        resultado.innerHTML = "Hubo un error al obtener los datos";
    }
};

async function getDataForChart() {
    const data = await getData();
    const labels = data.map(item => new Date(item.fecha).toLocaleDateString());
    const values = data.map(item => item.valor);
    return { labels, values };
}

async function newChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const { labels, values } = await getDataForChart();

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Variación última semana',
                data: values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1,
                responsive: true,
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

const clickButton = document.querySelector("#boton");
clickButton.addEventListener('click', setData);

const renderConversion = (conversion) => {
    resultado.innerHTML = conversion.toFixed(2);
};

const renderValor = (shortData) => {
    const html = /*html*/`
        <p>El valor al día de hoy es de $${shortData[0].valor.toFixed(2)}</p>
    `;
    valor.innerHTML = html;
};