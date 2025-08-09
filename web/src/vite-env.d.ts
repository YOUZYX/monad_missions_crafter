/// <reference types="vite/client" />

// Image module declarations
declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

// URL import declarations for Vite
declare module '*.png?url' {
  const src: string;
  export default src;
}

declare module '*.jpg?url' {
  const src: string;
  export default src;
}

declare module '*.jpeg?url' {
  const src: string;
  export default src;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}

declare module '*.gif?url' {
  const src: string;
  export default src;
}

declare module '*.webp?url' {
  const src: string;
  export default src;
}

// Ensure this file is treated as a module
export {};
