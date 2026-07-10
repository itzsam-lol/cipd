import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * 3D recreation of the CiPD mark: a dumbbell of three connected blobs
 *   • top    — purple
 *   • middle — teal (curve)
 *   • bottom — pink
 * Vanilla three.js (bypasses visual-edits babel plugin issue with R3F intrinsics).
 */
export default function BlobScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lighting — warm key + cool fill for plastic-clay look
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.05);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xec1e79, 0.6);
    rim.position.set(-5, -3, 4);
    scene.add(rim);
    const rim2 = new THREE.DirectionalLight(0x6e2dbe, 0.5);
    rim2.position.set(4, -4, 3);
    scene.add(rim2);

    const group = new THREE.Group();
    scene.add(group);

    // Helper: build a soft, distortable sphere
    const makeBlob = (radius, color) => {
      const geo = new THREE.SphereGeometry(radius, 96, 96);
      const base = geo.attributes.position.array.slice();
      const mat = new THREE.MeshPhysicalMaterial({
        color,
        roughness: 0.32,
        metalness: 0.08,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        sheen: 0.4,
        sheenRoughness: 0.6,
        sheenColor: new THREE.Color(color).offsetHSL(0, 0, 0.1),
      });
      return { mesh: new THREE.Mesh(geo, mat), base, geo };
    };

    // Top blob — purple
    const top = makeBlob(0.95, 0x6e2dbe);
    top.mesh.position.set(-0.55, 1.45, 0);
    group.add(top.mesh);

    // Middle blob — teal
    const mid = makeBlob(0.7, 0x0fb5a8);
    mid.mesh.position.set(0.55, 0.05, 0);
    group.add(mid.mesh);

    // Bottom blob — pink
    const bot = makeBlob(1.05, 0xec1e79);
    bot.mesh.position.set(-0.55, -1.6, 0);
    group.add(bot.mesh);

    // Connecting "bridge" spheres — give the iconic figure-8 / dumbbell connection
    // Top -> Middle bridge (purple→teal gradient via two interpolated spheres)
    const bridges = [];
    const addBridge = (a, b, color, count) => {
      for (let i = 1; i <= count; i++) {
        const t = i / (count + 1);
        const r = 0.34 + 0.08 * Math.sin(t * Math.PI);
        const geo = new THREE.SphereGeometry(r, 48, 48);
        const mat = new THREE.MeshPhysicalMaterial({
          color,
          roughness: 0.35,
          metalness: 0.08,
          clearcoat: 0.55,
        });
        const m = new THREE.Mesh(geo, mat);
        m.position.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 0);
        group.add(m);
        bridges.push(m);
      }
    };
    addBridge(top.mesh.position, mid.mesh.position, 0x2f7fb6, 2); // purple→teal
    addBridge(mid.mesh.position, bot.mesh.position, 0x9a5b94, 2); // teal→pink

    // Mouse-driven rotation
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener("mousemove", onMouseMove);

    // Animation loop
    const tmp = new THREE.Vector3();
    let raf = 0;
    const start = performance.now();

    const distort = (mesh, base, freq, amp, t) => {
      const p = mesh.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const bx = base[i * 3];
        const by = base[i * 3 + 1];
        const bz = base[i * 3 + 2];
        tmp.set(bx, by, bz);
        const len = tmp.length();
        tmp.normalize();
        const n =
          amp * Math.sin(t * freq + bx * 1.6 + by * 1.2 + bz * 1.4) +
          amp * 0.5 * Math.cos(t * freq * 0.7 + by * 2.2);
        const s = len + n;
        p.array[i * 3] = tmp.x * s;
        p.array[i * 3 + 1] = tmp.y * s;
        p.array[i * 3 + 2] = tmp.z * s;
      }
      p.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    };

    const animate = () => {
      const t = (performance.now() - start) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      distort(top.mesh, top.base, 0.9, 0.07, t);
      distort(mid.mesh, mid.base, 1.3, 0.05, t);
      distort(bot.mesh, bot.base, 0.8, 0.08, t);

      // Group rotation toward mouse + idle bob
      group.rotation.y += (mouse.x * 0.55 - group.rotation.y) * 0.05;
      group.rotation.x += (-mouse.y * 0.35 - group.rotation.x) * 0.05;
      group.position.y = Math.sin(t * 0.7) * 0.06;
      group.position.x = Math.cos(t * 0.5) * 0.04;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    // Resize
    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      [top, mid, bot].forEach((b) => {
        b.geo.dispose();
        b.mesh.material.dispose();
      });
      bridges.forEach((m) => {
        m.geometry.dispose();
        m.material.dispose();
      });
      if (mount && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="hero-blob-canvas"
      className="relative w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
