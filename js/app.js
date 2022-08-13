const slcCriptomonedas = document.querySelector('#criptomonedas');
const slcMoneda = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', () => {
    consularCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    slcMoneda.addEventListener('change', leerValor);
    slcCriptomonedas.addEventListener('change', leerValor);
});


function submitFormulario(e) {
    e.preventDefault();

    // Validar 
    const { moneda, criptomoneda } = objBusqueda;
    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos casos son obligatorios');
        return;
    }

    // Consultar resultados de api
    consultarApi();
}

function consultarApi() {
    const { moneda, criptomoneda } = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            // Se usa una consulta dinamica por la forma en que esta creada la api
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionHTML(cotizacion) {

    // Limpiar html
    limpiarHtml();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del dia <span>${HIGHDAY}</span></p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del dia <span>${LOWDAY}</span></p>`

    const variacion = document.createElement('p');
    variacion.innerHTML = `<p>Variacion en las ultimas 25 horas: <span>${CHANGEPCT24HOUR}%</span></p>`

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Actualizado hace: <span>${LASTUPDATE}</span></p>`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(variacion);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarAlerta(mensaje) {

    if (!document.querySelector('.error')) {

        const alerta = document.createElement('p');
        alerta.textContent = mensaje;
        alerta.classList.add('error');

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

function consularCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => obtenerCriptomonedas(datos.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {

    criptomonedas.forEach(criptomoneda => {
        const { FullName, Name } = criptomoneda.CoinInfo;
        const option = document.createElement('option');

        option.value = Name;
        option.textContent = FullName;
        slcCriptomonedas.appendChild(option);
    });

}

function leerValor(e) {

    // Se usa e para seleccionar por el target name
    // De lo contrario no se podrian seleccionar dinamicamente
    objBusqueda[e.target.name] = e.target.value;
}

function limpiarHtml() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHtml()

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML =
        `<div class="cube1"></div>
        <div class="cube2"></div>`

    resultado.appendChild(spinner);
}