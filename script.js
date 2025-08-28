document.addEventListener("keydown", onKeyPress);
document.addEventListener("keyup", onKeyRelease);
var audioCtx = new (window.AudioContext ||
  window.webkitAudioContext ||
  window.audioContext)();
var oscillator;
var isPressing = false;

function onKeyPress(event) {
  if (event.key === "Control" && !isPressing) {
    isPressing = true;
    oscillator = audioCtx.createOscillator();
    oscillator.frequency.value = 600;
    oscillator.type = "sine";
    oscillator.connect(audioCtx.destination);
    oscillator.start();
  }
}
function onKeyRelease(event) {
  if (event.key === "Control") {
    oscillator.stop();
    isPressing = false;
  }
}
