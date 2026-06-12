import Head from "next/head";
import { useState, useRef, useCallback } from "react";
import styles from "../styles/Home.module.css";

const FONT_OPTIONS = [
  { label: "ゴシック体", value: "sans-serif" },
  { label: "明朝体", value: "serif" },
  { label: "等幅フォント", value: "monospace" },
  { label: "丸ゴシック", value: "'Hiragino Maru Gothic ProN', sans-serif" },
];

const BG_PRESETS = [
  { label: "ホワイト", value: "#ffffff" },
  { label: "クリーム", value: "#fdf6e3" },
  { label: "ライトグレー", value: "#f0f0f0" },
  { label: "ネイビー", value: "#1a1a2e" },
  { label: "ダークグレー", value: "#2d2d2d" },
  { label: "カスタム", value: "custom" },
];

const TEXT_COLOR_PRESETS = [
  { label: "ブラック", value: "#111111" },
  { label: "チャコール", value: "#333333" },
  { label: "ホワイト", value: "#ffffff" },
  { label: "インディゴ", value: "#3730a3" },
  { label: "エメラルド", value: "#047857" },
  { label: "カスタム", value: "custom" },
];

export default function Home() {
  const [text, setText] = useState("ここにテキストを入力してください");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("sans-serif");
  const [textColor, setTextColor] = useState("#111111");
  const [customTextColor, setCustomTextColor] = useState("#111111");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [customBgColor, setCustomBgColor] = useState("#ffffff");
  const [padding, setPadding] = useState(60);
  const [canvasW, setCanvasW] = useState(800);
  const [canvasH, setCanvasH] = useState(400);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [textAlign, setTextAlign] = useState("center");
  const [bold, setBold] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const canvasRef = useRef(null);

  const resolvedBg = bgColor === "custom" ? customBgColor : bgColor;
  const resolvedText = textColor === "custom" ? customTextColor : textColor;

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasW;
    canvas.height = canvasH;
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = resolvedBg;
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Text setup
    const weight = bold ? "bold" : "normal";
    ctx.font = `${weight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = resolvedText;
    ctx.textBaseline = "top";

    const lineHeightPx = fontSize * lineHeight;
    const maxWidth = canvasW - padding * 2;
    const lines = [];

    text.split("\n").forEach((paragraph) => {
      if (paragraph === "") {
        lines.push("");
        return;
      }
      const words = paragraph.split("");
      let currentLine = "";
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i];
        if (ctx.measureText(testLine).width > maxWidth && currentLine !== "") {
          lines.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);
    });

    const totalTextHeight = lines.length * lineHeightPx;
    let startY = (canvasH - totalTextHeight) / 2;
    if (startY < padding) startY = padding;

    lines.forEach((line, i) => {
      const y = startY + i * lineHeightPx;
      let x;
      if (textAlign === "center") {
        x = canvasW / 2;
        ctx.textAlign = "center";
      } else if (textAlign === "right") {
        x = canvasW - padding;
        ctx.textAlign = "right";
      } else {
        x = padding;
        ctx.textAlign = "left";
      }
      ctx.fillText(line, x, y);
    });
  }, [text, fontSize, fontFamily, resolvedText, resolvedBg, padding, canvasW, canvasH, lineHeight, textAlign, bold]);

  const handleGenerate = () => {
    drawCanvas();
    const canvas = canvasRef.current;
    const url = canvas.toDataURL("image/jpeg", 0.95);
    setImageUrl(url);
    setGenerated(true);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "text-image.jpg";
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className={styles.root}>
      <Head>
        <title>Text2Image — テキストを画像に変換</title>
        <meta name="description" content="テキストを美しい画像に変換するWebサービス" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>T2I</div>
        <h1 className={styles.title}>Text2Image</h1>
        <p className={styles.subtitle}>テキストを画像に変換</p>
      </header>

      <main className={styles.main}>
        <div className={styles.editor}>

          {/* Text input */}
          <section className={styles.section}>
            <label className={styles.label}>テキスト</label>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="画像にしたいテキストを入力..."
            />
          </section>

          {/* Canvas size */}
          <section className={styles.section}>
            <label className={styles.label}>画像サイズ</label>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <span className={styles.inputLabel}>幅</span>
                <input type="number" className={styles.numInput} value={canvasW}
                  min={200} max={2400} step={50}
                  onChange={(e) => setCanvasW(Number(e.target.value))} />
                <span className={styles.unit}>px</span>
              </div>
              <span className={styles.cross}>×</span>
              <div className={styles.inputGroup}>
                <span className={styles.inputLabel}>高さ</span>
                <input type="number" className={styles.numInput} value={canvasH}
                  min={100} max={2400} step={50}
                  onChange={(e) => setCanvasH(Number(e.target.value))} />
                <span className={styles.unit}>px</span>
              </div>
            </div>
            <div className={styles.presetRow}>
              {[
                { label: "正方形", w: 600, h: 600 },
                { label: "横長", w: 1200, h: 630 },
                { label: "縦長", w: 630, h: 1200 },
                { label: "ワイド", w: 1920, h: 1080 },
              ].map((p) => (
                <button key={p.label} className={styles.presetBtn}
                  onClick={() => { setCanvasW(p.w); setCanvasH(p.h); }}>
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          {/* Font */}
          <section className={styles.section}>
            <label className={styles.label}>フォント</label>
            <div className={styles.chipRow}>
              {FONT_OPTIONS.map((f) => (
                <button key={f.value}
                  className={`${styles.chip} ${fontFamily === f.value ? styles.chipActive : ""}`}
                  style={{ fontFamily: f.value }}
                  onClick={() => setFontFamily(f.value)}>
                  {f.label}
                </button>
              ))}
            </div>
            <div className={styles.row} style={{ marginTop: "12px" }}>
              <div className={styles.inputGroup}>
                <span className={styles.inputLabel}>サイズ</span>
                <input type="range" min={12} max={200} value={fontSize}
                  className={styles.range}
                  onChange={(e) => setFontSize(Number(e.target.value))} />
                <span className={styles.rangeVal}>{fontSize}px</span>
              </div>
            </div>
            <div className={styles.row} style={{ marginTop: "10px" }}>
              <div className={styles.inputGroup}>
                <span className={styles.inputLabel}>行間</span>
                <input type="range" min={1.0} max={3.0} step={0.1} value={lineHeight}
                  className={styles.range}
                  onChange={(e) => setLineHeight(Number(e.target.value))} />
                <span className={styles.rangeVal}>{lineHeight.toFixed(1)}</span>
              </div>
            </div>
            <div className={styles.row} style={{ marginTop: "10px", gap: "8px" }}>
              <button className={`${styles.chip} ${bold ? styles.chipActive : ""}`}
                onClick={() => setBold((b) => !b)}>
                <b>太字</b>
              </button>
              {["left", "center", "right"].map((a) => (
                <button key={a}
                  className={`${styles.chip} ${textAlign === a ? styles.chipActive : ""}`}
                  onClick={() => setTextAlign(a)}>
                  {a === "left" ? "左揃え" : a === "center" ? "中央" : "右揃え"}
                </button>
              ))}
            </div>
          </section>

          {/* Text color */}
          <section className={styles.section}>
            <label className={styles.label}>文字色</label>
            <div className={styles.colorRow}>
              {TEXT_COLOR_PRESETS.map((c) => (
                <button key={c.value}
                  className={`${styles.colorChip} ${textColor === c.value ? styles.colorChipActive : ""}`}
                  style={{ background: c.value === "custom" ? "linear-gradient(135deg,#f00,#0f0,#00f)" : c.value,
                    border: c.value === "#ffffff" ? "1.5px solid #ddd" : "none" }}
                  title={c.label}
                  onClick={() => setTextColor(c.value)} />
              ))}
              {textColor === "custom" && (
                <input type="color" className={styles.colorPicker}
                  value={customTextColor}
                  onChange={(e) => setCustomTextColor(e.target.value)} />
              )}
            </div>
          </section>

          {/* Background color */}
          <section className={styles.section}>
            <label className={styles.label}>背景色</label>
            <div className={styles.colorRow}>
              {BG_PRESETS.map((c) => (
                <button key={c.value}
                  className={`${styles.colorChip} ${bgColor === c.value ? styles.colorChipActive : ""}`}
                  style={{ background: c.value === "custom" ? "linear-gradient(135deg,#f00,#0f0,#00f)" : c.value,
                    border: c.value === "#ffffff" || c.value === "#fdf6e3" || c.value === "#f0f0f0" ? "1.5px solid #ddd" : "none" }}
                  title={c.label}
                  onClick={() => setBgColor(c.value)} />
              ))}
              {bgColor === "custom" && (
                <input type="color" className={styles.colorPicker}
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)} />
              )}
            </div>
          </section>

          {/* Padding */}
          <section className={styles.section}>
            <label className={styles.label}>余白</label>
            <div className={styles.inputGroup}>
              <input type="range" min={0} max={200} value={padding}
                className={styles.range}
                onChange={(e) => setPadding(Number(e.target.value))} />
              <span className={styles.rangeVal}>{padding}px</span>
            </div>
          </section>

          <button className={styles.generateBtn} onClick={handleGenerate}>
            画像を生成する
          </button>
        </div>

        {/* Preview */}
        <div className={styles.preview}>
          <canvas ref={canvasRef} className={styles.canvas} style={{ display: "none" }} />
          {generated && imageUrl ? (
            <div className={styles.result}>
              <div className={styles.resultLabel}>プレビュー</div>
              <img src={imageUrl} alt="生成された画像" className={styles.previewImg} />
              <button className={styles.downloadBtn} onClick={handleDownload}>
                JPEGとしてダウンロード
              </button>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderIcon}>🖼</div>
              <p>「画像を生成する」を押すと<br />ここにプレビューが表示されます</p>
            </div>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        Text2Image — テキストを画像に変換するWebサービス
      </footer>
    </div>
  );
}
