// const input = document.querySelector("#text")
const passage = document.querySelector(".passage p")

const text = 'The sun rose over the quiet town. Birds sang in the trees as people woke up and started their day. It was going to be a warm and sunny morning.'

passage.innerHTML = text
    .split("")
    .map(char => `<span>${char}</span>`)
    .join("")

const spans = passage.querySelectorAll("span")

let i = 0
// List of modifier keys to ignore
const ignoredKeys = ["Shift", "Control", "Alt", "Meta"];

document.addEventListener('keydown', (e) => {
    console.log(e.key)
    // Exit early if the key is in the ignore list
    if (ignoredKeys.includes(e.key)) {
        return;
    }
    if (e.key == "Backspace") {
        if (i > 0) i--
        spans[i].style.color = "white"
    }
    else if (e.key == text[i]) {
        spans[i].style.color = "limegreen"
        i++
    } else {
        spans[i].style.color = "red"
        i++
    }
})

// input.addEventListener("input", (e) => {
//     if (e.target.value.slice(-1) == text[i]) {
//         spans[i].style.color = "limegreen"
//     } else {
//         spans[i].style.color = "red"
//     }
//     i++
// })