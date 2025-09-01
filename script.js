document.addEventListener("keydown", OnKeyPress);
document.addEventListener("keyup", OnKeyRelease);
let audioCtx = new (window.AudioContext ||
  window.webkitAudioContext ||
  window.audioContext)();
let oscillator;
let gainNode;
gainNode = audioCtx.createGain();
let isPressing = false;
let completeStop;
let spaceTextTimeout;
const lever = document.getElementById("lever-bar-joint-connection");
const spring = document.getElementById("spring");
const volumeDial = document.getElementById("volume");
const volumeValue = document.getElementById("volume-value");
let volume = 0.5;
const dotDurationDial = document.getElementById("dot-duration");
const dotDurationValue = document.getElementById("dot-duration-value");
let dotDuration = 150;
let timer = 0;
const predictedLetter = document.getElementById("predicted-letter");
const decodedLetters = document.getElementById("decoded-letters");
let predictLetterTimeout;
let composedLetter = "";
const morseTextMaxSize = 30;
const definedMorse = document.getElementById("defined-morse");
let composedMorse = "";
const undefinedMorse = document.getElementById("undefined-morse");
document.getElementById("morse-code-sheet").style.fontSize = `${
  document.getElementById("base").offsetWidth / 80
}px`;

const morseMap = {
  // Letters
  ".-": "A",
  "-...": "B",
  "-.-.": "C",
  "-..": "D",
  ".": "E",
  "..-.": "F",
  "--.": "G",
  "....": "H",
  "..": "I",
  ".---": "J",
  "-.-": "K",
  ".-..": "L",
  "--": "M",
  "-.": "N",
  "---": "O",
  ".--.": "P",
  "--.-": "Q",
  ".-.": "R",
  "...": "S",
  "-": "T",
  "..-": "U",
  "...-": "V",
  ".--": "W",
  "-..-": "X",
  "-.--": "Y",
  "--..": "Z",

  // Numbers
  "-----": "0",
  ".----": "1",
  "..---": "2",
  "...--": "3",
  "....-": "4",
  ".....": "5",
  "-....": "6",
  "--...": "7",
  "---..": "8",
  "----.": "9",

  // Common punctuation
  ".-.-.-": ".",
  "--..--": ",",
  "..--..": "?",
  ".----.": "'",
  "-.-.--": "!",
  "-..-.": "/",
  "-.--.": "(",
  "-.--.-": ")",
  ".-...": "&",
  "---...": ":",
  "-.-.-.": ";",
  "-...-": "=",
  ".-.-.": "+",
  "-....-": "-",
  "..--.-": "_",
  ".-..-.": '"',
  "...-..-": "$",
  ".--.-.": "@",
};

function OnKeyPress(event) {
  if ((event.key === "Control" || event.key === "a") && !isPressing) {
    timer = Date.now();
    lever.classList.remove("raised");
    spring.classList.remove("raised");
    lever.classList.add("lowered");
    spring.classList.add("lowered");
    isPressing = true;

    if (!oscillator) {
      oscillator = audioCtx.createOscillator();
      gainNode.connect(audioCtx.destination);
      oscillator.connect(gainNode);
      oscillator.frequency.value = 600;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
      oscillator.start();
    } else {
      gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    }
    clearTimeout(completeStop);
  }
  clearTimeout(spaceTextTimeout);
  clearTimeout(predictLetterTimeout);
}

function OnKeyRelease(event) {
  if (event.key === "Control" || event.key === "a") {
    CheckMorseCode(Date.now() - timer);

    lever.classList.remove("lowered");
    lever.classList.add("raised");
    spring.classList.remove("lowered");
    spring.classList.add("raised");
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

    isPressing = false;

    if (oscillator) {
      clearTimeout(completeStop);
      completeStop = setTimeout(() => {
        oscillator.stop();
        oscillator = null;
      }, 1000);
    }
  }
}

function ChangeVolume(value) {
  volume = value / 100;
  volumeValue.textContent = volume * 100;
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
}

// The length of a dot is 1 time unit.
// A dash is 3 time units.
// The space between symbols (dots and dashes) of the same letter is 1 time unit.
// The space between letters is 3 time units.
// The space between words is 7 time units.

function ChangeDotDuration(value) {
  dotDuration = value;
  dotDurationValue.textContent = dotDuration;
}

function CheckMorseCode(duration) {
  let signal;
  duration < dotDuration ? (signal = ".") : (signal = "-");

  composedMorse += signal;
  undefinedMorse.textContent = composedMorse;

  PredictLetter(signal);
}

function DefineMorse(text) {
  // if (definedMorse.textContent.length >= text.length - 1) {
  //   definedMorse.textContent = definedMorse.textContent.slice(
  //     -(text.length - 1),
  //     definedMorse.textContent.length
  //   );
  // }
  definedMorse.textContent += text;
}

function PredictLetter(signal) {
  composedLetter += signal;
  predictedLetter.textContent = morseMap[composedLetter] || "";
  predictLetterTimeout = setTimeout(() => {
    decodedLetters.textContent += predictedLetter.textContent;
    composedLetter = "";
    composedMorse = "";
    DefineMorse(undefinedMorse.textContent);
    predictedLetter.textContent = "";
    undefinedMorse.textContent = "";
    SpaceText();
  }, dotDuration * 3);
}

function SpaceText() {
  spaceTextTimeout = setTimeout(() => {
    DefineMorse(" ");
    decodedLetters.textContent += " ";
  }, dotDuration * 4);
}
