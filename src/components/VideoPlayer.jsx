import { getVideoInfo } from "../utils/video";

function VideoPlayer({ url, onEnded }) {
  const info = getVideoInfo(url);

  if (info.type === "youtube") {
    return (
      <div className="video-frame">
        <iframe
          src={info.src}
          title="Lesson video"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (info.type === "file") {
    return (
      <video
        key={info.src}
        className="video-file"
        controls
        playsInline
        preload="metadata"
        onEnded={onEnded}
      >
        <source src={info.src} type="video/mp4" />
        Your browser does not support video playback.
      </video>
    );
  }

  return <div className="video-missing">🎬 Video coming soon</div>;
}

export default VideoPlayer;
