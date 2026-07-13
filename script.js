import { calculateAccuracy, calculateWPM, formatTime } from './stats.js'

const passage = document.querySelector('.passage p')
const resetBtn = document.querySelector('.reset')
const startBtn = document.querySelector('.not-started button')
const notStartedCon = document.querySelector('.not-started')
const wpmSpan = document.querySelector('.wpm')
const accuracySpan = document.querySelector('.accuracy')
const timeSpan = document.querySelector('.time')
const personalBestSpan = document.querySelector('.personal-best')
const difficultyInput = document.querySelector('.difficulty')
const modeInput = document.querySelector('.mode')
const timeSelect = document.querySelector('#time-select')
const customDurationInput = document.querySelector('#custom-duration')
const resultsCon = document.querySelector('.results')
const resultWpm = document.querySelector('.results .wpm')
const resultAccuracy = document.querySelector('.results .accuracy')
const resultCharacter = document.querySelector('.results .character')
const goAgainBtn = document.querySelector('.go-again')

const fallbackData = {
    easy: [{ text: 'The quick brown fox jumps over the lazy dog.' }],
    medium: [{ text: 'Practice makes progress when you stay consistent and focused.' }],
    hard: [{ text: 'Precision, clarity, and calm focus are the hallmarks of strong typing habits.' }]
}

async function loadData() {
    try {
        const response = await fetch('data.json')
        if (!response.ok) throw new Error('Failed to load data')
        return await response.json()
    } catch {
        return fallbackData
    }
}

window.addEventListener('load', async () => {
    const data = await loadData()
    let text = 'sun rose over the quiet town'
    const loadPersonalBest = () => parseInt(localStorage.getItem('personal-best'), 10) || 0
    personalBestSpan.textContent = loadPersonalBest() || '00'

    const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'Escape']

    let timeIntervalId = null
    let timeoutId = null
    let currentIndex = 0
    let elapsedSeconds = 0
    let correctCharacters = 0
    let totalWrongChar = 0
    let mode = 'timed'
    let durationSeconds = 60
    let started = false
    let completed = false
    let spans = []
    let typedStatuses = []

    const splitPassage = () => {
        passage.innerHTML = text
            .split('')
            .map((char) => `<span>${char}</span>`)
            .join('')
        spans = Array.from(passage.querySelectorAll('span'))
    }

    const updateStats = () => {
        const currentWpm = calculateWPM(correctCharacters, elapsedSeconds)
        const currentAccuracy = calculateAccuracy(currentIndex - totalWrongChar, currentIndex)
        const remainingTime = mode === 'timed'
            ? Math.max(0, durationSeconds - elapsedSeconds)
            : elapsedSeconds

        wpmSpan.textContent = currentWpm.toString().padStart(2, '0')
        accuracySpan.textContent = `${currentAccuracy}%`
        timeSpan.textContent = mode === 'timed'
            ? formatTime(remainingTime)
            : formatTime(remainingTime)
    }

    const resetStats = () => {
        wpmSpan.textContent = '00'
        accuracySpan.textContent = '0%'
        timeSpan.textContent = mode === 'timed' ? formatTime(durationSeconds) : '0:00'
    }

    const clearTimers = () => {
        if (timeIntervalId) {
            clearInterval(timeIntervalId)
            timeIntervalId = null
        }
        if (timeoutId) {
            clearTimeout(timeoutId)
            timeoutId = null
        }
    }

    const renderCursor = () => {
        spans.forEach((span) => span.classList.remove('cursor'))
        if (spans[currentIndex]) {
            spans[currentIndex].classList.add('cursor')
        }
    }

    const resetCharacters = () => {
        spans.forEach((span) => {
            span.classList.remove('correct', 'incorrect', 'cursor')
            span.classList.add('normal')
        })
        renderCursor()
    }

    const finishTest = () => {
        if (completed) return
        completed = true
        started = false
        clearTimers()
        document.removeEventListener('keydown', handleTyping)

        const finalWpm = calculateWpmForCompletedTest()
        const finalAccuracy = calculateAccuracy(currentIndex - totalWrongChar, currentIndex)

        wpmSpan.textContent = finalWpm.toString().padStart(2, '0')
        accuracySpan.textContent = `${finalAccuracy}%`

        resultsCon.classList.remove('hidden')
        resultWpm.textContent = finalWpm
        resultAccuracy.textContent = `${finalAccuracy}%`
        resultCharacter.textContent = `${correctCharacters}/${spans.length}`

        const pb = loadPersonalBest()
        if (pb < finalWpm) {
            localStorage.setItem('personal-best', finalWpm)
            personalBestSpan.textContent = finalWpm
        }
    }

    const calculateWpmForCompletedTest = () => {
        if (elapsedSeconds <= 0) return 0
        return calculateWPM(correctCharacters, elapsedSeconds)
    }

    const startTimer = () => {
        clearTimers()
        started = true
        completed = false
        elapsedSeconds = 0
        timeSpan.textContent = mode === 'timed' ? formatTime(durationSeconds) : '0:00'
        timeIntervalId = setInterval(() => {
            elapsedSeconds += 1
            updateStats()
            if (mode === 'timed' && elapsedSeconds >= durationSeconds) {
                finishTest()
            }
        }, 1000)

        if (mode === 'timed') {
            timeoutId = setTimeout(() => {
                finishTest()
            }, durationSeconds * 1000)
        }
    }

    const start = () => {
        notStartedCon.style.display = 'none'
        resultsCon.classList.add('hidden')
        currentIndex = 0
        elapsedSeconds = 0
        correctCharacters = 0
        totalWrongChar = 0
        typedStatuses = []
        resetStats()
        splitPassage()
        resetCharacters()
        startTimer()
        document.addEventListener('keydown', handleTyping)
    }

    const reset = () => {
        clearTimers()
        started = false
        completed = false
        currentIndex = 0
        elapsedSeconds = 0
        correctCharacters = 0
        totalWrongChar = 0
        typedStatuses = []
        resetStats()
        splitPassage()
        resetCharacters()
        notStartedCon.style.display = ''
        resultsCon.classList.add('hidden')
        document.removeEventListener('keydown', handleTyping)
    }

    function handleTyping(e) {
        if (ignoredKeys.includes(e.key) || completed) return

        if (!started) {
            startTimer()
        }

        if (e.key === 'Backspace') {
            e.preventDefault()
            if (currentIndex > 0) {
                currentIndex -= 1
                const previousSpan = spans[currentIndex]
                const previousStatus = typedStatuses.pop()
                previousSpan.classList.remove('correct', 'incorrect')
                previousSpan.classList.add('normal')
                if (previousStatus === 'correct') {
                    correctCharacters = Math.max(0, correctCharacters - 1)
                } else if (previousStatus === 'incorrect') {
                    totalWrongChar = Math.max(0, totalWrongChar - 1)
                }
                renderCursor()
                updateStats()
            }
            return
        }

        if (e.key.length !== 1) return

        e.preventDefault()
        const expectedChar = text[currentIndex]
        const currentSpan = spans[currentIndex]

        if (!currentSpan) return

        if (e.key === expectedChar) {
            currentSpan.classList.add('correct')
            currentSpan.classList.remove('incorrect', 'normal')
            currentIndex += 1
            correctCharacters += 1
            typedStatuses.push('correct')
        } else {
            currentSpan.classList.add('incorrect')
            currentSpan.classList.remove('correct', 'normal')
            currentIndex += 1
            totalWrongChar += 1
            typedStatuses.push('incorrect')
        }

        if (currentIndex < spans.length) {
            renderCursor()
        } else {
            finishTest()
        }

        updateStats()
    }

    const changeDifficulty = (difficulty) => {
        const randomNo = Math.floor(Math.random() * 10)
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

        reset()
    }

    const setTimingControls = () => {
        const disabled = mode !== 'timed'
        timeSelect.disabled = disabled
        customDurationInput.disabled = disabled
    }

    const chooseMode = (nextMode) => {
        mode = nextMode
        setTimingControls()
        if (!started) {
            resetStats()
        } else {
            updateStats()
        }
    }

    const updateDuration = (nextDuration) => {
        const parsedValue = Number.parseInt(nextDuration, 10)
        if (Number.isFinite(parsedValue) && parsedValue > 0) {
            durationSeconds = Math.min(300, Math.max(10, parsedValue))
        }
        if (!started) {
            resetStats()
        }
    }

    timeSelect.addEventListener('change', (e) => {
        customDurationInput.value = ''
        updateDuration(e.target.value)
    })

    customDurationInput.addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            updateDuration(e.target.value)
        }
    })

    changeDifficulty('easy')
    setTimingControls()

    startBtn.addEventListener('click', start)
    resetBtn.addEventListener('click', reset)

    difficultyInput.addEventListener('change', (e) => {
        if (e.target.matches('input[type="radio"]')) {
            changeDifficulty(e.target.value)
        }
    })

    modeInput.addEventListener('change', (e) => {
        if (e.target.matches('input[type="radio"]')) {
            chooseMode(e.target.value)
        }
    })

    goAgainBtn.addEventListener('click', () => {
        start()
    })
})