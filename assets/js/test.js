document.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = document.querySelector(".submit")
    console.log(text.value);
}
)
