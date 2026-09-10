import { brand } from "./content";

// The official EO2 mark supplies every pixel and colour. The treatment is drawn
// once, then only updated on pointer input, with no idle animation loop.
function mountBrandArt(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  if (!context) return;
  let alive = true;
  let frame = 0;
  const source = new Image();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const render = () => {
    if (!alive || !source.complete || !source.naturalWidth) return;
    const width = 1080;
    const height = Math.round(
      (width * source.naturalHeight) / source.naturalWidth,
    );
    canvas.width = width;
    canvas.height = height;
    const sample = document.createElement("canvas");
    sample.width = 120;
    sample.height = Math.round(
      (120 * source.naturalHeight) / source.naturalWidth,
    );
    const pixels = sample.getContext("2d");
    if (!pixels) return;
    pixels.drawImage(source, 0, 0, sample.width, sample.height);
    const data = pixels.getImageData(0, 0, sample.width, sample.height).data;
    context.clearRect(0, 0, width, height);
    context.font = "9px monospace";
    context.textAlign = "center";
    for (let y = 0; y < sample.height; y++) {
      for (let x = 0; x < sample.width; x++) {
        const index = (y * sample.width + x) * 4;
        const [r, g, b, a] = data.slice(index, index + 4);
        if (a < 100 || Math.max(r, g, b) < 45) continue;
        context.fillStyle = `rgb(${r} ${g} ${b})`;
        context.fillText(
          "EO2+*"[Math.floor((x + y) % 5)],
          x * 9 + 4.5,
          y * 9 + 8,
        );
      }
    }
    canvas.classList.add("is-ready");
  };
  const move = (event: PointerEvent) => {
    if (reducedMotion.matches || event.pointerType === "touch") return;
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const bounds = canvas.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      canvas.style.transform = `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 12}deg)`;
      frame = 0;
    });
  };
  const reset = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    canvas.style.transform = "";
  };
  source.onload = render;
  source.src = brand.logo;
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerleave", reset);
  return () => {
    alive = false;
    reset();
    source.onload = null;
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerleave", reset);
  };
}

export function BrandArt() {
  return (
    <div className="brand-art" aria-hidden="true">
      <img
        src={brand.logo}
        alt=""
        width="1206"
        height="854"
        fetchPriority="high"
      />
      <canvas ref={mountBrandArt} />
    </div>
  );
}
