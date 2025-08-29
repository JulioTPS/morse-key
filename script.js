document.addEventListener("keydown", onKeyPress);
document.addEventListener("keyup", onKeyRelease);
let audioCtx = new (window.AudioContext ||
  window.webkitAudioContext ||
  window.audioContext)();
let oscillator;
let gainNode;
gainNode = audioCtx.createGain();
let isPressing = false;
let completeStop = false;
let lever = document.getElementById("lever-bar-joint-connection");
let spring = document.getElementById("spring");
let volumeDial = document.getElementById("volume");
let volume = 0.5;

function onKeyPress(event) {
  if ((event.key === "Control" || event.key === "a") && !isPressing) {
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

function onKeyRelease(event) {
  if (event.key === "Control" || event.key === "a") {
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

function changeVolume(value) {
  volume = value / 100;
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
}
