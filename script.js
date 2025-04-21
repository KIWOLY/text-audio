let voices = [];
let isPaused = false;

function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  const voiceSelect = document.getElementById("voiceSelect");
  voiceSelect.innerHTML = "";

  voices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

window.speechSynthesis.onvoiceschanged = populateVoices;

function speakStory() {
  const text = document.getElementById("storyText").value.trim();
  if (text === "") {
    alert("Please enter a story first!");
    return;
  }

  stopSpeech(); // Stop previous if any

  const selectedVoiceIndex = document.getElementById("voiceSelect").value;
  const rate = document.getElementById("rate").value;
  const sentences = text.split(/(?<=[.?!])\s+/);

  function speakNextSentence(index) {
    if (index >= sentences.length) return;

    const speech = new SpeechSynthesisUtterance(sentences[index]);
    speech.voice = voices[selectedVoiceIndex];
    speech.rate = rate;

    speech.onend = function() {
      if (!window.speechSynthesis.paused) {
        setTimeout(() => speakNextSentence(index + 1), 500);
      }
    };

    window.speechSynthesis.speak(speech);
  }

  isPaused = false;
  updatePauseButton();
  speakNextSentence(0);
}

function togglePauseResume() {
  if (window.speechSynthesis.speaking) {
    if (isPaused) {
      window.speechSynthesis.resume();
      isPaused = false;
    } else {
      window.speechSynthesis.pause();
      isPaused = true;
    }
    updatePauseButton();
  }
}

function updatePauseButton() {
  const btn = document.getElementById("pauseResumeBtn");
  if (isPaused) {
    btn.innerHTML = "▶️ Resume";
  } else {
    btn.innerHTML = "⏸️ Pause";
  }
}

function stopSpeech() {
  if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
    window.speechSynthesis.cancel();
  }
}

function clearText() {
  document.getElementById("storyText").value = "";
  updateWordCount();
  stopSpeech();
}

function resetSettings() {
  clearText();
  document.getElementById("rate").value = 1;
  document.getElementById("rateValue").textContent = "1";
  stopSpeech();
}

function updateWordCount() {
  const text = document.getElementById("storyText").value.trim();
  const wordCount = text === "" ? 0 : text.split(/\s+/).length;
  document.getElementById("wordCount").textContent = wordCount;
}

document.getElementById("rate").addEventListener("input", function() {
  document.getElementById("rateValue").textContent = this.value;
});
