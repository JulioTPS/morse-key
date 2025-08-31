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
let slideText;
const lever = document.getElementById("lever-bar-joint-connection");
const spring = document.getElementById("spring");
const volumeDial = document.getElementById("volume");
const volumeValue = document.getElementById("volume-value");
let volume = 0.5;
const dotDurationDial = document.getElementById("dot-duration");
const dotDurationValue = document.getElementById("dot-duration-value");
let dotDuration = 150;
let timer = 0;
const morseTextMaxSize = 30;
const morseText = document.getElementById("morse-text");
document.getElementById("morse-code-sheet").style.fontSize = `${
  document.getElementById("base").offsetWidth / 80
}px`;

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
  if (duration < dotDuration) {
    if (morseText.textContent.length >= morseTextMaxSize - 1) {
      morseText.textContent = morseText.textContent.slice(
        -(morseTextMaxSize - 1)
      );
    }
    morseText.textContent += ".";
  } else {
    if (morseText.textContent.length >= morseTextMaxSize - 1) {
      morseText.textContent = morseText.textContent.slice(
        -(morseTextMaxSize - 1)
      );
    }
    morseText.textContent += "-";
  }
  clearTimeout(slideText);
  SlideText();
}

function SlideText() {
  slideText = setTimeout(() => {
    if (morseText.textContent.length >= morseTextMaxSize - 1) {
      morseText.textContent = morseText.textContent.slice(
        -(morseTextMaxSize - 1)
      );
    }
    morseText.textContent += " ";

    SlideText();
  }, dotDuration * 7);
}
