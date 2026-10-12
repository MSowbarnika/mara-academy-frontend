import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API } from "../api";
import VideoPlayer from "../components/VideoPlayer";

// Free demo classes. Open with /demo?type=keyboard or /demo?type=flute
function Demo() {
  const [params, setParams] = useSearchParams();
  const type = params.get("type") === "flute" ? "flute" : "keyboard";

  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${API}/api/demos?category=${type.toUpperCase()}`)
      .then((response) => response.json())
      .then((data) => setDemos(Array.isArray(data) ? data : []))
      .catch(() => setDemos([]))
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <section className="demo-live">
      <div className="demo-live-head">
        <h1>
          Free Demo Classes - {type === "flute" ? "Flute" : "Keyboard"}
        </h1>

        <Link to="/" className="demo-home" aria-label="Home">
          🏠
        </Link>

        <div className="demo-tabs">
          <button
            type="button"
            className={type === "keyboard" ? "demo-tab active" : "demo-tab"}
            onClick={() => setParams({ type: "keyboard" })}
          >
            Keyboard
          </button>
          <button
            type="button"
            className={type === "flute" ? "demo-tab active" : "demo-tab"}
            onClick={() => setParams({ type: "flute" })}
          >
            Flute
          </button>
        </div>
      </div>

      <div className="demo-live-body">
        {loading && <p className="demo-live-message">Loading demo classes...</p>}

        {!loading && demos.length === 0 && (
          <p className="demo-live-message">
            Demo videos are coming soon. Please check again later.
          </p>
        )}

        {demos.map((demo) => (
          <div className="demo-live-card" key={demo.id}>
            <h3>{demo.title}</h3>
            <VideoPlayer url={demo.videoUrl} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Demo;
