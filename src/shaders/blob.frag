#version 300 es

precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform vec2 u_resolution;

// * Simplex noise functions

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x * 34.0) + 1.0) * x);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
    -0.577350269189626,
    0.024390243902439
  );

  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;

  return 130.0 * dot(m, g);
}

// * Metaball function for smooth blob merging

float metaball(vec2 p, vec2 center, float radius, float time) {
  float noise = snoise(p * 3.0 + time * 0.5) * 0.15;
  float d = length(p - center) + noise;
  return radius / (d * d + 0.01);
}

// * Main shader

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 centered = (uv - 0.5) * vec2(aspect, 1.0);

  // Background color: charcoal #1a1a1a
  vec3 bgColor = vec3(0.102, 0.102, 0.102);

  // Color palette
  vec3 coralDeep = vec3(0.722, 0.353, 0.251);   // #b85a40
  vec3 coralBright = vec3(0.851, 0.467, 0.341); // #d97757
  vec3 teal = vec3(0.290, 0.608, 0.549);        // #4a9b8c
  vec3 tealLight = vec3(0.420, 0.714, 0.655);   // #6bb6a7

  float time = u_time * 0.25;

  // * Animated blob positions (orbiting/drifting)

  // Main coral blob - slow drift around center
  vec2 blob1Pos = vec2(
    sin(time * 0.7) * 0.15,
    cos(time * 0.5) * 0.1
  );

  // Secondary coral blob - orbits wider
  vec2 blob2Pos = vec2(
    cos(time * 0.4 + 1.5) * 0.35 + 0.1,
    sin(time * 0.6 + 0.8) * 0.25 - 0.15
  );

  // Teal accent blob - opposite side, slower
  vec2 blob3Pos = vec2(
    sin(time * 0.3 + 3.14) * 0.3 - 0.2,
    cos(time * 0.4 + 2.0) * 0.2 + 0.1
  );

  // Small floating teal blob
  vec2 blob4Pos = vec2(
    cos(time * 0.8 + 0.5) * 0.4,
    sin(time * 0.9 + 1.2) * 0.3 + 0.2
  );

  // * Calculate metaball field (smooth blob merging)

  float field = 0.0;
  field += metaball(centered, blob1Pos, 0.08, time);
  field += metaball(centered, blob2Pos, 0.045, time * 1.2);
  field += metaball(centered, blob3Pos, 0.035, time * 0.8);
  field += metaball(centered, blob4Pos, 0.02, time * 1.5);

  // Threshold for blob edge
  float blobMask = smoothstep(0.8, 1.2, field);

  // * Color mixing based on proximity to each blob

  float d1 = length(centered - blob1Pos);
  float d2 = length(centered - blob2Pos);
  float d3 = length(centered - blob3Pos);
  float d4 = length(centered - blob4Pos);

  // Weight colors by inverse distance
  float w1 = 1.0 / (d1 + 0.1);
  float w2 = 1.0 / (d2 + 0.1);
  float w3 = 1.0 / (d3 + 0.1);
  float w4 = 1.0 / (d4 + 0.1);
  float totalWeight = w1 + w2 + w3 + w4;

  // Internal noise for color variation
  float internalNoise = snoise(centered * 4.0 + time * 0.6) * 0.5 + 0.5;

  // Blend blob colors
  vec3 coral1 = mix(coralDeep, coralBright, internalNoise);
  vec3 coral2 = mix(coralBright, coralDeep, internalNoise * 0.7);
  vec3 teal1 = mix(teal, tealLight, internalNoise);
  vec3 teal2 = mix(tealLight, teal, internalNoise * 0.8);

  vec3 blobColor = (coral1 * w1 + coral2 * w2 + teal1 * w3 + teal2 * w4) / totalWeight;

  // * Glow effect around blobs

  float glow = smoothstep(1.5, 0.5, field);
  glow = pow(glow, 2.0) * 0.3;

  // Glow color influenced by nearby blobs
  float coralInfluence = (w1 + w2) / totalWeight;
  float tealInfluence = (w3 + w4) / totalWeight;
  vec3 glowColor = mix(teal * 0.4, coralDeep * 0.4, coralInfluence);

  // * Subtle floating particles

  float particles = 0.0;
  for (int i = 0; i < 5; i++) {
    float fi = float(i);
    vec2 particlePos = vec2(
      sin(time * (0.3 + fi * 0.1) + fi * 1.5) * (0.5 + fi * 0.1),
      cos(time * (0.4 + fi * 0.08) + fi * 2.0) * (0.4 + fi * 0.05)
    );
    float particleDist = length(centered - particlePos);
    particles += smoothstep(0.02, 0.0, particleDist) * 0.3;
  }

  // * Subtle grid pattern in background

  vec2 gridUv = centered * 8.0;
  float grid = smoothstep(0.95, 1.0, max(
    abs(sin(gridUv.x * 3.14159)),
    abs(sin(gridUv.y * 3.14159))
  ));
  grid *= 0.03;

  // * Compose final color

  vec3 color = bgColor;

  // Add subtle grid
  color += vec3(grid) * 0.5;

  // Add glow
  color = mix(color, glowColor, glow);

  // Add particles (coral colored)
  color = mix(color, coralBright * 0.8, particles);

  // Add blob
  color = mix(color, blobColor, blobMask * 0.9);

  // * Vignette

  float vignette = 1.0 - length(centered) * 0.25;
  vignette = smoothstep(0.0, 1.0, vignette);
  color *= vignette;

  // Slight contrast boost
  color = pow(color, vec3(0.95));

  fragColor = vec4(color, 1.0);
}
