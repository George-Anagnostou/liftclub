export const round = (value: number, precision: number) => {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
};

export const formatSetWeight = (weight: number | string) => {
  return typeof weight === "string" || weight === -1 ? 0 : weight;
};
