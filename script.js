// const input = document.querySelector("#text")
const passage = document.querySelector(".passage p")
const reset = document.querySelector(".reset")
const start = document.querySelector(".not-started button")
const notStartedCon = document.querySelector(".not-started")
const wpmSpan = document.querySelector('.wpm')
const accuracySpan = document.querySelector('.accuracy')
const timeSpan = document.querySelector('.time')
const personalBestSpan = document.querySelector('.personal-best')
const difficultyInput = document.querySelector('.difficulty')
// const modeInput = document.querySelector('.mode')



let i = 0
// List of modifier keys to ignore
const ignoredKeys = ["Shift", "Control", "Alt", "Meta"]

async function loadData() {
    const response = await fetch('data.json')
    return await response.json()
}

// Wait for the page to load
window.addEventListener('load', async () => {
    // Get passages from json file
    const data = await loadData()
    let text = 'sun rose over the quiet town' //data.easy[0].text
    const totalWords = text.split(" ").length
    
    const personalBest = localStorage.getItem('personal-best');
    personalBestSpan.textContent = personalBest || "00"
    
    let timeIntervalId
    let count = 0
    let wpm
    let accuracy
    let totalWrongChar = 0
    
    const splitPassage = () => {
        // Split the passage into single characters
        passage.innerHTML = text
            .split("")
            .map(char => `<span>${char}</span>`)
            .join("")
        const spans = passage.querySelectorAll("span")
    }
    splitPassage()

    const testFinished = () => {
        console.log("Test completed in", count, "seconds")
        clearInterval(timeIntervalId)
        wpm = calculateWPM()
        accuracy = calculateAccuracy()

        console.log(wpm, accuracy)
        wpmSpan.textContent = wpm
        accuracySpan.textContent = `${accuracy}%`

        // Set personal best if new wpm is higher
        if (personalBest < wpm) {
            localStorage.setItem('personal-best', wpm)
            personalBestSpan.textContent = personalBest
        }
    }

    const calculateWPM = () => {
        return (totalWords / count) * 60
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
    }
    // changeDifficulty('easy')

    difficultyInput.addEventListener('click', (e) => {
        changeDifficulty(e.target.value)
    })

    document.addEventListener('keydown', (e) => {
        // console.log(e.key)
        // Exit early if the key is in the ignore list
        if (ignoredKeys.includes(e.key)) return
        else if (e.key == "Backspace") {
            if (i > 0) i--
            spans[i].style.color = "white"
        }
        else if (e.key == text[i]) {
            spans[i].style.color = "limegreen"
            i++
        } else {
            spans[i].style.color = "red"
            i++
            totalWrongChar++
        }
        if (i == text.length) {
            testFinished()
            return
        }
    })

    // Reset and start from begining
    reset.addEventListener('click', () => {
        i = 0
        count = 0
        wpm = 0
        accuracy = 0
        totalWrongChar = 0

        spans.forEach((span) => {
            span.style.color = 'white'
        })

        timeIntervalId = setInterval(() => {
            // console.log(count++)
            timeSpan.textContent = `0:${count++}`
        }, 1000)
    })
        
    // Start the typing test
    start.addEventListener('click', () => {
        notStartedCon.style.display = 'none'
        timeIntervalId = setInterval(() => {
            // console.log(count++)
            timeSpan.textContent = `0:${count++}`
        }, 1000)
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