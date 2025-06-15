// Function to check the user's answer
function checkAnswer() {
  // Step 1: Identify the correct answer
  const correctAnswer = "4";

  // Step 2: Retrieve the user's answer
  const selectedRadio = document.querySelector('input[name="quiz"]:checked');

  // Check if an answer was selected
  if (!selectedRadio) {
    document.getElementById("feedback").textContent =
      "Please select an answer!";
    return;
  }

  const userAnswer = selectedRadio.value;

  // Step 3: Compare the answers
  if (userAnswer === correctAnswer) {
    document.getElementById("feedback").textContent = "Correct! Well done.";
  } else {
    document.getElementById("feedback").textContent =
      "That's incorrect. Try again!";
  }
}

// Step 4: Add event listener to the submit button
document.getElementById("submit-answer").addEventListener("click", checkAnswer);
