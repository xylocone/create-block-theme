import inquirer from "inquirer";

/**
 * Keep asking the user the same question until they answer
 * @param {Object} question Inquirer question object
 * @returns User answer to the question
 */
export async function askUntilAnswered(question) {
  let answer;

  while (!answer) {
    answer = (await inquirer.prompt([question]))[question.name];
  }

  return answer;
}
