// Coordenadas de la diagonal a1-h8 (fila 0-7, columna 0-7)
// a1 = (7,0), b2=(6,1), c3=(5,2), d4=(4,3), e5=(3,4), f6=(2,5), g7=(1,6), h8=(0,7)
const diagonal = [
    { fila: 7, col: 0, nombre: "a1" }, // 0
    { fila: 6, col: 1, nombre: "b2" }, // 1
    { fila: 5, col: 2, nombre: "c3" }, // 2
    { fila: 4, col: 3, nombre: "d4" }, // 3
    { fila: 3, col: 4, nombre: "e5" }, // 4
    { fila: 2, col: 5, nombre: "f6" }, // 5
    { fila: 1, col: 6, nombre: "g7" }, // 6
    { fila: 0, col: 7, nombre: "h8" }  // 7
];

// Estado de las 8 posiciones de la diagonal
let estadoDiagonal = ["B", "B", "B", ".", ".", "N", "N", "N"];
let seleccionada = null; // índice en la diagonal (0-7)

// Crear el tablero visual 8x8
function crearTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");

            // Color de casilla
            if ((fila + col) % 2 === 0) {
                casilla.classList.add("clara");
            } else {
                casilla.classList.add("oscura");
            }

            // ¿Pertenece a la diagonal?
            const indiceDiag = diagonal.findIndex(d => d.fila === fila && d.col === col);
            if (indiceDiag !== -1) {
                casilla.classList.add("diagonal");
                casilla.dataset.indice = indiceDiag;

                // Pieza
                const pieza = estadoDiagonal[indiceDiag];
                if (pieza === "B") {
                    const span = document.createElement("span");
                    span.className = "pieza blanco";
                    span.textContent = "♙";
                    casilla.appendChild(span);
                } else if (pieza === "N") {
                    const span = document.createElement("span");
                    span.className = "pieza negro";
                    span.textContent = "♟";
                    casilla.appendChild(span);
                }

                // Evento de clic solo en la diagonal
                casilla.addEventListener("click", () => clicDiagonal(indiceDiag));
            }

            contenedor.appendChild(casilla);
        }
    }

    // Marcar selección y movimientos posibles
    if (seleccionada !== null) {
        const casillaSel = document.querySelector(`[data-indice="${seleccionada}"]`);
        if (casillaSel) casillaSel.classList.add("seleccionada");

        const posibles = obtenerMovimientosPosibles(seleccionada);
        posibles.forEach(i => {
            const c = document.querySelector(`[data-indice="${i}"]`);
            if (c) c.classList.add("posible");
        });
    }
}

function obtenerMovimientosPosibles(origen) {
    const posibles = [];
    const pieza = estadoDiagonal[origen];
    if (pieza === ".") return posibles;

    // Deslizar hacia índices mayores
    for (let i = origen + 1; i < 8; i++) {
        if (estadoDiagonal[i] === ".") {
            posibles.push(i);
        } else {
            break;
        }
    }

    // Deslizar hacia índices menores
    for (let i = origen - 1; i >= 0; i--) {
        if (estadoDiagonal[i] === ".") {
            posibles.push(i);
        } else {
            break;
        }
    }

    // Saltar hacia adelante
    if (origen + 2 < 8) {
        const medio = estadoDiagonal[origen + 1];
        const destino = estadoDiagonal[origen + 2];
        if (medio !== "." && medio !== pieza && destino === ".") {
            posibles.push(origen + 2);
        }
    }

    // Saltar hacia atrás
    if (origen - 2 >= 0) {
        const medio = estadoDiagonal[origen - 1];
        const destino = estadoDiagonal[origen - 2];
        if (medio !== "." && medio !== pieza && destino === ".") {
            posibles.push(origen - 2);
        }
    }

    return posibles;
}

function clicDiagonal(indice) {
    const pieza = estadoDiagonal[indice];

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
                // Mover
                estadoDiagonal[indice] = estadoDiagonal[seleccionada];
                estadoDiagonal[seleccionada] = ".";
                seleccionada = null;

                if (haGanado()) {
                    document.getElementById("mensaje").textContent = "¡Has ganado! 🎉";
                }
            } else if (pieza !== ".") {
                seleccionada = indice;
            } else {
                seleccionada = null;
            }
        }
    }

    crearTablero();
}

function haGanado() {
    const objetivo = ["N", "N", "N", ".", ".", "B", "B", "B"];
    return estadoDiagonal.every((p, i) => p === objetivo[i]);
}

document.getElementById("btnReiniciar").addEventListener("click", () => {
    estadoDiagonal = ["B", "B", "B", ".", ".", "N", "N", "N"];
    seleccionada = null;
    document.getElementById("mensaje").textContent = "";
    crearTablero();
});

// Iniciar
crearTablero();

// Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => console.log("Service Worker registrado"))
            .catch(err => console.log("Error SW:", err));
    });
}
