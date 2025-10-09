function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Example:
console.log(getRandomInt(1, 10)) // Random number from 1 to 10

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.register-container');
    // const randomRegisterContainer = getDocumentById('randomRegister-Container');

    // for (let i = 0; i < getRandomInt(1,10); i++) {
    //     const register = document.createElement('div');
    //     register.className = 'register';
    //     register.innerHTML = '<p>.</p>';
    //     randomRegisterContainer.appendChild();
    // }
    for (let i = 0; i < 40; i++) {
        const register = document.createElement('div');
        register.className = 'register';
        register.innerHTML = '<p>.</p>';
        container.appendChild(register);
    }
});
