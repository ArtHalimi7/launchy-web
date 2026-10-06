// Makes the phone model for the web, from the source in models/.
//
//   node scripts/phone-model.mjs [models/source.glb] [public/models/iphone.glb]
//
// The page draws the phone's screen itself, over the model, so the model's own screen is made plain
// black and its wallpaper dropped. The logo on the back is taken off: the back panel has a hole in
// its shape, so the logo is given the panel's own finish, the panel is made solid, and a flat patch
// of the same finish is laid a hair over the spot, so not even the seam shows. Then parts that share a material are joined (fewer draw calls),
// and the geometry is quantized and meshopt-compressed (three.js decodes it with MeshoptDecoder).

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions";
import { dedup, flatten, join, prune, quantize, reorder, weld } from "@gltf-transform/functions";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";
import fs from "node:fs";

const [src = "models/apple_iphone_18_pro_max_black_2026.glb", out = "public/models/iphone.glb"] = process.argv.slice(2);

await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ "meshopt.encoder": MeshoptEncoder, "meshopt.decoder": MeshoptDecoder });

const doc = await io.read(src);
for (const m of doc.getRoot().listMaterials()) {
  if (m.getName() === "COLOUR_Black_Screen") {
    m.setEmissiveTexture(null);
    m.setEmissiveFactor([0, 0, 0]);
  }
}
const back = doc.getRoot().listMaterials().find((m) => m.getName() === "COLOUR_Black_Backpanel");
if (back) {
  back.setAlphaMode("OPAQUE");
  back.setBaseColorFactor([...back.getBaseColorFactor().slice(0, 3), 1]);
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      if (prim.getMaterial()?.getName() === "COLOUR_Black_Apple") prim.setMaterial(back);
    }
  }
  // The patch, in the model's own metres: the back face is at z = -4.4 mm, the logo inside
  // x ±8.3 mm, y 55.7 to 75.8 mm. Facing out of the back (-z).
  const z = -0.00443;
  const [x0, x1, y0, y1] = [-0.0105, 0.0105, 0.053, 0.0785];
  const buffer = doc.getRoot().listBuffers()[0];
  const position = doc.createAccessor().setType("VEC3").setBuffer(buffer).setArray(new Float32Array([x0, y0, z, x1, y0, z, x1, y1, z, x0, y1, z]));
  const normal = doc.createAccessor().setType("VEC3").setBuffer(buffer).setArray(new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1]));
  const indices = doc.createAccessor().setType("SCALAR").setBuffer(buffer).setArray(new Uint16Array([0, 2, 1, 0, 3, 2]));
  const prim = doc.createPrimitive().setAttribute("POSITION", position).setAttribute("NORMAL", normal).setIndices(indices).setMaterial(back);
  const patch = doc.createNode("back-patch").setMesh(doc.createMesh("back-patch").addPrimitive(prim));
  doc.getRoot().listScenes()[0].addChild(patch);
}

await doc.transform(dedup(), flatten(), join(), weld(), prune(), reorder({ encoder: MeshoptEncoder }), quantize({ quantizePosition: 14, quantizeNormal: 8, quantizeTexcoord: 12 }));
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
await io.write(out, doc);

const kb = (f) => `${(fs.statSync(f).size / 1024).toFixed(0)} KB`;
const root = doc.getRoot();
console.log(`${src} (${kb(src)}) → ${out} (${kb(out)}): ${root.listMeshes().length} meshes, ${root.listMaterials().length} materials`);
