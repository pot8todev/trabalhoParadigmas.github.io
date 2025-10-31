const PALETTE = {
    empty: 'white',
    correctAnswer: 'blue',
    lastAlocated: 'salmon',
    recentlyOccupied: '#6C3BAA',
    occupied: 'purple',
};
let defaultRegisters = [];// {register, color, name}
let lastAlocated = [];
let randomRegisterAmount = 0;

// recognize the command
document.addEventListener("submit", (event) => {
    event.preventDefault();
    const history = document.querySelector((".history"));
    const historyElement = document.createElement("div");

    const input = document.querySelector(".submit");
    const oldButton = document.getElementById("mainButton");
    const oldButtonClone = oldButton.cloneNode(true); //
    var texto = input.value.trim(); //user input text
    // console.log(texto);
    input.value = " ";// resets the textbox


    // --- Destroy previous random registers ---
    const randomContainer = document.querySelector(".randomRegister-Container");
    randomContainer.innerHTML = ""; // remove all children


    // Run your algorithm after generating new registers

    // --- Extract command ---
    const commandParts = texto.trim().split(" ");
    const numberCommandElements = commandParts.length;
    // console.log(commandParts.length);
    const command = commandParts[0]
    if (command === "new") {
        const requiredNumberCommands = 3;// <new><name><amount>
        if (numberCommandElements === requiredNumberCommands) {
            const name = commandParts[1];
            const quantityOfRegisters = parseInt(commandParts[2]);
            const alreadyExists = Array.from(history.children).some(el => el.textContent.includes(name))

            if (!alreadyExists) {

                console.log("Nome:", name);
                console.log("quantidade:", quantityOfRegisters);
                createRandomRegisters(quantityOfRegisters);

                // Update global variable if needed
                randomRegisterAmount = quantityOfRegisters;

                // Now run the allocation algorithm
                allocationStrategy(quantityOfRegisters);
                attachRadioListeners();
                historyElement.className = "box";
                historyElement.textContent = name + " : " + quantityOfRegisters;
                historyElement.value = name;

                history.appendChild(historyElement);
            }
            else {
                warning("sorry, this name is already in use, chose another");
            }
        }
        else {
            warning(numberCommandElements < requiredNumberCommands ? "too few" : "too many", "commands");
        }
    }
    else if (command === "del" || command === "delete") {
        const requiredNumberCommands = 2;//<del><name>

        if (numberCommandElements === requiredNumberCommands) {

        }
        else {

            warning(numberCommandElements < requiredNumberCommands ? "too few" : "too many", "commands");
        }


    }
    // --- substitui o botão ---
    const newButton = document.createElement("button");
    newButton.id = "confirmButton";
    newButton.textContent = "Confirm";
    newButton.type = "button"; // importante! evita submeter de novo o form


    // substitui no DOM
    oldButton.replaceWith(newButton);

    input.style.display = "none";
    // adiciona funcionalidade ao novo botão
    newButton.addEventListener("click", () => {
        console.log("Confirmed!");
        defaultRegisters.forEach(item => {
            if (item.register.style.backgroundColor === PALETTE.correctAnswer) {
                item.color = PALETTE.lastAlocated;
            }
            if (item.register.style.backgroundColor === PALETTE.lastAlocated) {
                item.color = PALETTE.recentlyOccupied;
            }
            item.register.style.backgroundColor = item.color;
        });


        randomContainer.innerHTML = ""; // remove all children
        input.style.display = "block";
        newButton.replaceWith(oldButtonClone);
        randomRegisterAmount = 0;
    });
})
// Main part of the code
document.addEventListener('DOMContentLoaded', () => {
    // randomRegisterAmount = getRandomInt(1, 7);

    lastAlocated = [];
    // createRandomRegisters(randomRegisterAmount);
    createDefaultRegisters(defaultRegisters, lastAlocated);

    //if register exist in dR and lA
    defaultRegisters.forEach(item => {
        if (lastAlocated.some(last => last === item.register)) {
            item.color = PALETTE.lastAlocated;
        }
        item.register.style.backgroundColor = item.color;
    });


    // --- Define runAlgorithm inside same scope ---
    allocationStrategy(randomRegisterAmount);

    attachRadioListeners();
});

//----- Utility ------

//random integer generator
function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function sleep(seconds) {
    return new Promise(resolve => {
        setTimeout(resolve, seconds * 1000);
    })
}
function resetRegisters(defaultRegisters) { // reset their original color
    defaultRegisters.forEach(item => {
        item.register.style.backgroundColor = item.color; // back to base color
    });
}
//----- Starting Up Registers ------
function createRandomRegisters(randomRegisterAmount) {
    const randomRegisterContainer = document.querySelector('.randomRegister-Container');

    // --- Create  random registers ---
    for (let i = 0; i < randomRegisterAmount; i++) {
        const randomRegister = document.createElement('div');
        randomRegister.className = 'randomRegister';
        randomRegister.style.backgroundColor = PALETTE.occupied;
        randomRegisterContainer.appendChild(randomRegister);
    }
}
function createDefaultRegisters(defaultRegisters, lastAlocated) {

    const container = document.querySelector('.register-container');
    const registerAmount = 40;

    // --- Create static registers ---
    // TOFIX  change name of variables
    let isLastAlocated = false;
    let isFirst = true;
    let isFirst_ever = true;

    for (let i = 0; i < registerAmount; i++) {
        const register = document.createElement('div');
        let isRegisterOccupied = Math.random() < 0.2;
        register.className = 'register';

        if (isRegisterOccupied) {// odds of beign occupied
            if (isLastAlocated) {
                lastAlocated.push(register);
            } else if (isFirst_ever || (isFirst && getRandomInt(1, 10) < 2)) {
                lastAlocated.length = 0;//to empty the vector
                lastAlocated.push(register);

                isLastAlocated = true;
                isFirst = false;
            } else {
                isFirst = false;
                isLastAlocated = false;
            }
            defaultRegisters.push({ register, color: PALETTE.occupied });
            isFirst_ever = false;
        } else {
            isFirst = true;
            isLastAlocated = false;
            defaultRegisters.push({ register, color: PALETTE.empty });
        }

        container.appendChild(register);
    }

}

//----------- Allocation algorithms ----------------

// ----- Global function -----
function allocationStrategy(randomRegisterAmount) {
    const selected = document.querySelector('input[name="checked"]:checked').value;
    // console.log("Selected:", selected);
    let foundMatch = false;

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


    if (!foundMatch && randomRegisterAmount != 0) {
        warning("No available space! Please delete something.");
    }
}
function firstFit(defaultRegisters, randomRegisterAmount) {
    let currentBlock = [];
    let foundMatch = false;

    for (let index = 0; index < defaultRegisters.length; index++) {
        const item = defaultRegisters[index];

        if (foundMatch) break;

        if (item.color === PALETTE.empty) {
            currentBlock.push(item.register);

            if (currentBlock.length === randomRegisterAmount) {
                currentBlock.forEach(blankSpace => {
                    blankSpace.style.backgroundColor = PALETTE.correctAnswer;//styles without changing proprierty
                });
                foundMatch = true;
                break;
            }
        } else {
            currentBlock = [];
        }
    }

    if (!foundMatch) {
        console.log("nao ha lugar valido");
    }
    return foundMatch;
}
function nextFit(defaultRegisters, randomRegisterAmount) {
    let newArray = defaultRegisters;// to reenterpret the start of the list
    let lastAlocatedIndex = -1;

    // Find the (PALETTE.lastAlocated) register
    for (let i = 0; i < defaultRegisters.length; i++) {
        if (defaultRegisters[i].register.style.backgroundColor === PALETTE.lastAlocated) {
            lastAlocatedIndex = i;
            break;
        }
    }

    if (lastAlocatedIndex === -1) {
        console.log("Nenhum registro do ultimo registrador encontrado, usando firstFit normalmente");
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
    let currentBlock = [];// bloco com a sequencia de registradores livres atual
    let allBlankBlocks = []; // vetor  de blacos
    let exactMatch = null;
    let bestBlock;//lista de registradores, do bloco mais apropiado

    for (let index = 0; index < defaultRegisters.length; index++) {
        const item = defaultRegisters[index];

        if (item.color === PALETTE.empty) {
            currentBlock.push(item);

        } else {// adds to validBlocks when it breaks

            if (currentBlock.length === randomRegisterAmount) {// best case, quit
                exactMatch = currentBlock;
                break;
            }
            allBlankBlocks.push(currentBlock);
            currentBlock = [];

        }
    }

    //adiciona ultimo elemento, se o 
    if (!exactMatch && currentBlock.length > 0) {
        if (currentBlock.length === randomRegisterAmount) {
            exactMatch = currentBlock;
        } else {
            allBlankBlocks.push(currentBlock);
        }
    }

    if (exactMatch) {
        bestBlock = exactMatch;
        console.log("Match exato encontrado!");
    }
    else {

        let validBlocks = allBlankBlocks.filter(block => block.length >= randomRegisterAmount);// o bloco deve ser maior ou igual a qnt dados alocados 
        if (validBlocks.length === 0) {
            console.log("nao ha lugar valido");
            return false;
        }
        // Find the smallest valid block (Best Fit)
        bestBlock = validBlocks[0];
        validBlocks.forEach(block => {
            if (block.length <= bestBlock.length) { //BEST FIT strategy
                bestBlock = block;
            }
        });
        // Allocate in the best fit block
    }

    for (let i = 0; i < randomRegisterAmount; i++) {
        bestBlock[i].register.style.backgroundColor = PALETTE.correctAnswer;
    }
    console.log(`Allocated ${randomRegisterAmount} registers in block of size ${bestBlock.length}`);
    return true;
}
function worstFit(defaultRegisters, randomRegisterAmount) {
    let currentBlock = [];
    let allBlankBlocks = []; // vector of  possible solutions
    let exactMatch = null;
    let worseBlock = null;

    for (let index = 0; index < defaultRegisters.length; index++) {
        const item = defaultRegisters[index];

        if (item.color === PALETTE.empty) {
            currentBlock.push(item);

        } else {// adds to validBlocks when it breaks

            if (currentBlock.length === randomRegisterAmount) {// best case, quit
                exactMatch = currentBlock;
                break;
            }
            allBlankBlocks.push(currentBlock);
            currentBlock = [];

        }
    }

    //adiciona ultimo elemento, se o 
    if (!exactMatch && currentBlock.length > 0) {
        if (currentBlock.length === randomRegisterAmount) {
            exactMatch = currentBlock;
        } else {
            allBlankBlocks.push(currentBlock);
        }
    }

    if (exactMatch) {
        worseBlock = exactMatch;
        console.log("Match exato encontrado!");
    }
    else {

        let validBlocks = allBlankBlocks.filter(block => block.length >= randomRegisterAmount);// o bloco deve ser maior ou igual a qnt dados alocados 
        if (validBlocks.length === 0) {
            console.log("nao ha lugar valido");
            return false;
        }
        // Find the smallest valid block (Best Fit)
        worseBlock = validBlocks[0];
        validBlocks.forEach(block => {
            if (block.length >= worseBlock.length) { //WORSE FIT strategy
                worseBlock = block;
            }
        });
        // Allocate in the best fit block
    }

    for (let i = 0; i < randomRegisterAmount; i++) {
        worseBlock[i].register.style.backgroundColor = PALETTE.correctAnswer;
    }
    console.log(`Allocated ${randomRegisterAmount} registers in block of size ${worseBlock.length}`);
    return true;
}

function attachRadioListeners() {
    document.querySelectorAll('input[name="checked"]').forEach(radio => {
        radio.addEventListener('change', async () => {
            resetRegisters(defaultRegisters);
            await sleep(0.15);
            allocationStrategy(randomRegisterAmount);
        });
    });
}
function warning(warningText) {
    const warning = document.getElementById("warning");
    warning.textContent = warningText;
    warning.style.display = "block";
    setTimeout(() => warning.style.display = "none", 3000);

    defaultRegisters.forEach(item => {
        if (item.register.style.backgroundColor === PALETTE.empty) {
            item.register.style.backgroundColor = "pink";
        }
    });
}
