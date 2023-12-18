import atmosFrag from "@/helpers/shaders/atmos.frag.glsl"
import atmosVert from "@/helpers/shaders/atmos.vert.glsl"
import { GradientEmissiveAddon } from "@/helpers/shaders/gradient-emissive"
import { useHelper } from "@react-three/drei"
import { useFrame, useLoader, useThree } from "@react-three/fiber"
import { update } from "@tweenjs/tween.js"
import { useEffect, useRef } from "react"
import {
  AdditiveBlending,
  BackSide,
  CubeTextureLoader,
  Group,
  MeshStandardMaterial,
  SpotLight,
  SpotLightHelper,
  TextureLoader,
} from "three"

export const EARTH_RADIUS = 100

export const Earth = (props: {}) => {
  const {} = props

  const { scene } = useThree()
  const lightGroupRef = useRef<Group>(null)
  const spotLight = useRef<SpotLight>(null)
  const earthMaterailRef = useRef<MeshStandardMaterial>(null)

  const [map, roughnessMap, cloudMap] = useLoader(TextureLoader, [
    "/textures/8k_earth_nightmap.jpg",
    "/textures/8k_earth_specular_map.png",
    "/textures/8k_earth_clouds.jpg",
  ])

  //@ts-ignore
  const [skybox] = useLoader(CubeTextureLoader, [
    [
      "/textures/sky/px.png",
      "/textures/sky/nx.png",
      "/textures/sky/py.png",
      "/textures/sky/ny.png",
      "/textures/sky/pz.png",
      "/textures/sky/nz.png",
    ],
  ])

  useEffect(() => {
    scene.background = skybox
  }, [scene, skybox])

  useFrame((state) => {
    if (lightGroupRef.current) {
      lightGroupRef.current.quaternion.copy(state.camera.quaternion)
    }
    update()
  })

  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "p") {
        console.log(scene.children)
      }
    })
  }, [])

  // useHelper(spotLight as any, SpotLightHelper)

  return (
    <>
      <ambientLight color={0x404040} intensity={100} />
      <group ref={lightGroupRef}>
        <spotLight
          position={[-200, 200, 350]}
          intensity={20009}
          color={0xffffff}
          angle={Math.PI / 4}
          ref={spotLight}
        />
      </group>

      <group rotation={[0, -Math.PI / 2, 0]} visible={true}>
        <mesh userData={{ type: "earth" }}>
          <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
          <meshStandardMaterial
            map={map}
            roughnessMap={roughnessMap}
            roughness={0.5}
            onBeforeCompile={GradientEmissiveAddon}
            ref={earthMaterailRef}
          />
        </mesh>

        <mesh userData={{ type: "cloud" }} visible={true}>
          <sphereGeometry args={[EARTH_RADIUS + 1, 64, 64]} />
          <meshStandardMaterial
            map={cloudMap}
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh userData={{ type: "aura" }}>
        <sphereGeometry args={[EARTH_RADIUS + 8, 64, 64]} />
        <shaderMaterial
          blending={AdditiveBlending}
          side={BackSide}
          transparent
          vertexShader={atmosVert}
          fragmentShader={atmosFrag}
          uniforms={{
            intensity: { value: 0.9 },
            color: { value: [0.3, 0.6, 1.0] },
          }}
        />
      </mesh>
    </>
  )
}
