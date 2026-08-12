// Diagonal a1 → h8
// índice 0 = a1, 1 = b2, 2 = c3, 3 = d4, 4 = e5, 5 = f6, 6 = g7, 7 = h8
const diagonal = [
    { fila: 7, col: 0, nombre: "a1" },
    { fila: 6, col: 1, nombre: "b2" },
    { fila: 5, col: 2, nombre: "c3" },
    { fila: 4, col: 3, nombre: "d4" },
    { fila: 3, col: 4, nombre: "e5" },
    { fila: 2, col: 5, nombre: "f6" },
    { fila: 1, col: 6, nombre: "g7" },
    { fila: 0, col: 7, nombre: "h8" }
];

let estadoDiagonal = ["B", "B", "B", ".", ".", "N", "N", "N"];
let seleccionada = null;

function crearTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");

            if ((fila + col) % 2 === 0) {
                casilla.classList.add("clara");
            } else {
                casilla.classList.add("oscura");
            }

            const indiceDiag = diagonal.findIndex(d => d.fila === fila && d.col === col);
            if (indiceDiag !== -1) {
                casilla.classList.add("diagonal");
                casilla.dataset.indice = indiceDiag;

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

                casilla.addEventListener("click", () => clicDiagonal(indiceDiag));
            }

            contenedor.appendChild(casilla);
        }
    }

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

    // ===== BLANCOS solo avanzan hacia índices mayores (hacia h8) =====
    if (pieza === "B") {
        // Deslizar hacia adelante
        for (let i = origen + 1; i < 8; i++) {
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
            if (medio !== "." && medio !== "B" && destino === ".") {
                posibles.push(origen + 2);
            }
        }
    }

    // ===== NEGROS solo avanzan hacia índices menores (hacia a1) =====
    if (pieza === "N") {
        // Deslizar hacia adelante (hacia a1)
        for (let i = origen - 1; i >= 0; i--) {
            if (estadoDiagonal[i] === ".") {
                posibles.push(i);
            } else {
                break;
            }
        }
        // Saltar hacia adelante
        if (origen - 2 >= 0) {
            const medio = estadoDiagonal[origen - 1];
            const destino = estadoDiagonal[origen - 2];
            if (medio !== "." && medio !== "N" && destino === ".") {
                posibles.push(origen - 2);
            }
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

crearTablero();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => console.log("Service Worker registrado"))
            .catch(err => console.log("Error SW:", err));
    });
}
