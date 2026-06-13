/**
 * Cubic ease-out. Progress is clamped to [0, 1].
 * @param {number} t - raw progress (0..1)
 * @returns {number} eased progress (0..1)
 */
export function easeOutCubic(t) {
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * Eased integer value for a count-up animation frame.
 * @param {number} target - final number to count up to
 * @param {number} progress - raw progress (0..1)
 * @returns {number} integer between 0 and target
 */
export function countValue(target, progress) {
  return Math.round(target * easeOutCubic(progress));
}
