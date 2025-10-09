
const PALETTE = {
    occupied: 'purple',
    lastAlocated: 'salmon',
    correctAnswer: 'blue',
    empty: 'white',
};

//----- Utility:------
//random integer generator
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//stop function
function sleep(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);

    })
}
//-----

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
    let lastAlocatedIndex = -1;

    // Find the PALETTE.lastAlocated register
    for (let i = 0; i < defaultRegisters.length; i++) {
        if (defaultRegisters[i].register.style.backgroundColor === PALETTE.lastAlocated) {
            lastAlocatedIndex = i;
            break;
        }
    }

    if (lastAlocatedIndex === -1) {
        console.log("Nenhum registro salmon encontrado, usando firstFit normal");
        return firstFit(defaultRegisters, randomRegisterAmount);
    }

    // Build array starting after PALETTE.lastAlocated
    for (let i = lastAlocatedIndex; i < defaultRegisters.length; i++) {
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


function bestFit(defaultRegisters, randomRegisterAmount) {
    let blankSpaceCounter = 0;
    let currentBlankSpaceBlock = [];
    let blankBlocks = []; // vector of  possible solutions
    let foundMatch = false;

    for (let index = 0; index < defaultRegisters.length; index++) {
        const item = defaultRegisters[index];

        if (item.color === PALETTE.empty) {
            currentBlankSpaceBlock.push(item);
            blankSpaceCounter++;

        } else {// adds to validBlocks when it breaks

            if (currentBlankSpaceBlock.length === randomRegisterAmount) {// best case, quit
                foundMatch = true; break;
            }
            blankBlocks.push(currentBlankSpaceBlock);
            blankSpaceCounter = 0;
            currentBlankSpaceBlock = [];

        }
    }
    if (currentBlankSpaceBlock.length > 0) {
        blankBlocks.push(currentBlankSpaceBlock);
    }

    if (foundMatch) {
        let bestFitblock = blankBlocks[blankBlocks.length - 1]; //top vector is the one
        //
        bestFitblock.forEach(block => {
            block.register.style.backgroundColor = PALETTE.correctAnswer;
        });
        console.log("1 caso")
    }
    else {

        let validBlocks = blankBlocks.filter(block => block.length >= randomRegisterAmount);// o bloco deve ser maior ou igual a qnt dados alocados 
        if (validBlocks.length === 0) {
            console.log("nao ha lugar valido");
            return false;
        }
        // Find the smallest valid block (Best Fit)
        let bestFitBlock = validBlocks[0];
        validBlocks.forEach(block => {
            if (block.length <= bestFitBlock.length) { //BEST FIT strategy
                bestFitBlock = block;
            }
        });
        // Allocate in the best fit block
        for (let i = 0; i < randomRegisterAmount; i++) {
            bestFitBlock[i].register.style.backgroundColor = PALETTE.correctAnswer;
            console.log(`Allocated ${randomRegisterAmount} registers in block of size ${bestFitBlock.length}`);
        }
        foundMatch = true;
        console.log("2 caso")
    }
    return foundMatch;
}

function worstFit(defaultRegisters, randomRegisterAmount) {
    let blankSpaceCounter = 0;
    let currentBlankSpaceBlock = [];
    let blankBlocks = []; // vector of  possible solutions
    let foundMatch = false;

    for (let index = 0; index < defaultRegisters.length; index++) {
        const item = defaultRegisters[index];

        if (item.color === PALETTE.empty) {
            currentBlankSpaceBlock.push(item);
            blankSpaceCounter++;

        } else {// adds to validBlocks when it breaks

            if (currentBlankSpaceBlock.length === randomRegisterAmount) {// best case, quit
                foundMatch = true; break;
            }
            blankBlocks.push(currentBlankSpaceBlock);
            blankSpaceCounter = 0;
            currentBlankSpaceBlock = [];

        }
    }
    if (currentBlankSpaceBlock.length > 0) {
        blankBlocks.push(currentBlankSpaceBlock);
    }

    if (foundMatch) {
        let worstFitblock = blankBlocks[blankBlocks.length - 1]; //top vector is the one
        //
        worstFitblock.forEach(block => {
            block.register.style.backgroundColor = PALETTE.correctAnswer;
        });
        console.log("1 caso")
    }
    else {

        let validBlocks = blankBlocks.filter(block => block.length >= randomRegisterAmount);// o bloco deve ser maior ou igual a qnt dados alocados 
        if (validBlocks.length === 0) {
            console.log("nao ha lugar valido");
            return false;
        }
        // Find the smallest valid block (Best Fit)
        let worstFitBlock = validBlocks[0];
        validBlocks.forEach(block => {
            if (block.length >= worstFitBlock.length) { //WORSE FIT strategy
                worstFitBlock = block;
            }
        });
        // Allocate in the best fit block
        for (let i = 0; i < randomRegisterAmount; i++) {
            worstFitBlock[i].register.style.backgroundColor = PALETTE.correctAnswer;
            console.log(`Allocated ${randomRegisterAmount} registers in block of size ${worstFitBlock.length}`);
        }
        foundMatch = true;
        console.log("2 caso")
    }
    return foundMatch;
}

// Main block (runs after DOM is ready)
document.addEventListener('DOMContentLoaded', () => {
    const randomRegisterContainer = document.querySelector('.randomRegister-Container');
    const container = document.querySelector('.register-container');

    const randomRegisterAmount = getRandomInt(1, 7);
    const registerAmount = 100;
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

        if (Math.random() < 0.1) {//purple odds
            if (isViolet) {
                lastAlocated.push(register);
            } else if (isFirstPurple_ever || (isFirstPurple_Row && getRandomInt(1, 10) < 2)) {
                lastAlocated = [];
                lastAlocated.push(register);

                isViolet = true;
                isFirstPurple_Row = false;
            } else {
                isFirstPurple_Row = false;
                isViolet = false;
            }
            defaultRegisters.push({ register, color: PALETTE.occupied });
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
        lastAlocated.forEach(lastItemsAlocated => {
            if (item.register === lastItemsAlocated) {
                item.color = PALETTE.lastAlocated;
            }
        });
        item.register.style.backgroundColor = item.color;
    });


    // --- Define runAlgorithm inside same scope ---
    function runAlgorithm() {
        const selected = document.querySelector('input[name="checked"]:checked').value;
        console.log("Selected:", selected);
        foundMatch = false;

        switch (selected) {
            case 'first':
                resetRegisters(defaultRegisters);
                foundMatch = firstFit(defaultRegisters, randomRegisterAmount);
                break;
            case 'best':
                resetRegisters(defaultRegisters);
                foundMatch = bestFit(defaultRegisters, randomRegisterAmount);
                break;

            case 'worst':
                resetRegisters(defaultRegisters);
                foundMatch = worstFit(defaultRegisters, randomRegisterAmount);
                break;
            case 'next':
                resetRegisters(defaultRegisters);
                foundMatch = nextFit(defaultRegisters, randomRegisterAmount);
                break;

        }
        // if (!foundMatch) {
        //
        //     alert("not an available space, please consider deleting something");
        // }
    }
    runAlgorithm();

    document.querySelectorAll('input[name="checked"]').forEach(radio => {
        radio.addEventListener('change', async () => {
            resetRegisters(defaultRegisters);
            await sleep(0.2); // Wait 0.1 seconds
            runAlgorithm();
        });
    });
});
