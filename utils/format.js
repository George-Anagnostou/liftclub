export const formatTime = (seconds) => {
  return (
    new Date(1000 * seconds)
      .toISOString()
      .substr(11, 8)
      .replace(/^[0:]+/, "") || 0
  );
};


