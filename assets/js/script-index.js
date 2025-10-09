function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Example:
console.log(getRandomInt(1, 10)) // Random number from 1 to 10

// Declare drag functions outside
function dragStart(Event, randomRegisterContainer) {
    randomRegisterContainer.isDragging = true;
    randomRegisterContainer.initialX = Event.clientX - (randomRegisterContainer.xOffset || 0);
    randomRegisterContainer.initialY = Event.clientY - (randomRegisterContainer.yOffset || 0);
}

function drag(Event, randomRegisterContainer) {
    if (randomRegisterContainer.isDragging) {
        Event.preventDefault();
        //also, it prevents that the mouse select outside the container
        let dX = Event.clientX - randomRegisterContainer.initialX;//so tho box dont move to the right diagonal of the mouse
        let dY = Event.clientY - randomRegisterContainer.initialY;

        randomRegisterContainer.xOffset = dX;
        randomRegisterContainer.yOffset = dY;
        randomRegisterContainer.style.cursor = 'grabbing';
        randomRegisterContainer.style.transform = `translate(${dX}px, ${dY}px)`;
    }
}

function dragEnd(Event, randomRegisterContainer) {
    randomRegisterContainer.isDragging = false;
    randomRegisterContainer.style.cursor = 'grab';
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.register-container');
    const randomRegisterContainer = document.querySelector('.randomRegister-Container'); // added dot
    const randInt = getRandomInt(1, 5);
    const registerAmount = 40;
    const tickets = registerAmount;

    let lastAlocated = [];// 
    let isFirstPurple_Row = true;
    let isFirstPurple_ever = true;
    let isViolet = null;// 


    for (let i = 0; i < randInt; i++) { //user draggable box
        const randomRegister = document.createElement('div');
        randomRegister.className = 'randomRegister';
        randomRegisterContainer.appendChild(randomRegister); // added register parameter
    }


    for (let i = 0; i < registerAmount; i++) {// static box
        const register = document.createElement('div');
        register.className = 'register';

        if (Math.random() < 0.5) {// randomly paints it purple

            if (isViolet === true) {//se o ultimo foi violet, esse tbm sera
                lastAlocated.push(register);
            }
            else if (isFirstPurple_ever || isFirstPurple_Row === true && (getRandomInt(1, 10) < 2)) {//se for o primeiro, existe a chance de ser violeta
                isViolet = true;//start 
                if (lastAlocated) {
                    lastAlocated = [];
                }

                lastAlocated.push(register);
                isFirstPurple_Row = false;
            }
            else {
                isFirstPurple_Row = false;
                register.style.backgroundColor = 'purple';
            }
            isFirstPurple_ever = false;
        }
        else { // se for um registrador livre
            isFirstPurple_Row = true;
            isViolet = false;
        } container.appendChild(register);

    }
    lastAlocated.forEach(register => {
        register.style.backgroundColor = 'blue';
    });

    // Make randomRegisterContainer draggable
    randomRegisterContainer.style.position = 'absolute';
    randomRegisterContainer.style.cursor = 'grab';
    let xOffset = 0;
    let yOffset = 0;

    // Call the functions with event listeners
    randomRegisterContainer.addEventListener('mousedown', (Event) => dragStart(Event, randomRegisterContainer));
    document.addEventListener('mousemove', (Event) => drag(Event, randomRegisterContainer));
    document.addEventListener('mouseup', (Event) => dragEnd(Event, randomRegisterContainer));
});
