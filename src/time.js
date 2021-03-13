/** Values in milliseconds */
export const TWENTY_MINUTES = 1200000;
export const THIRTY_SECONDS = 30000;

/**
 * @param {number} time - a number in milliseconds representing the time to be formatted
 * @return {string[]} an array with two strings: minutes and seconds (padded)
 */
export const formatTime = (time) => {
  const formattingDate = new Date(time);
  return [
    formattingDate.getMinutes().toString(),
    formattingDate.getSeconds().toString().padStart(2, "0"),
  ];
};
