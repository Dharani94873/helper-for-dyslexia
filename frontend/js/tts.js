/**
 * Text-to-Speech Module
 * Manages speech synthesis with word-by-word highlighting
 */

const TTS = {
    synth: null,
    utterance: null,
    words: [],
    currentWordIndex: -1,
    isPaused: false,
    isPlaying: false,

    /**
     * Initialize TTS
     */
    init() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            return true;
        } else {
            console.warn('Text-to-Speech not supported in this browser');
            return false;
        }
    },

    /**
     * Check if TTS is available
     */
    isAvailable() {
        return 'speechSynthesis' in window;
    },

    /**
     * Load text for reading
     */
    loadText(text) {
        if (!text) return false;

        // Split text into words
        this.words = text.split(/\s+/).filter(word => word.length > 0);
        this.currentWordIndex = -1;

        return true;
    },

    /**
     * Start reading
     */
    play(text, onWordHighlight, onEnd) {
        if (!this.isAvailable()) {
            console.error('TTS not available');
            return false;
        }

        // If paused, resume
        if (this.isPaused) {
            this.resume();
            return true;
        }

        // Stop any current speech
        this.stop();

        // Load new text if provided
        if (text) {
            this.loadText(text);
        }

        if (this.words.length === 0) {
            console.error('No text loaded');
            return false;
        }

        this.isPlaying = true;
        this.isPaused = false;
        this.currentWordIndex = 0;

        // Speak word by word
        this.speakNextWord(onWordHighlight, onEnd);

        return true;
    },

    /**
     * Speak next word
     */
    speakNextWord(onWordHighlight, onEnd) {
        if (!this.isPlaying || this.currentWordIndex >= this.words.length) {
            this.isPlaying = false;
            if (onEnd) onEnd();
            return;
        }

        const word = this.words[this.currentWordIndex];

        // Create utterance for single word
        this.utterance = new SpeechSynthesisUtterance(word);

        // Set voice properties
        this.utterance.rate = 1.0;
        this.utterance.pitch = 1.0;
        this.utterance.volume = 1.0;

        // Highlight word when speaking
        if (onWordHighlight) {
            onWordHighlight(this.currentWordIndex, word);
        }

        // When word finishes, speak next
        this.utterance.onend = () => {
            if (this.isPlaying && !this.isPaused) {
                this.currentWordIndex++;
                this.speakNextWord(onWordHighlight, onEnd);
            }
        };

        this.utterance.onerror = (event) => {
            console.error('Speech error:', event);
            this.isPlaying = false;
            if (onEnd) onEnd();
        };

        this.synth.speak(this.utterance);
    },

    /**
     * Pause reading
     */
    pause() {
        if (!this.isAvailable() || !this.isPlaying) return false;

        this.synth.pause();
        this.isPaused = true;

        return true;
    },

    /**
     * Resume reading
     */
    resume() {
        if (!this.isAvailable() || !this.isPaused) return false;

        this.synth.resume();
        this.isPaused = false;

        return true;
    },

    /**
     * Stop reading
     */
    stop() {
        if (!this.isAvailable()) return false;

        this.synth.cancel();
        this.isPlaying = false;
        this.isPaused = false;
        this.currentWordIndex = -1;

        return true;
    },

    /**
     * Get available voices
     */
    getVoices() {
        if (!this.isAvailable()) return [];
        return this.synth.getVoices();
    },

    /**
     * Set voice
     */
    setVoice(voiceIndex) {
        const voices = this.getVoices();
        if (voices[voiceIndex] && this.utterance) {
            this.utterance.voice = voices[voiceIndex];
        }
    },

    /**
     * Set rate
     */
    setRate(rate) {
        if (this.utterance) {
            this.utterance.rate = Math.max(0.5, Math.min(2.0, rate));
        }
    },

    /**
     * Set pitch
     */
    setPitch(pitch) {
        if (this.utterance) {
            this.utterance.pitch = Math.max(0.5, Math.min(2.0, pitch));
        }
    },

    /**
     * Get current status
     */
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            isPaused: this.isPaused,
            currentWord: this.currentWordIndex,
            totalWords: this.words.length,
            progress: this.words.length > 0
                ? Math.round((this.currentWordIndex / this.words.length) * 100)
                : 0
        };
    }
};

// Initialize on load
if (typeof window !== 'undefined') {
    TTS.init();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TTS;
}
