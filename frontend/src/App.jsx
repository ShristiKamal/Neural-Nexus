import { useState } from "react";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("All Platforms");
  const [tone, setTone] = useState("Professional");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState("");
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (topic.trim() === "") {
      alert("Please enter a topic!");
      return;
    }

    setLoading(true);
    setError("");
    setCopied("");

    try {
      const response = await fetch("https://trendspark-ai-backend.onrender.com/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
       topic: topic.trim(),
       tone: tone,
       }),
      });

      const data = await response.json();

      console.log("STATUS:", response.status);
      console.log("FULL BACKEND RESPONSE:", data);

      if (!response.ok || !data.success) {
  throw new Error(data.error || "Failed to generate content.");
}

setContent(data.data);
setGenerated(true);

} catch (error) {
  console.error("Generation error:", error);

  if (
    error.message.includes("429") ||
    error.message.toLowerCase().includes("quota")
  ) {
    setError(
      "⚠️ Gemini API quota has been reached. Please try again after the quota resets."
    );
  } else if (
    error.message.includes("503") ||
    error.message.toLowerCase().includes("high demand") ||
    error.message.toLowerCase().includes("unavailable")
  ) {
    setError(
      "⚠️ The AI service is temporarily busy. Please try again in a moment."
    );
  } else {
    setError(
      error.message || "Unable to generate content. Please try again."
    );
  }

  setGenerated(false);

} finally {
  setLoading(false);
}
  };

  const copyText = async (text, name) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(name);

      setTimeout(() => {
        setCopied("");
      }, 1500);
    } catch (error) {
      alert("Unable to copy. Please copy the text manually.");
    }
  };

  const youtubeText = content?.youtubeTitle || "";
  const instagramText = content?.instagramCaption || "";
  const linkedinText = content?.linkedinPost || "";
  const xText = content?.xThread || "";
  const hashtags = content?.hashtags || "";
  const keywords = content?.seoKeywords || "";
  const contentScore = content?.contentScore || 0;
  const hashtagList = hashtags.match(/#[\w]+/g) || [];

const getPlatformLinks = (hashtag) => {
  const encodedHashtag = encodeURIComponent(hashtag);

  return {
    instagram: `https://www.instagram.com/explore/tags/${hashtag.replace("#", "")}/`,
    x: `https://x.com/search?q=${encodedHashtag}`,
    youtube: `https://www.youtube.com/results?search_query=${encodedHashtag}`,
    linkedin: `https://www.linkedin.com/search/results/?keywords=${encodedHashtag}`,
  };
};

  return (
    <>
      <header>
        <div className="logo">✦ TrendSpark AI</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="badge">✦ AI CONTENT GENERATOR</div>

          <h1>
            One Idea.
            <br />
            <span>Content for Every Platform.</span>
          </h1>

          <p className="subtitle">
            Turn one simple idea into powerful, platform-ready content in
            seconds.
          </p>

          <div className="generator-box">
            <label>Enter your topic</label>

            <textarea
              value={topic}
              onChange={(event) => {
                setTopic(event.target.value);
                setGenerated(false);
                setError("");
              }}
              placeholder="Example: How AI is changing education"
            />

            <label>Choose Platform</label>

            <select
              value={platform}
              onChange={(event) => {
                setPlatform(event.target.value);
                setGenerated(false);
              }}
            >
              <option value="All Platforms">All Platforms</option>
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="X">X (Twitter)</option>
            </select>
            <label>Choose Tone</label>

           <select
            value={tone}
            onChange={(event) => {
             setTone(event.target.value);
             setGenerated(false);
            }}
          >
        <option value="Professional">Professional</option>
        <option value="Casual">Casual</option>
        <option value="Funny">Funny</option>
        <option value="Educational">Educational</option>
        <option value="Inspirational">Inspirational</option>
        <option value="Creative">Creative</option>
        </select>

            <button
              className="generate-btn"
             onClick={handleGenerate}
             disabled={loading}
               >
             {loading ? "✨ Creating..." : "✦ Generate Content"}
            </button>

            {loading && (
            <div className="loading-message">
               <h3>✨ Creating your content...</h3>
               <p>🎬 Preparing YouTube content</p>
               <p>📸 Preparing social content</p>
               <p>🔎 Optimizing keywords...</p>
             </div>
              )}
            {error && <p className="error-message">{error}</p>}
          </div>
        </section>

        <section className="features" id="features">
          <div className="feature-card">
            <span>▶</span>
            <h3>YouTube</h3>
            <p>Titles & descriptions</p>
          </div>

          <div className="feature-card">
            <span>◎</span>
            <h3>Instagram</h3>
            <p>Captions & hashtags</p>
          </div>

          <div className="feature-card">
            <span>in</span>
            <h3>LinkedIn</h3>
            <p>Professional posts</p>
          </div>

          <div className="feature-card">
            <span>𝕏</span>
            <h3>X / Twitter</h3>
            <p>Threads & hooks</p>
          </div>
        </section>

        {generated && (
          <section className="results">
            <h2>
              {platform === "All Platforms"
                ? "Your Content is Ready ✨"
                : `${platform} Content is Ready ✨`}
            </h2>

            <div className="content-grid">
              {platform === "All Platforms" && (
                <>
                  <div className="content-card">
                    <h3>🎬 YouTube</h3>
                    <p>{youtubeText}</p>

                    <button
                      className="copy-btn"
                      onClick={() => copyText(youtubeText, "youtube")}
                    >
                      {copied === "youtube" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>

                  <div className="content-card">
                    <h3>📸 Instagram</h3>
                    <p>{instagramText}</p>

                    <button
                      className="copy-btn"
                      onClick={() => copyText(instagramText, "instagram")}
                    >
                      {copied === "instagram" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>

                  <div className="content-card">
                    <h3>💼 LinkedIn</h3>
                    <p>{linkedinText}</p>

                    <button
                      className="copy-btn"
                      onClick={() => copyText(linkedinText, "linkedin")}
                    >
                      {copied === "linkedin" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>

                  <div className="content-card">
                    <h3>𝕏 X Thread</h3>
                    <p>{xText}</p>

                    <button
                      className="copy-btn"
                      onClick={() => copyText(xText, "x")}
                    >
                      {copied === "x" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </>
              )}

              {platform === "YouTube" && (
                <div className="content-card">
                  <h3>🎬 YouTube Title</h3>
                  <p>{youtubeText}</p>

                  <button
                    className="copy-btn"
                    onClick={() => copyText(youtubeText, "youtube")}
                  >
                    {copied === "youtube" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
              )}

              {platform === "Instagram" && (
                <div className="content-card">
                  <h3>📸 Instagram Caption</h3>
                  <p>{instagramText}</p>

                  <button
                    className="copy-btn"
                    onClick={() => copyText(instagramText, "instagram")}
                  >
                    {copied === "instagram" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
              )}

              {platform === "LinkedIn" && (
                <div className="content-card">
                  <h3>💼 LinkedIn Post</h3>
                  <p>{linkedinText}</p>

                  <button
                    className="copy-btn"
                    onClick={() => copyText(linkedinText, "linkedin")}
                  >
                    {copied === "linkedin" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
              )}

              {platform === "X" && (
                <div className="content-card">
                  <h3>𝕏 X Thread</h3>
                  <p>{xText}</p>

                  <button
                    className="copy-btn"
                    onClick={() => copyText(xText, "x")}
                  >
                    {copied === "x" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
              )}
            </div>

           <div className="content-card extra-card">
           <h3>🔥 Trending Hashtags</h3>

            <div className="hashtag-list">
             {hashtagList.map((hashtag, index) => {
             const links = getPlatformLinks(hashtag);

            return (
            <div className="hashtag-item" key={`${hashtag}-${index}`}>
           <strong>{hashtag}</strong>

           <div className="platform-links">
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              📸 Instagram
            </a>

            <a
              href={links.x}
              target="_blank"
              rel="noopener noreferrer"
            >
              𝕏 X
            </a>

            <a
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
            >
              ▶ YouTube
            </a>

            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              💼 LinkedIn
             </a>
           </div>
         </div>
         );
        })}
       </div>

  <button
    className="copy-btn"
    onClick={() => copyText(hashtags, "hashtags")}
  >
    {copied === "hashtags" ? "✓ Copied!" : "📋 Copy"}
  </button>
</div>
            <div className="content-card extra-card">
              <h3>🔎 SEO Keywords</h3>
              <p>{keywords}</p>

              <button
                className="copy-btn"
                onClick={() => copyText(keywords, "keywords")}
              >
                {copied === "keywords" ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>

            <div className="viral-card">
              <h2>🔥 Predict Virality</h2>

              <div className="viral-score">
                {contentScore}
                <span>/100</span>
              </div>

              <p>✅ Strong hook</p>
              <p>✅ Good keywords</p>
              <p>⚠️ Title could be shorter</p>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default App;