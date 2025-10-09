const PALETTE = {
    occupied: 'purple',
    lastAlocated: 'salmon',
    correctAnswer: 'blue',
    empty: 'white',
};

// Utility: random integer generator
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function resetRegisters(defaultRegisters) {
    defaultRegisters.forEach(item => {
        item.register.style.backgroundColor = item.color; // back to base color
    });
}
// Drag functions
function dragStart(Event, element) {
    element.isDragging = true;
    element.initialX = Event.clientX - (element.xOffset || 0);
    element.initialY = Event.clientY - (element.yOffset || 0);
}

function drag(Event, element) {
    if (element.isDragging) {
        Event.preventDefault();
        const dX = Event.clientX - element.initialX;
        const dY = Event.clientY - element.initialY;

        element.xOffset = dX;
        element.yOffset = dY;
        element.style.cursor = 'grabbing';
        element.style.transform = `translate(${dX}px, ${dY}px)`;
    }
}

function dragEnd(Event, element) {
    element.isDragging = false;
    element.style.cursor = 'grab';
}

// Allocation algorithms
function firstFit(defaultRegisters, randomRegisterAmount) {
    let blankSpaceCounter = 0;
    let blankSpaceVector = [];
    let foundMatch = false;

    for (let index = 0; index < defaultRegisters.length; index++) {
        const item = defaultRegisters[index];

        if (foundMatch) break;

        if (item.color === PALETTE.empty) {
            blankSpaceVector.push(item.register);
            blankSpaceCounter++;

            if (blankSpaceCounter === randomRegisterAmount) {
                blankSpaceVector.forEach(blankSpace => {
                    blankSpace.style.backgroundColor = PALETTE.correctAnswer;//styles without changing proprierty
                });
                foundMatch = true;
                break;
            }
        } else {
            blankSpaceCounter = 0;
            blankSpaceVector = [];
        }
    }

    if (!foundMatch) {
        console.log("nao ha lugar valido");
    }
    return foundMatch;
}

function nextFit(defaultRegisters, randomRegisterAmount) {
    let newArray = defaultRegisters;
    let salmonIndex = -1;

    // Find the PALETTE.lastAlocated register
    for (let i = 0; i < defaultRegisters.length; i++) {
        if (defaultRegisters[i].register.style.backgroundColor === PALETTE.lastAlocated) {
            salmonIndex = i;
            break;
        }
    }

    if (salmonIndex === -1) {
        console.log("Nenhum registro salmon encontrado, usando firstFit normal");
        return firstFit(defaultRegisters, randomRegisterAmount);
    }

    // Build array starting after PALETTE.lastAlocated
    for (let i = salmonIndex; i < defaultRegisters.length; i++) {
        const register = defaultRegisters[i];
        if (register.register.style.backgroundColor === PALETTE.empty) {
            const firstHalf = defaultRegisters.slice(i);
            const secondHalf = defaultRegisters.slice(0, i);
            newArray = firstHalf.concat(secondHalf);
            break;
        }
    }

    return firstFit(newArray, randomRegisterAmount);
}

// Main block (runs after DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
    const randomRegisterContainer = document.querySelector('.randomRegister-Container');
    const container = document.querySelector('.register-container');

    const randomRegisterAmount = getRandomInt(1, 5);
    const registerAmount = 60;
    let defaultRegisters = [];

    // --- Create draggable random registers ---
    for (let i = 0; i < randomRegisterAmount; i++) {
        const randomRegister = document.createElement('div');
        randomRegister.className = 'randomRegister';
        randomRegister.style.backgroundColor = PALETTE.occupied;
        randomRegisterContainer.appendChild(randomRegister);
    }

    // --- Create static registers ---
    // TOFIX  change name of variables
    let isViolet = false;
    let isFirstPurple_Row = true;
    let isFirstPurple_ever = true;
    let lastAlocated = [];

    for (let i = 0; i < registerAmount; i++) {
        const register = document.createElement('div');
        register.className = 'register';

        if (Math.random() < 0.5) {
            if (isViolet) {
                lastAlocated.push(register);
                defaultRegisters.push({ register, color: PALETTE.occupied });
            } else if (isFirstPurple_ever || (isFirstPurple_Row && getRandomInt(1, 10) < 3)) {
                isViolet = true;
                isFirstPurple_Row = false;
                lastAlocated = [];
                defaultRegisters.forEach(item => item.isViolet = false);
                defaultRegisters.push({ register, color: PALETTE.lastAlocated });
                lastAlocated.push(register);
            } else {
                isFirstPurple_Row = false;
                isViolet = false;
                defaultRegisters.push({ register, color: PALETTE.occupied });
            }
            isFirstPurple_ever = false;
        } else {
            isFirstPurple_Row = true;
            isViolet = false;
            defaultRegisters.push({ register, color: PALETTE.empty });
        }

        container.appendChild(register);
    }

    // --- Paint colors (salmon for violet) ---
    defaultRegisters.forEach(item => {
        item.register.style.backgroundColor = item.color;
    });

    // --- Make draggable ---
    randomRegisterContainer.style.position = 'absolute';
    randomRegisterContainer.style.cursor = 'grab';

    randomRegisterContainer.addEventListener('mousedown', e => dragStart(e, randomRegisterContainer));
    document.addEventListener('mousemove', e => drag(e, randomRegisterContainer));
    document.addEventListener('mouseup', e => dragEnd(e, randomRegisterContainer));

    // --- Define runAlgorithm inside same scope ---
    function runAlgorithm() {
        const selected = document.querySelector('input[name="checked"]:checked').value;
        console.log("Selected:", selected);

        switch (selected) {
            case 'first':
                resetRegisters(defaultRegisters);
                firstFit(defaultRegisters, randomRegisterAmount);
                break;
            case 'best':
                resetRegisters(defaultRegisters);
                bestFit(defaultRegisters, randomRegisterAmount);
                break;

            case 'worst':
                resetRegisters(defaultRegisters);
                worstFit(defaultRegisters, randomRegisterAmount);
                break;
            case 'next':
                resetRegisters(defaultRegisters);
                nextFit(defaultRegisters, randomRegisterAmount);
                break;
            default:
                console.warn("Unknown algorithm selected");
        }
    }
    runAlgorithm();

    // --- Run when a radio is clicked ---
    document.querySelectorAll('input[name="checked"]').forEach(radio => {
        radio.addEventListener('change', () => runAlgorithm());
    });
});
