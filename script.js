// Nombres de las casillas
const nombresCasillas = ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"];

// Posición inicial
let tablero = ["B", "B", "B", ".", ".", "N", "N", "N"];
let seleccionada = null;

// Dibujar el tablero
function dibujarTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    tablero.forEach((pieza, indice) => {
        const casilla = document.createElement("div");
        casilla.classList.add("casilla");
        casilla.dataset.indice = indice;

        const nombre = document.createElement("div");
        nombre.classList.add("nombre");
        nombre.textContent = nombresCasillas[indice];
        casilla.appendChild(nombre);

        const piezaDiv = document.createElement("div");
        piezaDiv.classList.add("pieza");

        if (pieza === "B") {
            piezaDiv.textContent = "♙";
            piezaDiv.classList.add("blanco");
        } else if (pieza === "N") {
            piezaDiv.textContent = "♟";
            piezaDiv.classList.add("negro");
        } else {
            piezaDiv.textContent = "·";
            piezaDiv.classList.add("vacio");
        }

        casilla.appendChild(piezaDiv);

        if (seleccionada === indice) {
            casilla.classList.add("seleccionada");
        }

        casilla.addEventListener("click", () => clicCasilla(indice));
        contenedor.appendChild(casilla);
    });

    if (seleccionada !== null) {
        const posibles = obtenerMovimientosPosibles(seleccionada);
        posibles.forEach(i => {
            const casilla = document.querySelector(`[data-indice="${i}"]`);
            if (casilla) casilla.classList.add("posible");
        });
    }
}

function obtenerMovimientosPosibles(origen) {
    const posibles = [];
    const pieza = tablero[origen];
    if (pieza === ".") return posibles;

    // Deslizar derecha
    for (let i = origen + 1; i < 8; i++) {
        if (tablero[i] === ".") {
            posibles.push(i);
        } else {
            break;
        }
    }

    // Deslizar izquierda
    for (let i = origen - 1; i >= 0; i--) {
        if (tablero[i] === ".") {
            posibles.push(i);
        } else {
            break;
        }
    }

    // Saltar derecha
    if (origen + 2 < 8) {
        const medio = tablero[origen + 1];
        const destino = tablero[origen + 2];
        if (medio !== "." && medio !== pieza && destino === ".") {
            posibles.push(origen + 2);
        }
    }

    // Saltar izquierda
    if (origen - 2 >= 0) {
        const medio = tablero[origen - 1];
        const destino = tablero[origen - 2];
        if (medio !== "." && medio !== pieza && destino === ".") {
            posibles.push(origen - 2);
        }
    }

    return posibles;
}

function clicCasilla(indice) {
    const pieza = tablero[indice];

    if (seleccionada === null) {
        if (pieza !== ".") {
            seleccionada = indice;
            document.getElementById("mensaje").textContent = "";
        }
    } else {
        if (seleccionada === indice) {
            seleccionada = null;
        } else {
            const posibles = obtenerMovimientosPosibles(seleccionada);
            if (posibles.includes(indice)) {
                tablero[indice] = tablero[seleccionada];
                tablero[seleccionada] = ".";
                seleccionada = null;

                if (haGanado()) {
                    document.getElementById("mensaje").textContent = "¡Has ganado! 🎉";
                }
            } else {
                if (pieza !== ".") {
                    seleccionada = indice;
                } else {
                    seleccionada = null;
                }
            }
        }
    }

    dibujarTablero();
}

function haGanado() {
    const objetivo = ["N", "N", "N", ".", ".", "B", "B", "B"];
    return tablero.every((pieza, i) => pieza === objetivo[i]);
}

document.getElementById("btnReiniciar").addEventListener("click", () => {
    tablero = ["B", "B", "B", ".", ".", "N", "N", "N"];
    seleccionada = null;
    document.getElementById("mensaje").textContent = "";
    dibujarTablero();
});

// Iniciar el juego
dibujarTablero();

// ========== SERVICE WORKER ==========
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => console.log("Service Worker registrado"))
            .catch(err => console.log("Error al registrar SW:", err));
    });
}
