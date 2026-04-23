export const generateSeoTitle = async (topic: string, hook: string): Promise<string> => {
  const base = `${hook}: ${topic}`.trim();
  const shortened = base.length > 90 ? `${base.slice(0, 87)}...` : base;
  return shortened.replace(/\s+/g, ' ');
};
