// Accepts a YouTube link (watch / youtu.be / embed / shorts) or a direct video file path.
export function getVideoInfo(url) {
  if (!url || !url.trim()) {
    return { type: "none" };
  }

  const link = url.trim();

  const youtube = link.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );

  if (youtube) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${youtube[1]}`,
    };
  }

  return { type: "file", src: link };
}
