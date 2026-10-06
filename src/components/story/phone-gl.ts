import { Color, DirectionalLight, DoubleSide, Group, Matrix4, Mesh, MeshBasicMaterial, NeutralToneMapping, PerspectiveCamera, PlaneGeometry, PMREMGenerator, Scene, SRGBColorSpace, WebGLRenderer } from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import type { Pose } from "./timeline";

/*
 * The phone's body, drawn in WebGL: the model (public/models/iphone.glb, made by
 * scripts/phone-model.mjs) in a dark studio, a big softbox up and to the left and a strip light to
 * the right, so black glass and metal read by their highlights; the aura's orange and a cool
 * edge light come from behind. Its screen isn't drawn here: the page's own screen (Iphone.tsx) lies over it, so the app
 * stays sharp and live.
 *
 * The two have to line up exactly, so the camera is the page's own CSS perspective (same distance,
 * same vanishing point), one unit is one CSS pixel, and the phone is placed with the same chain of
 * transforms the page applies to its HTML phone. Loaded only after the page is up; until then, and
 * wherever WebGL is missing, the HTML phone is the whole phone.
 */

/** The model, in its own metres: its width, and the middle of its body. */
const MODEL = { width: 0.07897, center: [0.000025, 0.08167, -0.00003] as const };

export type PhoneFrame = {
  pose: Pose;
  /** The hero's lean toward the pointer, in degrees about x and y. */
  lean: [number, number];
  /** How much of the aura is up (0–1). */
  aura: number;
};

export type PhoneGL = { draw(f: PhoneFrame): void; resize(): void; dispose(): void };

/**
 * What the phone reflects: black, with a large softbox up-left, a soft panel above the camera (so
 * a face turned to you shows a sheen, not a hole), a strip light right and a faint top light.
 */
function studioEnvironment() {
  const env = new Scene();
  env.background = new Color(0x030303);
  const light = (w: number, h: number, power: number, x: number, y: number, z: number) => {
    const panel = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(1, 1, 1).multiplyScalar(power), side: DoubleSide }));
    panel.position.set(x, y, z);
    panel.lookAt(0, 0, 0);
    env.add(panel);
  };
  light(5, 3.5, 6, -4, 3.5, 4.5);
  light(9, 6, 3.2, 0.5, 1.8, 8);
  light(0.8, 7, 3, 6, 0, 1.5);
  light(7, 1.2, 1, 0, 6, -2);
  return env;
}

export async function createPhoneGL(canvas: HTMLCanvasElement, stage: HTMLElement): Promise<PhoneGL> {
  const persp = stage.querySelector<HTMLElement>(".persp")!;
  const tilt = stage.querySelector<HTMLElement>(".tilt")!;
  const rig = stage.querySelector<HTMLElement>(".rig")!;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const studio = studioEnvironment();
  scene.environment = pmrem.fromScene(studio, 0.03).texture;
  studio.traverse((o) => o instanceof Mesh && (o.geometry.dispose(), o.material.dispose()));
  pmrem.dispose();

  // Light from the upper left, like the page's own shading; the aura's glow from behind and below;
  // and a cool edge light from behind, so the black frame always has an outline against black.
  const key = new DirectionalLight(0xffffff, 1.4);
  key.position.set(-0.6, 1, 1.1);
  const rim = new DirectionalLight(0xff5a1f, 0);
  rim.position.set(0.35, -0.5, -1);
  const edge = new DirectionalLight(0xcfdcff, 2.2);
  edge.position.set(0.9, 0.5, -0.7);
  const edgeLeft = new DirectionalLight(0xffffff, 1.2);
  edgeLeft.position.set(-1, 0.2, -0.5);
  scene.add(key, rim, edge, edgeLeft);

  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync("/models/iphone.glb");
  const phone = new Group();
  phone.matrixAutoUpdate = false;
  gltf.scene.position.set(-MODEL.center[0], -MODEL.center[1], -MODEL.center[2]);
  phone.add(gltf.scene);
  scene.add(phone);

  const camera = new PerspectiveCamera();
  const m = new Matrix4();
  let place = { ox: 0, oy: 0, tx: 0, ty: 0, cx: 0, cy: 0, k: 1 };

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const css = getComputedStyle(persp);
    const distance = parseFloat(css.perspective);
    const [ox, oy] = css.perspectiveOrigin.split(" ").map(parseFloat);
    const [tx, ty] = getComputedStyle(tilt).transformOrigin.split(" ").map(parseFloat);
    place = { ox, oy, tx, ty, cx: rig.offsetLeft + rig.offsetWidth / 2, cy: rig.offsetTop + rig.offsetHeight / 2, k: rig.offsetWidth / MODEL.width };

    // The page's perspective as a camera: `distance` from the screen, looking at the vanishing point.
    // The frame is centred on that point, and the canvas is the part of it the stage covers.
    const fw = 2 * Math.max(ox, w - ox);
    const fh = 2 * Math.max(oy, h - oy);
    camera.fov = (2 * Math.atan(fh / 2 / distance) * 180) / Math.PI;
    camera.aspect = fw / fh;
    camera.near = distance * 0.05;
    camera.far = distance * 4;
    camera.position.set(0, 0, distance);
    camera.setViewOffset(fw, fh, fw / 2 - ox, fh / 2 - oy, w, h);
    camera.updateProjectionMatrix();

    // Sharp, without drawing more pixels than a phone's GPU should for a mostly empty canvas.
    const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3.6e6 / (w * h)));
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
  }

  function draw({ pose, lean, aura }: PhoneFrame) {
    const { ox, oy, tx, ty, cx, cy, k } = place;
    // The page's transforms, in its own space (pixels, y down): the lean about its origin, then the
    // rig at its place, moved, scaled and turned about its middle; then the model, metres to pixels.
    const css = new DOMMatrix()
      .translateSelf(tx, ty)
      .rotateAxisAngleSelf(1, 0, 0, lean[0])
      .rotateAxisAngleSelf(0, 1, 0, lean[1])
      .translateSelf(cx - tx + pose.x, cy - ty + pose.y)
      .scaleSelf(pose.s, pose.s, pose.s)
      .rotateAxisAngleSelf(1, 0, 0, pose.rx)
      .rotateAxisAngleSelf(0, 1, 0, pose.ry)
      .rotateAxisAngleSelf(0, 0, 1, pose.rz)
      .scaleSelf(k, -k, k);
    // Into the camera's space: from the vanishing point, y up.
    const world = new DOMMatrix().scaleSelf(1, -1, 1).translateSelf(-ox, -oy).multiplySelf(css);
    phone.matrix.copy(m.fromArray(world.toFloat64Array()));
    phone.matrixWorldNeedsUpdate = true;

    rim.intensity = 1 + 2.6 * aura;
    renderer.render(scene, camera);
  }

  resize();

  return {
    draw,
    resize,
    dispose() {
      renderer.dispose();
      scene.environment?.dispose();
    },
  };
}
