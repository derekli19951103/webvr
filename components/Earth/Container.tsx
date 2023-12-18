"use client"
import { OrbitControls, Stats } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { ACESFilmicToneMapping } from "three"
import { EARTH_RADIUS, Earth } from "./Earth"

export const EarthContainer = () => {
  return (
    <>
      <Canvas
        tabIndex={1}
        camera={{ position: [0, 0, 200] }}
        onContextMenu={(e) => e.preventDefault()}
        onCreated={({ gl }) => {}}
      >
        <Earth />

        <OrbitControls minDistance={EARTH_RADIUS + 1} enablePan={false} />
        {process.env.NODE_ENV === "development" && <Stats />}
      </Canvas>
    </>
  )
}
