document.addEventListener("DOMContentLoaded", () => {
  let formulario = document.querySelector("#formulario");
  const mensajeError = document.querySelector("#mensajeError");
  const resultado = document.querySelector("#resultado");
  const listaCalculos = document.querySelector("#listaCalculos");
  const botonRefrescar = document.querySelector("#botonRefrescar");
  const borrarLista = document.querySelector("#borrarLista");

  botonRefrescar.addEventListener("click", () => {
    location.reload();
  });

  borrarLista.addEventListener("click", () => {
    localStorage.clear();
  });

  formulario.addEventListener("submit", empezarCalculo);

  let ultimosCalculos = JSON.parse(
    localStorage.getItem("historialCalculos") || "[]"
  );

  ultimosCalculos.reverse();

  for (const calculo of ultimosCalculos) {
    let li = document.createElement("li");
    li.innerHTML = `
    Monto: $${calculo.plata},
    Tiempo: ${calculo.tiempo} días,
    Ganancia: $${calculo.interesesGanados}`;
    listaCalculos.append(li);
  }

  class Data {
    constructor(plata, tiempo, todoCorrecto) {
      this.plata = plata;
      this.tiempo = tiempo;
      this.todoCorrecto = todoCorrecto;
    }

    calcularPlazo() {
      return this.plata * ((this.tiempo * 0.75) / 365);
    }

    alertarGanancia() {
      let interesesGanados = (
        Math.round(this.calcularPlazo() * 100) / 100
      ).toFixed(2);

      resultado.innerHTML = `Intereses recibidos en ${this.tiempo} días son ${interesesGanados} pesos`;

      this.guardar(interesesGanados);
    }

    guardar(interesesGanados) {
      ultimosCalculos.push({
        plata: this.plata,
        tiempo: this.tiempo,
        interesesGanados: interesesGanados,
      });

      localStorage.setItem(
        "historialCalculos",
        JSON.stringify(ultimosCalculos)
      );
    }
  }

  function empezarCalculo(e) {
    const dataUsuario = new Data(0, 0, false);

    e.preventDefault();

    let data = e.target;
    console.log(data.children[1].children[1].value);

    if (
      data.children[1].children[1].value < 1000 ||
      data.children[2].children[1].value < 30
    ) {
      mensajeError.innerHTML = "Por favor ingrese los datos correctamente";
    } else {
      dataUsuario.plata = data.children[1].children[1].value;
      dataUsuario.tiempo = data.children[2].children[1].value;
      dataUsuario.todoCorrecto = true;
      mensajeError.innerHTML = "";
      data.children[1].children[1].value = "";
      data.children[2].children[1].value = "";
    }

    if (dataUsuario.todoCorrecto) {
      dataUsuario.alertarGanancia();
    }
  }
});
