// Text randomization function for demo mode
export function randomizeText(text: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return text.replace(/[A-Za-z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, () => {
    return chars.charAt(Math.floor(Math.random() * chars.length));
  });
}