import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const container = document.getElementById('viewer-container');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 0.3, 2.2);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // evita sobrecarga em telas de alta densidade
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // suaviza o arraste em mouse e toque
controls.dampingFactor = 0.08;

scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.2));
const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
keyLight.position.set(2, 3, 2);
scene.add(keyLight);

let productModel = null;
let targetColor = new THREE.Color('#d7ff38');
const DAMPING = 6; // velocidade da transição de cor, independente do frame rate

const loader = new GLTFLoader();
loader.load('assets/models/dual-sense2.glb', (gltf) => {
  productModel = gltf.scene;
  scene.add(productModel);
});

// Clique na parte inferior do produto abre o seletor de cores
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener('pointerdown', (event) => {
  if (!productModel) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObject(productModel, true);

  if (hits.length > 0) {
    const hitPoint = hits[0].point;
    const bbox = new THREE.Box3().setFromObject(productModel);
    const lowerThreshold = bbox.min.y + (bbox.max.y - bbox.min.y) * 0.25; // 25% inferior do modelo
    if (hitPoint.y <= lowerThreshold) {
      openColorPicker(event.clientX, event.clientY);
    }
  }
});

function openColorPicker(x, y) {
  const picker = document.getElementById('color-picker');
  picker.style.left = `${x}px`;
  picker.style.top = `${y}px`;
  picker.classList.remove('hidden');
  // TODO: popular com paleta de cores vinda da API/site de referência
}

export function setProductColor(hexColor) {
  targetColor = new THREE.Color(hexColor);
}

// Loop de animação com delta time: velocidade igual em qualquer tela (60Hz, 120Hz, 144Hz)
const clock = new THREE.Clock();
const ROTATION_SPEED = 0.5; // radianos por segundo

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.1);

  if (productModel) {
    productModel.traverse((child) => {
      if (child.isMesh && child.material && child.material.color) {
        const t = 1 - Math.exp(-DAMPING * delta);
        child.material.color.lerp(targetColor, t);
      }
    });
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});
