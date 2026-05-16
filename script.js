// const input = document.querySelector("#text")
const passage = document.querySelector(".passage p")
const resetBtn = document.querySelector(".reset")
const startBtn = document.querySelector(".not-started button")
const notStartedCon = document.querySelector(".not-started")
const wpmSpan = document.querySelector('.wpm')
const accuracySpan = document.querySelector('.accuracy')
const timeSpan = document.querySelector('.time')
const personalBestSpan = document.querySelector('.personal-best')
const difficultyInput = document.querySelector('.difficulty')
const modeInput = document.querySelector('.mode')
const resultsCon = document.querySelector('.results')
const resultWpm = document.querySelector('.results .wpm')
const resultAccuracy = document.querySelector('.results .accuracy')
const resultCharacter = document.querySelector('.results .character')
const goAgainBtn = document.querySelector('.go-again')


async function loadData() {
    const response = await fetch('data.json')
    return await response.json()
}

// Wait for the page to load
window.addEventListener('load', async () => {
    // Get passages from json file
    const data = await loadData()
    let text = 'sun rose over the quiet town'

    const personalBest = localStorage.getItem('personal-best');
    personalBestSpan.textContent = personalBest || "00"

    // List of modifier keys to ignore
    const ignoredKeys = ["Shift", "Control", "Alt", "Meta"]

    let totalWords
    let timeIntervalId = ''
    let i = 0
    let count = 0
    let wpm
    let accuracy
    let totalWrongChar = 0
    let mode = 'timed'

    let spans
    const splitPassage = () => {
        // Split the passage into single characters
        passage.innerHTML = text
            .split("")
            .map(char => `<span>${char}</span>`)
            .join("")
        spans = passage.querySelectorAll("span")

        totalWords = text.split(" ").length
    }
    splitPassage()

    const calculateWPM = () => {
        return parseInt((totalWords / count) * 60)
    }

    const calculateAccuracy = () => {
        return parseInt(((text.length - totalWrongChar) / text.length) * 100)
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const changeDifficulty = (difficulty) => {
        const randomNo = getRandomInt(0, 9)

        switch (difficulty) {
            case 'easy':
                text = data.easy[randomNo].text
                break
            case 'medium':
                text = data.medium[randomNo].text
                break
            case 'hard':
                text = data.hard[randomNo].text
                break
        }

        passage.textContent = text
        splitPassage()

        notStartedCon.style.display = ''
        timeSpan.textContent = '0:00'
        clearInterval(timeIntervalId)
        document.removeEventListener('keydown', type)
    }
    // changeDifficulty('easy')

    const chooseMode = () => {
        switch (mode) {
            case 'timed':
                timedMode(30)
                break
            case 'passage':
                passageMode()
                break
        }
    }

    const timedMode = (sec) => {
        console.log("timeed mode");

        let time = (sec - count).toString().padStart(2, '0')
        count++
        timeSpan.textContent = `0:${time}`

        if (timeIntervalId == '') {
            timeIntervalId = setInterval(() => {
                time = (sec - count).toString().padStart(2, '0')
                timeSpan.textContent = `0:${time}`
                count++
            }, 1000)
            setTimeout(testFinished, sec * 1000)
        }
    }

    const passageMode = (i) => {
        if (i == text.length) {
            testFinished()
        }
        if (timeIntervalId == '') {
            timeIntervalId = setInterval(() => {
                count++
            }, 1000)
        }
    }

    const testFinished = () => {
        clearInterval(timeIntervalId)
        document.removeEventListener('keydown', type)

        wpm = calculateWPM()
        accuracy = calculateAccuracy()
        wpmSpan.textContent = wpm
        accuracySpan.textContent = `${accuracy}%`

        console.log("Test completed in", count, "seconds")
        console.log(wpm, accuracy)

        resultsCon.classList.remove('hidden')
        resultWpm.textContent = wpm
        resultAccuracy.textContent = `${accuracy}%`
        resultCharacter.textContent = `${totalWrongChar}/${spans.length}`

        // Set personal best if new wpm is higher
        if (personalBest < wpm) {
            localStorage.setItem('personal-best', wpm)
            personalBestSpan.textContent = personalBest
        }
    }

    const start = () => {
        notStartedCon.style.display = 'none'
        spans[0].classList.add('cursor')
        chooseMode()
        // Handle input form keyboard
        document.addEventListener('keydown', type)
    }

    const reset = () => {
        i = 0
        count = 0
        wpm = 0
        accuracy = 0
        totalWrongChar = 0

        spans.forEach((span) => {
            span.classList.remove('correct')
            span.classList.remove('incorrect')
            span.classList.add('normal')
        })
        spans[spans.length - 1].classList.remove('cursor')
        spans[0].classList.add('cursor')
        chooseMode()
        // Handle input form keyboard
        document.addEventListener('keydown', type)
    }

    const type = (e) => {
        // console.log(e.key)
        // Exit early if the key is in the ignore list
        if (ignoredKeys.includes(e.key)) return

        if (e.key == "Backspace") {
            if (i > 0) i--
            spans[i].classList.add('normal')
        } else {
            if (e.key == text[i]) {
                spans[i].classList.add('correct')
                spans[i].classList.remove('normal')
                i++
            } else {
                spans[i].classList.add('incorrect')
                spans[i].classList.remove('normal')
                i++
                totalWrongChar++
            }

            if (i < spans.length) {
                spans[i - 1].classList.remove('cursor')
                spans[i].classList.add('cursor')
            }
        }
        passageMode(i)
    }

    // Start the typing test
    startBtn.addEventListener('click', start)

    // Reset and start from begining
    resetBtn.addEventListener('click', reset)

    difficultyInput.addEventListener('click', (e) => {
        changeDifficulty(e.target.value)
    })

    modeInput.addEventListener('click', (e) => {
        mode = e.target.value
    })

    goAgainBtn.addEventListener('click', ()=>{
        resultsCon.classList.add('hidden')
        reset()
    })
})


// input.addEventListener("input", (e) => {
//     if (e.target.value.slice(-1) == text[i]) {
//         spans[i].style.color = "limegreen"
//     } else {
//         spans[i].style.color = "red"
//     }
//     i++
// })