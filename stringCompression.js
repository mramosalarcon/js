/**
 * @param {string} word
 * @return {string}
 */
var compressString = function(word) {
    let comp = '';
    let i = 0;
    
    while (i < word.length) {
        let count = 1;
        let char = word[i];
        
        // Count consecutive occurrences of the current character
        while (i + 1 < word.length && word[i + 1] === char && count < 9) {
            count++;
            i++;
        }
        
        // Append the count and character to the compressed string
        comp += count + char;
        i++;
    }
    
    return comp;
};
