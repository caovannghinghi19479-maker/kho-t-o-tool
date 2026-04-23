export const generateDescription = (title: string, script: string): string => {
  const segments = script
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean)
    .slice(0, 8)
    .map((line, i) => `${String(i).padStart(2, '0')}:00 ${line}`);

  return `${title}\n\n${segments.join('\n')}\n\n#ai #video #automation`;
};
