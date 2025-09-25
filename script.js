// Select the elements
const passwordDisplay = document.getElementById('password-display');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const errorMessage = document.getElementById('error-message');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
const eyeIcon = document.getElementById('eye-icon');
const qrBtn = document.getElementById('qr-btn');
const hideQrBtn = document.getElementById('hide-qr-btn');
const qrCodeDiv = document.getElementById('qr-code');
const themeToggle = document.getElementById('theme-toggle');
const modeRadios = document.querySelectorAll('input[name="mode"]');
const customInputDiv = document.getElementById('custom-input');
const nameInput = document.getElementById('name-input');
const exportFileBtn = document.getElementById('export-file-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

let isPasswordVisible = true; // Track visibility state
let currentMode = 'random'; // Default mode

// Mode switching
modeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        currentMode = radio.value;
        customInputDiv.style.display = currentMode === 'custom' ? 'block' : 'none';
        passwordDisplay.textContent = ''; // Clear display on mode change
        qrCodeDiv.style.display = 'none';
        hideQrBtn.style.display = 'none';
        updateStrengthIndicator(''); // Reset strength
    });
});

// Event Listeners

// Generate password on button click
generateBtn.addEventListener('click', () => {
    let password = '';
    if (currentMode === 'random') {
        password = generateRandomPassword();
    } else {
        const name = nameInput.value.trim();
        if (!name) {
            errorMessage.textContent = 'Enter a name for custom mode.';
            errorMessage.style.display = 'block';
            updateStrengthIndicator('');
            return;
        }
        password = generateCustomPassword(name);
    }
    if (password) {
        passwordDisplay.textContent = password;
        passwordDisplay.style.display = isPasswordVisible ? 'block' : 'none';
        eyeIcon.textContent = isPasswordVisible ? '👁️' : '👁️‍🗨️';
        qrCodeDiv.style.display = 'none';
        hideQrBtn.style.display = 'none';
        errorMessage.style.display = 'none';
        updateStrengthIndicator(password); // Update strength after generation
    }
});

// Copy password to clipboard on button click
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.textContent) {
        navigator.clipboard.writeText(passwordDisplay.textContent)
            .then(() => {
                alert('Password copied to clipboard!');
            })
            .catch(() => {
                alert('Failed to copy password!');
            });
    } else {
        alert('Generate a password first!');
    }
});

// Update length value on slider change
lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
});

// Toggle password visibility
eyeIcon.addEventListener('click', () => {
    isPasswordVisible = !isPasswordVisible;
    if (passwordDisplay.textContent) {
        passwordDisplay.style.display = isPasswordVisible ? 'block' : 'none';
    }
    eyeIcon.textContent = isPasswordVisible ? '👁️' : '👁️‍🗨️';
});

// Export QR code
qrBtn.addEventListener('click', () => {
    const password = passwordDisplay.textContent;
    if (password) {
        qrCodeDiv.innerHTML = '';
        new QRCode(qrCodeDiv, password);
        qrCodeDiv.style.display = 'block';
        hideQrBtn.style.display = 'inline-block';
    } else {
        alert('Generate a password first!');
    }
});

// Hide QR
hideQrBtn.addEventListener('click', () => {
    qrCodeDiv.style.display = 'none';
    hideQrBtn.style.display = 'none';
});

// Export to file
exportFileBtn.addEventListener('click', () => {
    const password = passwordDisplay.textContent;
    if (password) {
        const blob = new Blob([`Password: ${password}\n\nNote: Store this file securely and delete it after use.`], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        alert('Password exported as password.txt. Keep it secure!');
    } else {
        alert('Generate a password first!');
    }
});

// Toggle theme
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Generate random password function
function generateRandomPassword() {
    const length = parseInt(lengthInput.value);
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;

    let charPool = '';
    if (includeUppercase) charPool += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charPool += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charPool += '0123456789';
    if (includeSymbols) charPool += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (!charPool) {
        errorMessage.textContent = 'Please select at least one character type.';
        errorMessage.style.display = 'block';
        return '';
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charPool[Math.floor(Math.random() * charPool.length)];
    }
    return password;
}

// Generate custom password function with randomized case
function generateCustomPassword(name) {
    const length = parseInt(lengthInput.value);
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;

    if (!name || !includeLowercase) {
        errorMessage.textContent = 'Enter a name and enable lowercase.';
        errorMessage.style.display = 'block';
        return '';
    }

    // Randomize case for each letter in the name
    let base = '';
    for (let i = 0; i < name.length; i++) {
        const shouldUpper = Math.random() < 0.5; // 50% chance for uppercase
        base += shouldUpper ? name[i].toUpperCase() : name[i].toLowerCase();
    }

    // Add numbers if selected (e.g., random 2-4 digits)
    let password = base;
    if (includeNumbers) {
        const numDigits = Math.min(4, length - password.length); // Limit to avoid overflow
        for (let i = 0; i < numDigits; i++) {
            password += Math.floor(Math.random() * 10);
        }
    }

    // Add symbols if selected (e.g., random from symbol set)
    if (includeSymbols) {
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        const symCount = Math.min(3, length - password.length);
        for (let i = 0; i < symCount; i++) {
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }
    }

    // Pad or truncate to exact length
    if (password.length < length) {
        const charPool = (includeUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '') +
                         (includeLowercase ? 'abcdefghijklmnopqrstuvwxyz' : '') +
                         (includeNumbers ? '0123456789' : '') +
                         (includeSymbols ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '');
        while (password.length < length) {
            password += charPool[Math.floor(Math.random() * charPool.length)];
        }
    } else if (password.length > length) {
        password = password.substring(0, length);
    }

    return password;
}

// Update strength indicator
function updateStrengthIndicator(password) {
    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.className = '';
        strengthText.textContent = 'Strength: N/A';
        return;
    }

    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password);

    let score = 0;
    if (length >= 12) score += 2;
    else if (length >= 8) score += 1;
    if (hasUpper) score += 1;
    if (hasLower) score += 1;
    if (hasNumbers) score += 1;
    if (hasSymbols) score += 1;

    let strength = 'Weak';
    let width = '33%';
    if (score >= 5) {
        strength = 'Strong';
        width = '100%';
        strengthBar.className = 'strong';
    } else if (score >= 3) {
        strength = 'Medium';
        width = '66%';
        strengthBar.className = 'medium';
    } else {
        strengthBar.className = 'weak';
    }

    strengthBar.style.width = width;
    strengthText.textContent = `Strength: ${strength}`;
}