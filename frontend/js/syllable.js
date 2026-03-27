/**
 * Syllable Splitting Module
 * Implements English syllable splitting algorithm
 */

const Syllable = {
    /**
     * Check if character is a vowel
     */
    isVowel(char) {
        return /[aeiouy]/i.test(char);
    },

    /**
     * Check if character is a consonant
     */
    isConsonant(char) {
        return /[bcdfghjklmnpqrstvwxz]/i.test(char);
    },

    /**
     * Split word into syllables using English rules
     * This is a pragmatic implementation covering common patterns
     */
    splitWord(word) {
        if (!word || word.length <= 3) return word;

        const original = word;
        word = word.toLowerCase();

        // Handle common exceptions first
        const exceptions = {
            'people': 'peo·ple',
            'table': 'ta·ble',
            'little': 'lit·tle',
            'example': 'ex·am·ple',
            'problem': 'prob·lem',
            'because': 'be·cause',
            'another': 'an·oth·er',
            'whether': 'wheth·er',
            'reading': 'read·ing',
            'writing': 'writ·ing'
        };

        if (exceptions[word]) {
            return this.matchCase(original, exceptions[word]);
        }

        let syllables = [];
        let currentSyllable = '';

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            const nextChar = word[i + 1];
            const prevChar = word[i - 1];

            currentSyllable += char;

            // Rule 1: Divide between double consonants
            if (this.isConsonant(char) && char === nextChar) {
                syllables.push(currentSyllable);
                currentSyllable = '';
                continue;
            }

            // Rule 2: Divide between two consonants surrounded by vowels (VC-CV)
            if (this.isConsonant(char) &&
                this.isConsonant(nextChar) &&
                this.isVowel(prevChar) &&
                this.isVowel(word[i + 2])) {
                syllables.push(currentSyllable);
                currentSyllable = '';
                continue;
            }

            // Rule 3: Divide after vowel if followed by single consonant and vowel (V-CV)
            if (this.isVowel(char) &&
                this.isConsonant(nextChar) &&
                this.isVowel(word[i + 2]) &&
                currentSyllable.length >= 2) {
                syllables.push(currentSyllable);
                currentSyllable = '';
                continue;
            }

            // Rule 4: Keep consonant blends together (bl, cr, dr, etc.)
            const blends = ['bl', 'br', 'cl', 'cr', 'dr', 'fl', 'fr', 'gl', 'gr',
                'pl', 'pr', 'sc', 'sk', 'sl', 'sm', 'sn', 'sp', 'st',
                'sw', 'tr', 'th', 'ch', 'sh', 'wh', 'ph'];

            if (nextChar && blends.includes(char + nextChar)) {
                continue;
            }
        }

        // Add remaining syllable
        if (currentSyllable) {
            syllables.push(currentSyllable);
        }

        // Handle edge cases
        if (syllables.length === 0) {
            return original;
        }

        if (syllables.length === 1) {
            return original;
        }

        const result = syllables.join('·');
        return this.matchCase(original, result);
    },

    /**
     * Match case of original word
     */
    matchCase(original, split) {
        if (original === original.toUpperCase()) {
            return split.toUpperCase();
        }
        if (original[0] === original[0].toUpperCase()) {
            return split[0].toUpperCase() + split.slice(1);
        }
        return split;
    },

    /**
     * Split entire text into syllables
     */
    splitText(text) {
        if (!text) return '';

        return text.split(/(\s+)/).map(token => {
            // Preserve whitespace
            if (/^\s+$/.test(token)) {
                return token;
            }

            // Split punctuation from words
            const match = token.match(/^([^\w]*)(\w+)([^\w]*)$/);
            if (match) {
                const [, prefix, word, suffix] = match;
                return prefix + this.splitWord(word) + suffix;
            }

            return token;
        }).join('');
    },

    /**
     * Remove syllable markers from text
     */
    removeSyllableMarkers(text) {
        return text.replace(/·/g, '');
    },

    /**
     * Count syllables in a word (for metrics)
     */
    countSyllables(word) {
        const split = this.splitWord(word);
        return split.split('·').length;
    }
};

// Test cases for validation (run in development)
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('Syllable Test Cases:');
    const testWords = ['people', 'reading', 'wonderful', 'computer', 'education', 'because'];
    testWords.forEach(word => {
        console.log(`${word} -> ${Syllable.splitWord(word)}`);
    });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Syllable;
}
