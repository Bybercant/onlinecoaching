import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js";

/* ---------------- LENIS ---------------- */
const lenis = new Lenis();
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* ---------------- CURSOR ---------------- */
const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.querySelectorAll("h1, h2").forEach(el => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

/* ---------------- GSAP ---------------- */
gsap.registerPlugin(ScrollTrigger);

gsap.from(".title", {
  y: 150,
  opacity: 0,
  duration: 1.5
});

gsap.utils.toArray(".reveal").forEach(el => {
  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 80%"
    },
    y: 0,
    opacity: 1,
    duration: 1
  });
});

/* ---------------- THREE + SHADER ---------------- */
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("bg"),
});
renderer.setSize(innerWidth, innerHeight);

/* SHADER */
const geometry = new THREE.PlaneGeometry(10, 10, 200, 200);

const material = new THREE.ShaderMaterial({
  wireframe: true,
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: `
    uniform float time;
    void main() {
      vec3 pos = position;
      pos.z += sin(pos.x * 3.0 + time) * 0.3;
      pos.z += cos(pos.y * 3.0 + time) * 0.3;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    void main() {
      gl_FragColor = vec4(1.0);
    }
  `
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

camera.position.z = 3;

/* ANIMATE */
function animate() {
  requestAnimationFrame(animate);

  material.uniforms.time.value += 0.03;

  renderer.render(scene, camera);
}

animate();

/* RESPONSIVE */
window.addEventListener("resize", () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
