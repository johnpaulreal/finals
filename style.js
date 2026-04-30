const header = document.querySelector("header");

window.addEventListener("scroll", function() { 
    header.classList.toggle("sticky", window.scrollY > 60)
});

let menu = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navbar.classList.toggle('open');
};

const container = document.querySelector('.container');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

// Desktop form switch
if (registerLink && container) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.add('active');
    });
}

if (loginLink && container) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        container.classList.remove('active');
        closeAllModals();
    });
}

// Mobile form toggle buttons
const mobileLoginToggle = document.getElementById('mobile-login-toggle');
const mobileRegisterToggle = document.getElementById('mobile-register-toggle');

if (mobileLoginToggle && mobileRegisterToggle) {
    mobileLoginToggle.addEventListener('click', () => {
        if (container.classList.contains('active')) {
            container.classList.remove('active');
            mobileLoginToggle.classList.add('active');
            mobileRegisterToggle.classList.remove('active');
        }
    });

    mobileRegisterToggle.addEventListener('click', () => {
        if (!container.classList.contains('active')) {
            container.classList.add('active');
            mobileRegisterToggle.classList.add('active');
            mobileLoginToggle.classList.remove('active');
        }
    });
}

// Password visibility toggle
function setupPasswordToggle(toggleId, inputId) {
    const toggleBtn = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    if (toggleBtn && input) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = isHidden ? 'bx bx-show' : 'bx bx-hide';
            }
        });
    }
}

setupPasswordToggle('login-toggle-pwd', 'login-password');
setupPasswordToggle('register-toggle-pwd', 'register-password');
setupPasswordToggle('confirm-toggle-pwd', 'confirm-password');

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[@$!%*?&]/)) strength++;

    if (strength < 2) return 'weak';
    if (strength < 3) return 'fair';
    if (strength < 4) return 'good';
    return 'strong';
}

function updatePasswordStrength(inputId, strengthId) {
    const input = document.getElementById(inputId);
    const strengthContainer = document.getElementById(strengthId);
    
    if (input && strengthContainer) {
        input.addEventListener('input', () => {
            const password = input.value;
            const strengthFill = strengthContainer.querySelector('.strength-fill');
            const strengthLabel = strengthContainer.querySelector('#strength-label');
            
            if (password) {
                strengthContainer.classList.add('active');
                const strength = checkPasswordStrength(password);
                
                strengthFill.className = 'strength-fill ' + strength;
                strengthLabel.textContent = strength.charAt(0).toUpperCase() + strength.slice(1);
                strengthLabel.className = strength;
            } else {
                strengthContainer.classList.remove('active');
            }
        });
    }
}

updatePasswordStrength('register-password', 'password-strength');

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const submitBtn = form.querySelector('.main-btn');
        const inputs = form.querySelectorAll('input');
        const isRegisterForm = form.closest('.register') !== null;
        
        // Real-time validation feedback
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input, isRegisterForm);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateInput(input, isRegisterForm);
                }
                // Check confirm password match
                if (input.id === 'register-password' || input.id === 'confirm-password') {
                    validatePasswordMatch();
                }
            });

            input.addEventListener('change', () => {
                validateInput(input, isRegisterForm);
            });
        });
        
        // Form submission handling
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input, isRegisterForm)) {
                    isValid = false;
                }
            });

            // Additional validation for register form
            if (isRegisterForm) {
                const confirmPassword = form.querySelector('#confirm-password');
                const password = form.querySelector('#register-password');
                if (confirmPassword && password && confirmPassword.value !== password.value) {
                    isValid = false;
                    showError(confirmPassword, 'Passwords do not match');
                }
            }
            
            if (isValid) {
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Processing...';
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    showSuccessMessage(isRegisterForm ? 'Account created successfully!' : 'Logged in successfully!');
                    form.reset();
                }, 1500);
            }
        });
    });
});

function validateInput(input, isRegisterForm = false) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    input.classList.remove('invalid', 'valid');
    clearError(input);
    
    // Required field check
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${input.getAttribute('aria-label') || input.id.replace(/-/g, ' ')} is required`;
    }
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Username validation
    if (input.id === 'register-username' && value) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(value)) {
            isValid = false;
            errorMessage = 'Username must be 3-20 characters, letters, numbers, and underscores only';
        }
    }
    
    // Password length validation
    if (input.type === 'password' && value && input.hasAttribute('minlength')) {
        const minLength = parseInt(input.getAttribute('minlength'));
        if (value.length < minLength) {
            isValid = false;
            errorMessage = `Password must be at least ${minLength} characters`;
        }
    }
    
    // Confirm password validation
    if (input.id === 'confirm-password' && value) {
        const password = document.getElementById('register-password');
        if (password && value !== password.value) {
            isValid = false;
            errorMessage = 'Passwords do not match';
        }
    }
    
    // Checkbox validation
    if (input.type === 'checkbox' && input.hasAttribute('required')) {
        if (!input.checked) {
            isValid = false;
            errorMessage = 'You must accept the terms and conditions';
        }
    }
    
    if (value || input.hasAttribute('required')) {
        input.classList.add(isValid ? 'valid' : 'invalid');
        if (!isValid && errorMessage) {
            showError(input, errorMessage);
        }
    }
    
    return isValid;
}

function showError(input, message) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
    input.classList.add('invalid');
    input.classList.remove('valid');
}

function clearError(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function validatePasswordMatch() {
    const password = document.getElementById('register-password');
    const confirmPassword = document.getElementById('confirm-password');
    
    if (password && confirmPassword && confirmPassword.value) {
        if (confirmPassword.value === password.value) {
            confirmPassword.classList.add('valid');
            confirmPassword.classList.remove('invalid');
            clearError(confirmPassword);
        } else if (confirmPassword.value) {
            confirmPassword.classList.add('invalid');
            confirmPassword.classList.remove('valid');
            showError(confirmPassword, 'Passwords do not match');
        }
    }
}

function showSuccessMessage(message) {
    alert(message + ' (Demo mode - no backend connected)');
}

function closeAllModals() {
    if (menu.classList.contains('bx-x')) {
        menu.classList.remove('bx-x');
        navbar.classList.remove('open');
    }
}







