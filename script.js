
const passwordField = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");
const message = document.getElementById("message");

lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
});

function secureRandom(max) {
    const random = new Uint32Array(1);
    const limit = Math.floor(4294967296 / max) * max;

    do {
        crypto.getRandomValues(random);
    } while (random[0] >= limit);

    return random[0] % max;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = secureRandom(i + 1);
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generatePassword() {
    const length = Number(lengthSlider.value);

    const groups = [];

    if (document.getElementById("uppercase").checked) {
        groups.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    }

    if (document.getElementById("lowercase").checked) {
        groups.push("abcdefghijklmnopqrstuvwxyz");
    }

    if (document.getElementById("numbers").checked) {
        groups.push("0123456789");
    }

    if (document.getElementById("symbols").checked) {
        groups.push("!@#$%^&*()_+-=[]{}");
    }

    if (groups.length === 0) {
        message.textContent = "Select at least one option!";
        return;
    }

    if (length < groups.length) {
        message.textContent =
            "Increase length to include every selected character type.";
        return;
    }

    const allCharacters = groups.join("");
    const passwordCharacters = [];

    // Include at least one character from each selected group.
    groups.forEach(group => {
        passwordCharacters.push(
            group[secureRandom(group.length)]
        );
    });

    // Fill remaining password length.
    while (passwordCharacters.length < length) {
        passwordCharacters.push(
            allCharacters[secureRandom(allCharacters.length)]
        );
    }

    // Randomize character positions.
    shuffle(passwordCharacters);

    const password = passwordCharacters.join("");

    passwordField.value = password;
    message.textContent = "Password generated successfully!";

    checkStrength(password);
}

function checkStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 3) {
        strengthText.textContent = "Weak";
        strengthFill.style.width = "30%";
        strengthFill.style.background = "#ef4444";
    }
    else if (score <= 5) {
        strengthText.textContent = "Medium";
        strengthFill.style.width = "65%";
        strengthFill.style.background = "#f59e0b";
    }
    else {
        strengthText.textContent = "Strong";
        strengthFill.style.width = "100%";
        strengthFill.style.background = "#22c55e";
    }
}

async function copyPassword() {
    if (!passwordField.value) {
        message.textContent = "Generate a password first!";
        return;
    }

    try {
        await navigator.clipboard.writeText(passwordField.value);
        message.textContent = "Password copied successfully!";
    } catch (error) {
        message.textContent =
            "Copy unavailable. Select and copy the password manually.";
    }
}

generateBtn.addEventListener("click", generatePassword);
copyBtn.addEventListener("click", copyPassword);

// Generate an initial password.
generatePassword();
