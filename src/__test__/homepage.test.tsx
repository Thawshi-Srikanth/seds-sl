// @vitest-environment jsdom
// @ts-ignore
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
  url: "http://localhost:3000",
});
// @ts-ignore
globalThis.window = dom.window;
// @ts-ignore
globalThis.document = dom.window.document;
// @ts-ignore
globalThis.navigator = dom.window.navigator;
// @ts-ignore
globalThis.HTMLElement = dom.window.HTMLElement;
// @ts-ignore
globalThis.Element = dom.window.Element;
// @ts-ignore
globalThis.Node = dom.window.Node;

const { render, screen, within } = await import("@testing-library/react");
const { describe, it, expect, vi } = await import("vitest");

// Mock the entire space-scene component to avoid Three.js issues
vi.mock("@/components/sections/home-page/section-one/space-scene", () => ({
  default: () => <div data-testid="space-scene-mock">Space Scene Mock</div>,
  SpaceScenePlaceholder: () => (
    <div data-testid="space-scene-placeholder-mock">Loading...</div>
  ),
}));

// Mock @react-three/fiber
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas-mock">{children}</div>
  ),
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({
    camera: {},
    size: { width: 800, height: 600 },
  })),
}));

// Mock @react-three/drei components
vi.mock("@react-three/drei", () => ({
  Stars: () => <div data-testid="stars-mock" />,
}));

// Mock Three.js
vi.mock("three", () => ({
  Vector3: vi.fn(),
  BufferGeometry: vi.fn(() => ({
    setAttribute: vi.fn(),
    setFromPoints: vi.fn(),
  })),
  BufferAttribute: vi.fn(),
  LineBasicMaterial: vi.fn(),
  Line: vi.fn(),
  MeshBasicMaterial: vi.fn(),
  DoubleSide: "DoubleSide",
  OrthographicCamera: vi.fn(),
}));

import SectionOne from "@/components/sections/home-page/section-one/";

describe("SectionOne", () => {
  it("renders the main heading", () => {
    render(<SectionOne />);
    const heading = screen.getByText(/Be a Part of the Largest/i);
    expect(heading).toBeDefined();
  });

  it("renders the two buttons", () => {
    render(<SectionOne />);
    const section = screen.getAllByTestId("section-one")[0];
    const projectsButton = within(section).getByRole("link", {
      name: /Our Projects/i,
    });
    const joinButton = within(section).getByRole("link", {
      name: /Join Us/i,
    });
    expect(projectsButton).toBeDefined();
    expect(joinButton).toBeDefined();
  });
});
