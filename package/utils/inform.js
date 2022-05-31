import chalk from "chalk";
const { yellow, magenta, bgGreen, bgRed, blue } = chalk;

/**
 * Display an info message
 * @param {String} msg Info message
 * @param {Array} [stringData] Additional formatting data
 */
export function info(msg, ...stringData) {
  console.log(blue(msg), ...stringData.map((datum) => magenta(datum)));
}

/**
 * Display an error message
 * @param {String} msg The error message
 * @param {Array} [stringData] (optional) Additional formatting data
 */
export function error(msg, ...stringData) {
  console.error(
    `${bgRed("ERROR!")} ${msg}`,
    ...stringData.map((datum) => magenta(datum))
  );
}

/**
 * Display a warning message
 * @param {String} msg The warning message
 * @param {Array} [stringData] (optional) Additional formatting data
 */
export function warning(msg, ...stringData) {
  console.warn(
    `${yellow("WARNING!")} ${msg}`,
    ...stringData.map((datum) => magenta(datum))
  );
}

/**
 * Display a success message
 * @param {String} msg The success message
 * @param {Array} [stringData] (optional) Additional formatting data
 */
export function success(msg, ...stringData) {
  console.log(
    `${bgGreen("SUCCESS!")} ${msg}`,
    ...stringData.map((datum) => magenta(datum))
  );
}

/**
 * Display a "file does not exist" message
 * @param {String} path Path that does not exist
 * @param {boolean} [isWarning] If the message should be a warning. If false, an error is displayed instead.
 */
export function pathDoesNotExist(path, isWarning) {
  (isWarning ? warning : error)(`${magenta(path)} does not exist.`);
}
