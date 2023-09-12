let trigger = true

function toggleMode () {
  const button = document.querySelector('button')
  const body = document.body
  if (trigger === true) {
    body.classList.add('dark')
    button.innerHTML = '☀️'
    trigger = false
  } else {
    body.classList.remove('dark')
    button.innerHTML = '🌙'
    trigger = true
  }
}
