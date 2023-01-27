const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

// Using Fischer-Yates shuffle, gets the board generated with random items:

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

// Clone original array, loop through it and pick x number of random elements from array. x equals half the total number of items in the grid. Each picked item is pushed to a random position in grid:

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index=0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)

        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}



const generateMatchGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension');
    
    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number")
    }


    let createImage = function(src, id, alt) {
        let img = new Image();
        img.src = src;
        img.id = id;

        img.width = 130;
        img.height = 130;

        img.alt = alt;
        
        return img;
    };

    const pics = []

    pics.push(createImage('css/images/blueLight.png', 'image1', 'Two dancers under blue spotlight').outerHTML);
    pics.push(createImage('css/images/canCanThreeGirls.png', 'image2', 'Three can-can dancers').outerHTML);
    pics.push(createImage('css/images/contortion1.png', 'image3', 'Two contortion dancers').outerHTML);
    pics.push(createImage('css/images/sirens1.png', 'image4', 'Two singers wearing fake furs').outerHTML);
    pics.push(createImage('css/images/speakeasySocial.png', 'image5', 'A group of speakeasy dancers').outerHTML);
    pics.push(createImage('css/images/strongWomen.png', 'image6', 'Two dancers showing their strength').outerHTML);
    pics.push(createImage('css/images/kittyKatAndJesse.png', 'image7', 'A couple dancing').outerHTML);
    pics.push(createImage('css/images/gotIt.png', 'image8', 'Dancers bending backwards').outerHTML);
    pics.push(createImage('css/images/redDress.png', 'image9', 'A singer in a red dress').outerHTML);
    pics.push(createImage('css/images/beautyContest.png', 'image10', 'A group of performers posing').outerHTML);

    // alternate image option:
    // pics.push(createImage('css/images/jesSheFeathers.png', 'image11', 'A drag performer strutting').outerHTML);
    
    
    const picks = pickRandom(pics, (dimensions * dimensions)/2)

    const items = shuffle([...picks, ...picks])

    const frontPic = createImage('css/images/logo.png').outerHTML;

    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>`).join('')}
        <div>`

    // console.log(cards)

    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}


// Start game & enable Moves feature.
// Notes on timer feature, not yet added:
const startGame = () => {
    state.gameStarted = true;
    // selectors.start.classList.add('disabled');

    state.loop = setInterval(() => {
        // state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`;
        // selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000)
}

// Flip back unmatched cards:
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0;
}


// Option to start game by clicking one of the cards.
// Allows player to flip no more than 2 cards at a time. If 2 cards flipped, check if matched:
const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;

    if (!state.gameStarted) {
        startGame()
    }
    
    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        // if (flippedCards[0].innerText === flippedCards[1].innerText) {
        if (flippedCards[0].outerHTML === flippedCards[1].outerHTML) { 
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)

// If there are no more cards to flip, game is finished. Feature to add: winner text:
        if (!document.querySelectorAll('.card:not(.flipped)').length) {
            console.log('Winner!')
            
            setTimeout = (() => {
                selectors.boardContainer.classList.add('flipped')
                selectors.win.innerHTML = 
                    `<span class="win-text">
                        You Win!<br />
                        with <span class="highlight">${state.totalFlips}</span> moves<br />
                        under <span class="highlight">${state.totalTime}</span> seconds
                    </span>`

                clearInterval(state.loop)
            }, 1000)
        }
    }
}


// Allow upflipped cards on the DOM to flip when clicked / Call game to start:
const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        }

        else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }       
    })
}


generateMatchGame();
attachEventListeners();