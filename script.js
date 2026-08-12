// Nombres de las casillas
const nombresCasillas = ["a1", "b2", "c3", "d4", "e5", "f6", "g7", "h8"];

// Posición inicial
let tablero = ["B", "B", "B", ".", ".", "N", "N", "N"];
let seleccionada = null; // índice de la pieza seleccionada

// Dibujar el tablero
function dibujarTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    tablero.forEach((pieza, indice) => {
        const casilla = document.createElement("div");
        casilla.classList.add("casilla");
        casilla.dataset.indice = indice;

        // Nombre de la casilla
        const nombre = document.createElement("div");
        nombre.classList.add("nombre");
        nombre.textContent = nombresCasillas[indice];
        casilla.appendChild(nombre);

        // Pieza
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

        // Marcar si está seleccionada
        if (seleccionada === indice) {
            casilla.classList.add("seleccionada");
        }

        // Evento de clic
        casilla.addEventListener("click", () => clicCasilla(indice));

        contenedor.appendChild(casilla);
    });

    // Marcar movimientos posibles
    if (seleccionada !== null) {
        const posibles = obtenerMovimientosPosibles(seleccionada);
        posibles.forEach(i => {
            const casilla = document.querySelector(`[data-indice="${i}"]`);
            if (casilla) casilla.classList.add("posible");
        });
    }
}

// Obtener movimientos posibles de una pieza
function obtenerMovimientosPosibles(origen) {
    const posibles = [];
    const pieza = tablero[origen];
    if (pieza === ".") return posibles;

    // 1. Deslizar hacia la derecha
    for (let i = origen + 1; i < 8; i++) {
        if (tablero[i] === ".") {
            posibles.push(i);
        } else {
            break; // camino bloqueado
        }
    }

    // 2. Deslizar hacia la izquierda
    for (let i = origen - 1; i >= 0; i--) {
        if (tablero[i] === ".") {
            posibles.push(i);
        } else {
            break;
        }
    }

    // 3. Saltar hacia la derecha (sobre pieza del color contrario)
    if (origen + 2 < 8) {
        const medio = tablero[origen + 1];
        const destino = tablero[origen + 2];
        if (medio !== "." && medio !== pieza && destino === ".") {
            posibles.push(origen + 2);
        }
    }

    // 4. Saltar hacia la izquierda
    if (origen - 2 >= 0) {
        const medio = tablero[origen - 1];
        const destino = tablero[origen - 2];
        if (medio !== "." && medio !== pieza && destino === ".") {
            posibles.push(origen - 2);
        }
    }

    return posibles;
}

// Cuando se hace clic en una casilla
function clicCasilla(indice) {
    const pieza = tablero[indice];

    // Si no hay nada seleccionado
    if (seleccionada === null) {
        if (pieza !== ".") {
            seleccionada = indice;
            document.getElementById("mensaje").textContent = "";
        }
    }
    // Si ya hay una pieza seleccionada
    else {
        // Si hago clic en la misma, deseleccionar
        if (seleccionada === indice) {
            seleccionada = null;
        }
        // Si hago clic en un destino posible → mover
        else {
            const posibles = obtenerMovimientosPosibles(seleccionada);
            if (posibles.includes(indice)) {
                // Realizar el movimiento
                tablero[indice] = tablero[seleccionada];
                tablero[seleccionada] = ".";
                seleccionada = null;

                // Comprobar si se ha ganado
                if (haGanado()) {
                    document.getElementById("mensaje").textContent = "¡Has ganado! 🎉";
                }
            } else {
                // Si hago clic en otra pieza propia, cambiar selección
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

// Comprobar victoria
function haGanado() {
    const objetivo = ["N", "N", "N", ".", ".", "B", "B", "B"];
    return tablero.every((pieza, i) => pieza === objetivo[i]);
}

// Botón reiniciar
document.getElementById("btnReiniciar").addEventListener("click", () => {
    tablero = ["B", "B", "B", ".", ".", "N", "N", "N"];
    seleccionada = null;
    document.getElementById("mensaje").textContent = "";
    dibujarTablero();
});

// Iniciar
dibujarTablero();
