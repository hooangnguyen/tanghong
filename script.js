const texts = [
  "I miss You",
  "LOVE U SO MUCH",
  "I❤️U",
  "Nguyễn Ngọc Hồng🌹",
  "You are my everything",
];

const icons = ["❤️", "💖", "💝", "💗", "🌹", "✨", "💫", "⭐"];
const colors = ["#ff69b4", "#ff1493", "#ff007f", "#ff69b4", "#ffb6c1"];

const container = document.getElementById("container");
const scene = document.getElementById("scene");
const maxElements = 30;
let rotateX = 0,
  rotateY = 0,
  scale = 1;
let isDragging = false,
  startX,
  startY,
  lastX,
  lastY;
const textElements = [];

// Tạo một div chứa các text nổi và thêm vào scene
function createTextContainer() {
  const textContainer = document.createElement("div");
  textContainer.className = "text-container";
  scene.appendChild(textContainer);
  return textContainer;
}

// Tạo một text hoặc icon nổi với hiệu ứng 3D và thêm vào container
function createFloatingText(container) {
  const element = document.createElement("div");
  element.className = "floating-text";
  const isIcon = textElements.length % 4 === 0;
  element.innerText = isIcon
    ? icons[Math.floor(Math.random() * icons.length)]
    : texts[Math.floor(Math.random() * texts.length)];

  const depthLayers = [
    "depth-layer-1",
    "depth-layer-2",
    "depth-layer-3",
    "depth-layer-4",
    "depth-layer-5",
  ];
  const layerIndex = Math.floor(Math.random() * depthLayers.length);
  const selectedLayer = depthLayers[layerIndex];
  element.classList.add(selectedLayer);

  const viewportWidth = window.innerWidth;
  const spreadWidth = viewportWidth * 0.8;
  const x = Math.random() * spreadWidth - spreadWidth / 2;

  const baseZ = selectedLayer.includes("1")
    ? -250
    : selectedLayer.includes("2")
    ? -125
    : selectedLayer.includes("3")
    ? 0
    : selectedLayer.includes("4")
    ? 125
    : 250;
  const randomZ = baseZ + (Math.random() * 50 - 25);

  const depthFactor = Math.abs(randomZ) / 500;
  const hue = 330 + Math.random() * 30;
  const saturation = 100 - depthFactor * 15;
  const lightness = 85 - depthFactor * 25;

  element.style.opacity = "0";
  element.style.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${
    1 - depthFactor * 0.15
  })`;
  const glowIntensity = 1 - depthFactor * 0.4;
  element.style.textShadow = `
        0 0 ${20 * glowIntensity}px currentColor,
        0 0 ${30 * glowIntensity}px currentColor,
        0 0 ${40 * glowIntensity}px currentColor
    `;

  const initialRotation = Math.random() * 20 - 10;
  element.style.transform = `
        translate3d(${x}px, -50vh, ${randomZ}px)
        rotateY(${initialRotation}deg)
        rotateX(${Math.random() * 10 - 5}deg)
    `;

  container.appendChild(element);

  const baseSpeed = 0.05;
  const randomFactor = Math.random() * 0.08;
  const layerSpeedFactor = selectedLayer.includes("1")
    ? 0.7
    : selectedLayer.includes("2")
    ? 0.85
    : selectedLayer.includes("3")
    ? 1
    : selectedLayer.includes("4")
    ? 1.15
    : 1.3;

  const startDelay = Math.random() * 3000;
  setTimeout(() => {
    element.style.opacity = "1";
    element.style.transition = "opacity 0.5s ease-in";
  }, startDelay);

  textElements.push({
    element,
    x,
    z: randomZ,
    speed: (baseSpeed + randomFactor) * layerSpeedFactor,
    y: -50 - Math.random() * 20,
    layer: selectedLayer,
    wobbleSpeed: Math.random() * 0.002 + 0.001,
    wobbleAmount: Math.random() * 0.8 + 0.3,
    startDelay: Date.now() + startDelay,
    rotationSpeed: Math.random() * 0.002 - 0.001,
    verticalWobbleSpeed: Math.random() * 0.003 + 0.001,
    initialScale: 0.8 + Math.random() * 0.4,
    horizontalDrift: Math.random() * 2 - 1,
    rotationOffset: initialRotation,
  });
}

// Cập nhật vị trí, hiệu ứng chuyển động và opacity cho các text nổi, đồng thời tạo lại text khi biến mất
function updateElements() {
  const textContainer = scene.querySelector(".text-container");
  if (!textContainer) return;

  const now = Date.now();

  for (let i = textElements.length - 1; i >= 0; i--) {
    const text = textElements[i];
    if (now < text.startDelay) continue;

    const fallProgress = Math.min((text.y + 50) / 200, 1);
    const easedSpeed = text.speed * (1 - Math.pow(fallProgress, 2) * 0.3);
    text.y += easedSpeed;

    const time = now * text.wobbleSpeed;
    const horizontalWobble =
      Math.sin(time) * text.wobbleAmount * (1 - fallProgress);
    const verticalWobble = Math.cos(time * 1.5) * 0.3 * (1 - fallProgress);

    const rotateAmount =
      text.z > 0
        ? Math.sin(time * 0.5) * 2 * (1 - fallProgress)
        : Math.sin(time * 0.5) * -2 * (1 - fallProgress);

    text.element.style.transform = `
            translate3d(${text.x + horizontalWobble * 5}px, ${
      text.y + verticalWobble
    }vh, ${text.z}px)
            rotateY(${rotateAmount}deg)
            rotateX(${verticalWobble * 2}deg)
            rotateZ(${horizontalWobble * 1.5}deg)
        `;

    const fadeStart = 140,
      fadeEnd = 150;
    if (text.y > fadeStart) {
      const fadeProgress = (text.y - fadeStart) / (fadeEnd - fadeStart);
      text.element.style.opacity = 1 - fadeProgress;
    }

    if (text.y > fadeEnd) {
      text.element.remove();
      textElements.splice(i, 1);
      createFloatingText(textContainer);
    }
  }
  requestAnimationFrame(updateElements);
}

// Tạo các hạt (particle) trang trí nền với màu sắc và vị trí ngẫu nhiên
function createParticles() {
  for (let i = 0; i < 80; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    scene.appendChild(particle);
  }
}

// Khởi tạo hiệu ứng: tạo particles, text nổi và bắt đầu cập nhật chuyển động
function init() {
  createParticles();
  const textContainer = createTextContainer();

  for (let i = 0; i < maxElements; i++) {
    setTimeout(() => {
      createFloatingText(textContainer);
    }, i * (Math.random() * 300 + 100));
  }
  updateElements();
}

container.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  lastX = rotateY;
  lastY = rotateX;
});

container.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  rotateY = lastX + deltaX * 0.5;
  rotateX = lastY + deltaY * 0.5;
  updateSceneTransform();
});

container.addEventListener("mouseup", () => (isDragging = false));
container.addEventListener("mouseleave", () => (isDragging = false));

// Thêm sự kiện cảm ứng cho mobile
touchStart = (e) => {
  isDragging = true;
  const touch = e.touches[0];
  startX = touch.clientX;
  startY = touch.clientY;
  lastX = rotateY;
  lastY = rotateX;
};
touchMove = (e) => {
  if (!isDragging) return;
  const touch = e.touches[0];
  const deltaX = touch.clientX - startX;
  const deltaY = touch.clientY - startY;
  rotateY = lastX + deltaX * 0.5;
  rotateX = lastY + deltaY * 0.5;
  updateSceneTransform();
};
touchEnd = () => {
  isDragging = false;
};
container.addEventListener("touchstart", touchStart);
container.addEventListener("touchmove", touchMove);
container.addEventListener("touchend", touchEnd);

container.addEventListener("wheel", (e) => {
  e.preventDefault();
  const delta = e.deltaY * -0.001;
  scale = Math.min(Math.max(0.5, scale + delta), 2);
  updateSceneTransform();
});

// Cập nhật transform 3D (xoay, phóng to/thu nhỏ) cho text-container dựa trên thao tác người dùng
function updateSceneTransform() {
  const textContainer = scene.querySelector(".text-container");
  if (textContainer) {
    textContainer.style.transform = `
            scale(${scale})
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
        `;
  }
}

init();
