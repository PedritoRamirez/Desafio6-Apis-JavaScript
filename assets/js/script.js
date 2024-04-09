const input = document.querySelector(".entrada");
const select = document.querySelector(".select");
const button = document.querySelector(".buscar");
const span = document.querySelector(".resultado");
const canvas = document.querySelector(".grafico");
const url = "https://mindicador.cl/api";
let miCaracter = null;

const formatoDeFecha = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${day}/${month}/${year}`
}

function renderGrafico(dato){
  try {
    console.log(dato);
    const config = {
      type: "line",
      data: {
      labels: dato.map((elem) => formatoDeFecha(new Date(elem.fecha))),
      datasets: [{
      label: "Ultimos 10 dias",
      backgroundColor: "red",
      data: dato.map((ele) => ele.valor),
      }]
      }
    }
    canvas.style.backgroundColor="yellow";
    if(miCaracter){
      miCaracter.destroy();
    }
    miCaracter = new Chart(canvas,config);
  } catch (error) {
      console.log(error)
      span.innerHTML = "<h2>¡¡¡ Hay Problemas para Graficar !!!</h2>"
  }
}

async function buscarCotizacion() {
  try {
    const moneda = select.value;
    const fetching = await fetch(`${url}/${moneda}`);
    const data = await fetching.json();
    return data;
  } catch (error) {
    console.log(error);
    span.innerHTML = "<h2>¡¡¡ Ups hay un problema !!!</h2>"
  }
}
button.addEventListener("click", async () => {
  try {
      const moneda = select.value;    
      const cantidad = input.value;
      const result = await buscarCotizacion();
      const serie = result.serie;
      const lastValue = serie[0].valor;
      const dato = serie.slice(0,10).reverse();
      let resultado = (Number(cantidad)/Number(lastValue)).toFixed(2);
      span.innerHTML = `<h4>Los ${cantidad} pesos cotizados al dia son: $ ${resultado} ${moneda} </h4>` 
      renderGrafico(dato);
  } catch (error) {
      console.log(error);
      span.innerHTML = "<h2>¡¡ Lo sentimos hay un problema !!</h2>"
  }
});
