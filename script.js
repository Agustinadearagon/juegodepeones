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
let animando = false;

// Secuencia de solución (origen → destino)
const solucion = [
    [2, 3], // B avanza
    [5, 4], // N avanza
    [3, 5], // B salta
    [1, 3], // B avanza
    [4, 2], // N salta
    [6, 4], // N avanza
    [3, 6], // B salta
    [5, 7], // B avanza
    [4, 5], // N avanza
    [2, 4], // N salta
    [0, 2], // N avanza
    [6, 5], // B avanza
    [7, 6], // B avanza
    [5, 7], // B avanza (llega)
    [4, 3], // N avanza
    [2, 4], // N salta
    [3, 2], // N avanza
    [4, 3], // N avanza
    [1, 0], // (ajustes finales si hace falta)
];

function crearTablero() {
    const contenedor = document.getElementById("tablero");
    contenedor.innerHTML = "";

    for (let fila = 0; fila < 8; fila++) {
        for (let col = 0; col < 8; col++) {
            const casilla = document.createElement("div");
            casilla.classList.add("casilla");

            if ((fila + col) % 2 === 0) casilla.classList.add("clara");
            else casilla.classList.add("oscura");

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

                if (!animando) {
                    casilla.addEventListener("click", () => clicDiagonal(indiceDiag));
                }
            }

            contenedor.appendChild(casilla);
        }
    }

    if (seleccionada !== null && !animando) {
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

    if (pieza === "B") {
        if (origen + 1 < 8 && estadoDiagonal[origen + 1] === ".") {
            posibles.push(origen + 1);
        }
        if (origen + 2 < 8 && estadoDiagonal[origen + 1] === "N" && estadoDiagonal[origen + 2] === ".") {
            posibles.push(origen + 2);
        }
    }

    if (pieza === "N") {
        if (origen - 1 >= 0 && estadoDiagonal[origen - 1] === ".") {
            posibles.push(origen - 1);
        }
        if (origen - 2 >= 0 && estadoDiagonal[origen - 1] === "B" && estadoDiagonal[origen - 2] === ".") {
            posibles.push(origen - 2);
        }
    }

    return posibles;
}

function clicDiagonal(indice) {
    if (animando) return;

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
    return estadoDiagonal.join("") === "NNN..BBB";
}

// ===== REPRODUCIR SOLUCIÓN =====
async function reproducirSolucion() {
    if (animando) return;
    animando = true;
    seleccionada = null;
    document.getElementById("mensaje").textContent = "Reproduciendo solución...";

    // Reiniciar
    estadoDiagonal = ["B", "B", "B", ".", ".", "N", "N", "N"];
    crearTablero();
    await esperar(800);

    for (const [origen, destino] of solucion) {
        if (estadoDiagonal[origen] === "." ) continue; // seguridad

        // Resaltar origen
        const casillaOrigen = document.querySelector(`[data-indice="${origen}"]`);
        if (casillaOrigen) casillaOrigen.classList.add("seleccionada");
        await esperar(400);

        // Mover
        estadoDiagonal[destino] = estadoDiagonal[origen];
        estadoDiagonal[origen] = ".";
        crearTablero();
        await esperar(700);

        if (haGanado()) {
            document.getElementById("mensaje").textContent = "¡Solución completada! 🎉";
            break;
        }
    }

    animando = false;
}

function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Botones
document.getElementById("btnReiniciar").addEventListener("click", () => {
    if (animando) return;
    estadoDiagonal = ["B", "B", "B", ".", ".", "N", "N", "N"];
    seleccionada = null;
    document.getElementById("mensaje").textContent = "";
    crearTablero();
});

// Añadir botón de solución si no existe
if (!document.getElementById("btnSolucion")) {
    const btn = document.createElement("button");
    btn.id = "btnSolucion";
    btn.textContent = "Ver solución";
    btn.style.marginLeft = "10px";
    btn.style.backgroundColor = "#0a7";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.padding = "10px 18px";
    btn.style.borderRadius = "6px";
    btn.style.cursor = "pointer";
    btn.onclick = reproducirSolucion;
    document.querySelector(".controles").appendChild(btn);
}

crearTablero();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(() => console.log("Service Worker registrado"))
            .catch(err => console.log("Error SW:", err));
    });
}
