const header = document.querySelector("header");

window.addEventListener("scroll",function() { 
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
    });
}

// Form validation and enhancement
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const submitBtn = form.querySelector('.main-btn');
        const inputs = form.querySelectorAll('input');
        
        // Real-time validation feedback
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateInput(input);
                }
            });
        });
        
        // Form submission handling
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Processing...';
                
                // Simulate form submission (replace with actual API call)
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = form.closest('.login') ? 'Login' : 'Register Now';
                    alert('Form submitted successfully! (Demo)');
                }, 2000);
            }
        });
    });
});

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    
    input.classList.remove('invalid', 'valid');
    
    if (input.hasAttribute('required') && !value) {
        isValid = false;
    }
    
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
    }
    
    if (input.type === 'password' && value && input.hasAttribute('minlength')) {
        isValid = value.length >= parseInt(input.getAttribute('minlength'));
    }
    
    if (input.type === 'checkbox' && input.hasAttribute('required')) {
        isValid = input.checked;
    }
    
    if (value || input.hasAttribute('required')) {
        input.classList.add(isValid ? 'valid' : 'invalid');
    }
    
    return isValid;
}







