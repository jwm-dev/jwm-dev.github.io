+++
title = "3D Sierpinski Tetrix"
description = "Built from scratch with Rust, winit, and wgpu. A (mostly complete) recursive fractal renderer."
date = 2025-04-24
+++
# Sierpinski Tetrix: Recursive Geometry via Raw GPU Compute

**Project by jwm**  
**Built in Rust with raw WebGPU + compute shaders**

---

## Overview

Sierpinski Tetrix is a real-time graphical demonstration of geometric recursion, implemented entirely from scratch using Rust and raw WebGPU bindings. The application procedurally generates a 3D Sierpinski tetrahedron—also known as a "tetrix"—through recursive subdivision, rendered in both solid and wireframe modes. Unlike conventional graphics applications that rely on high-level engines or scenegraph libraries, Sierpinski Tetrix constructs the full rendering pipeline manually, leveraging compute shaders and explicit GPU control.

The result is a minimalist, performant, and technically sophisticated rendering system that foregrounds GPU-based recursion and low-level graphical computation.

---

## Key Features

- **Recursive Tetrahedral Subdivision**  
  Starting from a single regular tetrahedron, the system recursively subdivides geometry into self-similar parts. This geometric recursion is efficiently computed on the GPU via custom compute shaders, allowing real-time rendering at significant subdivision depths.

- **Dual Rendering Modes**  
  - **Solid Mode**: Displays the filled geometry with basic shading.
  - **Wireframe Mode**: Emphasizes structure and recursion with edge-only rendering, ideal for understanding the recursive nature of the fractal.

- **Manual Rendering Pipeline**  
  Every stage of the graphics pipeline is explicitly constructed, from vertex buffer generation to render pass encoding. There are no abstractions—no third-party engines or high-level wrappers—resulting in complete control over GPU memory, shader compilation, and pipeline configuration.

---

## Technical Implementation

### Core Technologies

- **Rust**: The foundation of the application, chosen for its performance, safety guarantees, and tight integration with modern GPU APIs.
- **WebGPU (via `wgpu`)**: The raw graphics API targeted at modern graphics backends, including Vulkan, Metal, and DirectX 12. It is used here at a very low level to construct all render and compute passes by hand.
- **WGSL Shaders**: Custom-written shaders in WebGPU Shading Language, including compute shaders for geometry generation and vertex/fragment shaders for final rendering.

### Compute Pipeline

At the heart of the application is a GPU-based recursive subdivision algorithm. The base tetrahedron is defined in host memory, and recursive subdivision is offloaded to compute shaders, which emit child tetrahedra in parallel. Each level of recursion quadratically increases the number of tetrahedra rendered, resulting in a richly detailed geometric fractal.

Compute shader responsibilities include:

- Vertex generation per recursion level
- Edge deduplication (for wireframe mode)
- Buffer reallocation and geometry streaming to the GPU

### Render Pipeline

The rendering stage is fully custom:

- **Wireframe**: Implemented by rendering individual line segments stored in a geometry buffer. No hardware tessellation or geometry shaders are used.
- **Solid**: Renders filled tetrahedra using indexed triangle draws, with flat shading and basic camera controls.

The pipeline supports dynamic switching between modes without full reinitialization.

---

## Goals and Rationale

This project serves multiple purposes:

1. **Demonstrate Recursive Geometry**: The Sierpinski tetrahedron is an iconic example of 3D recursion, well-suited to GPU-parallel algorithms.
2. **Showcase Low-Level GPU Programming**: All rendering is implemented directly, without helper crates or ECS systems.
3. **Explore Compute Shaders**: Procedural geometry generation is handled almost entirely on the GPU, pushing modern compute APIs to their limits in a non-trivial context.

---

## Future Directions

- **Dynamic Recursion Depth**: Real-time adjustment of recursion levels with adaptive LOD.
- **Fractal Variants**: Exploration of other 3D recursive structures, e.g., Menger sponge, octahedral Sierpinski.
- **Interactive Controls**: Camera orbit, zoom, and toggles for shader introspection or subdivision debugging.

---

## Conclusion

Sierpinski Tetrix is a raw, performance-focused demonstration of real-time recursive geometry using only fundamental tools. By eschewing engines and embracing the bare-metal WebGPU pipeline, the project illustrates both technical mastery and artistic minimalism. It stands as a testament to what is possible when low-level GPU programming is treated as a craft, not an afterthought.