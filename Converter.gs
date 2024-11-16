function doPost(e) {
    const responseText = "Math text processed successfully.";
    const output = ContentService.createTextOutput(responseText)
        .setMimeType(ContentService.MimeType.TEXT);
    output.appendHeader("Access-Control-Allow-Origin", "*");
    return output;
}

function convertMathText() {
  var body = DocumentApp.getActiveDocument().getBody();
  var numChildren = body.getNumChildren();

  for (var i = 0; i < numChildren; i++) {
    var element = body.getChild(i);
    if (element.getType() == DocumentApp.ElementType.PARAGRAPH) {
      var text = element.asText();

      // Replace superscript notation (e.g., ^2 -> ²)
      var superscriptRegex = /\^(\S+)/g;
      replaceTextWithFormatting(text, superscriptRegex, function(match, p1) {
        return p1.split('').map(superscriptChar).join('');
      });

      // Replace subscript notation (e.g., _0 -> ₀)
      var subscriptRegex = /_(\S+)/g;
      replaceTextWithFormatting(text, subscriptRegex, function(match, p1) {
        return p1.split('').map(subscriptChar).join('');
      });

      // Replace division (e.g., a / b -> ᵃ/₆)
      var divisionRegex = /(\S+)\s*\/\s*(\S+)/g;
      replaceTextWithFormatting(text, divisionRegex, function(match, p1, p2) {
        return constructFraction(p1, p2);
      });

      // Replace exact "sqrt" with the square root symbol
      var sqrtRegex = /sqrt/g;
      replaceTextWithFormatting(text, sqrtRegex, function() {
        return '√';
      });

      // Replace Greek letter names with symbols (e.g., "alpha" -> "α")
      for (var name in greekLetters) {
        var greekRegex = new RegExp('\\b' + name + '\\b', 'g');
        replaceTextWithFormatting(text, greekRegex, function() {
          return greekLetters[name];
        });
      }
    }
  }
}

// Helper function to replace text while preserving formatting
function replaceTextWithFormatting(textElement, regex, replacementFunction) {
  var match;
  while ((match = regex.exec(textElement.getText())) !== null) {
    var replacement = replacementFunction.apply(null, match);
    textElement.deleteText(match.index, match.index + match[0].length - 1);
    textElement.insertText(match.index, replacement);
  }
}

// Helper function to construct a fraction in Unicode format
function constructFraction(numerator, denominator) {
  var superscriptNumerator = numerator.split('').map(superscriptChar).join('');
  var subscriptDenominator = denominator.split('').map(subscriptChar).join('');
  return superscriptNumerator + '/' + subscriptDenominator;
}

// Helper function to convert characters to subscript
function subscriptChar(char) {
  var subscripts = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    'a': 'ₐ', 'b': 'ₓ', 'c': 'ₓ', 'd': 'ₓ', 'e': 'ₑ',
    'f': 'ₓ', 'g': 'ₓ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
    'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
    'p': 'ₚ', 'q': 'ₓ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ',
    'u': 'ᵤ', 'v': 'ᵥ', 'w': 'ₓ', 'x': 'ₓ', 'y': 'ᵧ',
    'z': '₂', '-': '₋',
    'α': 'ᵦ', 'β': 'ᵦ', 'γ': 'ᵧ', 'δ': 'ᵟ', 'ε': 'ₑ',
    'ζ': 'ₓ', 'η': 'ₕ', 'θ': 'ᶿ', 'ι': 'ᵢ', 'κ': 'ₖ',
    'λ': 'ₗ', 'μ': 'ₘ', 'ν': 'ᵥ', 'ξ': 'ₓ', 'ο': 'ₒ',
    'π': 'ₚ', 'ρ': 'ᵣ', 'σ': 'ₛ', 'τ': 'ₜ', 'υ': 'ᵤ',
    'φ': 'ᵠ', 'χ': 'ₓ', 'ψ': '₧', 'ω': 'ₒ'
  };
  return subscripts[char] || char;
}

// Helper function to convert characters to superscript
function superscriptChar(char) {
  var superscripts = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
    'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
    'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
    'p': 'ᵖ', 'q': 'ʠ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ',
    'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ',
    'z': 'ᶻ', '-': '⁻',
    'α': 'ᵅ', 'β': 'ᵝ', 'γ': 'ᵞ', 'δ': 'ᵟ', 'ε': 'ᵋ',
    'ζ': 'ᶻ', 'η': 'ʰ', 'θ': 'ᶿ', 'ι': 'ⁱ', 'κ': 'ᵏ',
    'λ': 'ˡ', 'μ': 'ᵐ', 'ν': 'ⁿ', 'ξ': 'ˣ', 'ο': 'ᵒ',
    'π': 'ᵖ', 'ρ': 'ʳ', 'σ': 'ˢ', 'τ': 'ᵗ', 'υ': 'ᵘ',
    'φ': 'ᵠ', 'χ': 'ˣ', 'ψ': 'ᵯ', 'ω': 'ʷ'
  };
  return superscripts[char] || char;
}

// Greek letter dictionary
var greekLetters = {
  'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'epsilon': 'ε',
  'zeta': 'ζ', 'eta': 'η', 'theta': 'θ', 'iota': 'ι', 'kappa': 'κ',
  'lambda': 'λ', 'mu': 'μ', 'nu': 'ν', 'xi': 'ξ', 'omicron': 'ο',
  'pi': 'π', 'rho': 'ρ', 'sigma': 'σ', 'tau': 'τ', 'upsilon': 'υ',
  'phi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω'
};
