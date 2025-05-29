// script.js

// Lista de palabras válidas de 5 letras en español
const WORDS = [
    "AMIGO","CASAS","GATOS","PERRO","LIBRO",
    "CAMPO","MUNDO","SALUD","FIESTA","LLAVE",
    "SUELO","PLANO","NOCHE","LUCES","FUEGO"
  ];
  
  // Selección aleatoria de la palabra del día
  const ANSWER = WORDS[Math.floor(Math.random() * WORDS.length)];
  
  const MAX_ROWS = 6;
  const MAX_COLS = 5;
  let row = 0, col = 0;
  let isGameOver = false;
  
  const gridEl     = document.getElementById("grid");
  const keyboardEl = document.getElementById("keyboard");
  
  // Inicialización
  createGrid();
  createKeyboard();
  document.addEventListener("keydown", handleKeyPress);
  
  // Construye la cuadrícula 6×5
  function createGrid() {
    for (let r = 0; r < MAX_ROWS; r++) {
      const rowEl = document.createElement("div");
      rowEl.className = "row";
      for (let c = 0; c < MAX_COLS; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.id = `cell-${r}-${c}`;
        rowEl.appendChild(cell);
      }
      gridEl.appendChild(rowEl);
    }
  }
  
  // Construye el teclado en pantalla
  function createKeyboard() {
    const rows = ["qwertyuiop","asdfghjkl","zxcvbnm"];
    rows.forEach((keys, i) => {
      const rowEl = document.createElement("div");
      rowEl.className = "keyboard-row";
  
      if (i === 2) rowEl.appendChild(makeKey("enter", "Enter", true));
      for (let char of keys) {
        rowEl.appendChild(makeKey(char, char));
      }
      if (i === 2) rowEl.appendChild(makeKey("backspace", "←", true));
  
      keyboardEl.appendChild(rowEl);
    });
  }
  
  // Crea cada botón-tecla
  function makeKey(id, label, wide = false) {
    const btn = document.createElement("button");
    btn.id = `key-${id}`;
    btn.textContent = label;
    btn.className = "key" + (wide ? " wide" : "");
    btn.addEventListener("click", () => handleKey(id));
    return btn;
  }
  
  // Manejador para teclas físicas y clics
  function handleKey(e) {
    if (isGameOver) return;
    let key = typeof e === "string" ? e : e.key.toLowerCase();
  
    if (key === "enter")     return submitGuess();
    if (key === "backspace") return deleteLetter();
    if (/^[a-zñ]$/.test(key) && col < MAX_COLS) {
      insertLetter(key);
    }
  }
  
  function handleKeyPress(e) {
    handleKey(e);
  }
  
  // Inserta letra en la celda activa
  function insertLetter(letter) {
    letter = letter.toUpperCase();
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.textContent = letter;
    col++;
  }
  
  // Borra la última letra de la fila actual
  function deleteLetter() {
    if (col === 0) return;
    col--;
    const cell = document.getElementById(`cell-${row}-${col}`);
    cell.textContent = "";
  }
  
  // Envía la conjetura, aplica animación y colores
  function submitGuess() {
    if (col < MAX_COLS) return; // fila incompleta
  
    const guess = Array.from({length: MAX_COLS}, (_, i) =>
      document.getElementById(`cell-${row}-${i}`).textContent
    ).join("");
  
    if (!WORDS.includes(guess)) {
      alert("Palabra no válida");
      return;
    }
  
    const answerArr = ANSWER.split("");
    const guessArr  = guess.split("");
    const result = guessArr.map((letter, i) => {
      if (letter === answerArr[i])    return "correct";
      if (answerArr.includes(letter)) return "present";
      return "absent";
    });
  
    // Para cada celda, programamos la animación con retardo
    result.forEach((res, i) => {
      setTimeout(() => {
        const cell = document.getElementById(`cell-${row}-${i}`);
        cell.classList.add("flip", res);
  
        // Actualiza el color de la tecla correspondiente
        const key = document.getElementById(`key-${guessArr[i].toLowerCase()}`);
        if (!key.classList.contains("correct")) {
          key.classList.remove("present","absent");
          key.classList.add(res);
        }
      }, i * 300);
    });
  
    // Fin de juego (retardado para respetar la animación)
    if (guess === ANSWER) {
      setTimeout(() => {
        alert("¡Felicidades! Has adivinado la palabra.");
        isGameOver = true;
      }, MAX_COLS * 300);
    } else {
      setTimeout(() => {
        row++;
        col = 0;
        if (row === MAX_ROWS) {
          alert(`Juego terminado. La palabra era: ${ANSWER}`);
          isGameOver = true;
        }
      }, MAX_COLS * 300);
    }
  }
  