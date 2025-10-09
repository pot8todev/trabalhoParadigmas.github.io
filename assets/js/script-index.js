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
    //------------- paint the used registers -------------
    const randomRegisterContainer = document.querySelector('.randomRegister-Container');
    const container = document.querySelector('.register-container');

    const randRegisterAmout = getRandomInt(1, 5);
    const registerAmount = 60;

    let defualtRegisters = [];//register ande color
    let lastAlocated = [];// list of the last alocated registers
    let isViolet = false;
    let isFirstPurple_Row = true;
    let isFirstPurple_ever = true;


    for (let i = 0; i < randRegisterAmout; i++) { //user draggable box
        const randomRegister = document.createElement('div');
        randomRegister.className = 'randomRegister';
        randomRegisterContainer.appendChild(randomRegister); // added register parameter
        randomRegister.style.backgroundColor = 'purple';
    }

    for (let i = 0; i < registerAmount; i++) {// static box
        const register = document.createElement('div');
        register.className = 'register';

        if (Math.random() < 0.5) {// randomly paints it purple
            if (isViolet) {//se o ultimo foi violeta, esse tbm sera
                lastAlocated.push(register);
                defualtRegisters.push({ register: register, color: 'purple', isViolet: true });
            }
            else if (isFirstPurple_ever || (isFirstPurple_Row === true && (getRandomInt(1, 10) < 3))) {//se for o primeiro, existe a chance de ser violeta
                isViolet = true;//start 
                isFirstPurple_Row = false;
                lastAlocated = [];// esvazia sequencia 
                defualtRegisters.forEach(item => {
                    item.isViolet = false;// todos os outros violetas em potencial sao falsos
                });
                defualtRegisters.push({ register: register, color: 'purple', isViolet: true });//eleito novo violeta
                lastAlocated.push(register); // add to new sequence
            }
            else {
                isFirstPurple_Row = false;
                isViolet = false; // stop violet chain
                defualtRegisters.push({ register: register, color: 'purple', isViolet: false });
            }
            isFirstPurple_ever = false; // depois da primeira vez sempre acontece 
        }
        else { // se for um registrador livre
            isFirstPurple_Row = true;
            isViolet = false; // changed from null to false
        }

        container.appendChild(register);
    }

    defualtRegisters.forEach(item => { // changed parameter name
        if (item.isViolet) { // check the item's property, not the outer variable
            item.register.style.backgroundColor = 'salmon';
        }
        else {
            item.register.style.backgroundColor = item.color;
        }
    });

    //------------- Make randomRegisterContainer draggable-------------
    randomRegisterContainer.style.position = 'absolute';
    randomRegisterContainer.style.cursor = 'grab';

    // Call the functions with event listeners
    randomRegisterContainer.addEventListener('mousedown', (Event) => dragStart(Event, randomRegisterContainer));
    document.addEventListener('mousemove', (Event) => drag(Event, randomRegisterContainer));
    document.addEventListener('mouseup', (Event) => dragEnd(Event, randomRegisterContainer));
});
