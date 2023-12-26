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

registerLink.addEventListener('click', ()=> {
    container.classList.add('active');
});

loginLink.addEventListener('click', ()=> {
    container.classList.add('active');
});







