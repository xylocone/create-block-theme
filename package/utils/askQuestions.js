import inquirer from "inquirer";

/**
 * Ask questions from the user and return the answers
 * @param {Array} questions An array of question objects
 * @returns answers
 */
export async function askQuestions(questions) {
  return await inquirer.prompt(questions);
}
