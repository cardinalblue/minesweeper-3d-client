import { useEffect, useState, useRef, useContext, useMemo } from 'react';
import * as THREE from 'three';
import forEach from 'lodash/forEach';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { GameAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';
import { enableShadowOnObject } from '@/libs/threeHelper';

type CachedObjectMap = {
  [key: number | string]: THREE.Group | undefined;
};

type Props = {
  players: PlayerAgg[];
  game: GameAgg;
};

const CHARACTER_MODEL_SRC = '/characters/robot.gltf';
const BASE_MODEL_SRC = '/bases/grass.gltf';
const ROOM_MODEL_SRC = '/bases/mini_room_art_copy.glb';
const CAMERA_HEIGHT = 30;
const CAMERA_Z_OFFSET = 40;
const DIR_LIGHT_X_OFFSET = -10;
const DIR_LIGHT_HEIGHT = 30;
const DIR_LIGHT_Z_OFFSET = 50;
const HEMI_LIGHT_HEIGHT = 20;

function GameCanvas({ players, game }: Props) {
  console.log(game, players);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const [scene] = useState<THREE.Scene>(() => {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xffffff);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.5);
    hemiLight.position.set(0, HEMI_LIGHT_HEIGHT, 0);
    newScene.add(hemiLight);

    const grid = new THREE.GridHelper(game.getSize().getWidth(), game.getSize().getHeight(), 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.2;
    // @ts-ignore
    grid.material.transparent = true;
    newScene.add(grid);

    return newScene;
  });
  useState<THREE.DirectionalLight>(() => {
    const newDirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    newDirLight.castShadow = true;
    newDirLight.position.set(DIR_LIGHT_X_OFFSET, DIR_LIGHT_HEIGHT, DIR_LIGHT_Z_OFFSET);
    newDirLight.target.position.set(0, 0, 0);
    newDirLight.shadow.mapSize.width = 4096;
    newDirLight.shadow.mapSize.height = 4096;
    newDirLight.shadow.camera.top = 100;
    newDirLight.shadow.camera.bottom = -100;
    newDirLight.shadow.camera.left = -100;
    newDirLight.shadow.camera.right = 100;
    newDirLight.shadow.camera.near = 0.5;
    newDirLight.shadow.camera.far = 500;
    scene.add(newDirLight);
    scene.add(newDirLight.target);
    return newDirLight;
  });
  const [camera] = useState<THREE.PerspectiveCamera>(() => {
    const newCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
    newCamera.position.set(0, CAMERA_HEIGHT, CAMERA_Z_OFFSET);
    newCamera.lookAt(0, 0, -10);
    scene.add(newCamera);
    return newCamera;
  });
  const [renderer] = useState<THREE.WebGLRenderer>(() => {
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.outputEncoding = THREE.sRGBEncoding;
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return newRenderer;
  });
  const { loadModel, cloneModel } = useContext(ThreeJsContext);
  const cachedPlayerObjects = useRef<CachedObjectMap>({});

  const offset: [x: number, z: number] = useMemo(
    () => [-Math.floor(game.getSize().getWidth() / 2), -Math.floor(game.getSize().getHeight() / 2)],
    [game.getSize().getWidth(), game.getSize().getHeight()]
  );

  useEffect(() => {
    loadModel(CHARACTER_MODEL_SRC);
    loadModel(BASE_MODEL_SRC);
    loadModel(ROOM_MODEL_SRC);
  }, []);

  useEffect(
    function putRendererOnWrapperRefReady() {
      if (!wrapperRef.current) {
        return;
      }

      wrapperRef.current.appendChild(renderer.domElement);
    },
    [wrapperRef.current]
  );

  useEffect(
    function updateRendererOnWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      renderer.setSize(wrapperDomRect.width, wrapperDomRect.height);
      renderer.setPixelRatio(wrapperDomRect.width / wrapperDomRect.height);
    },
    [renderer, wrapperDomRect]
  );

  useEffect(
    function updateCameraAspectOnWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      camera.aspect = wrapperDomRect.width / wrapperDomRect.height;
      camera.updateProjectionMatrix();
    },
    [camera, wrapperDomRect]
  );

  useEffect(
    function handleBasesUpdated() {
      const grassObject = cloneModel(BASE_MODEL_SRC);
      if (!grassObject) return;

      enableShadowOnObject(grassObject);
      grassObject.position.set(0, -0.15, 0);
      grassObject.scale.set(game.getSize().getWidth(), 1, game.getSize().getHeight());
      // Adjust the color of the grass object
      grassObject.traverse(function (obj) {
        // for all mesh objects in grassObject
        if (obj.type === 'Mesh') {
          obj.material.color = new THREE.Color('rgb(225, 215, 255)');
        }
      });
      scene.add(grassObject);

      const roomObject = cloneModel(ROOM_MODEL_SRC);
      if (!roomObject) return;

      enableShadowOnObject(roomObject);
      roomObject.position.set(0, -0.15, 0);
      roomObject.scale.set(game.getSize().getWidth() * 0.13, 1.0, game.getSize().getHeight() * 0.13);
      roomObject.rotateY(Math.PI / 4);
      scene.add(roomObject);
    },
    [scene, cloneModel, game]
  );

  useEffect(
    function handlePlayersUpdated() {
      players.forEach((player) => {
        const [offsetX, offsetZ] = offset;

        let playerObject: THREE.Group | null;
        const cachedPlayerOject = cachedPlayerObjects.current[player.getId()];

        if (cachedPlayerOject) {
          playerObject = cachedPlayerOject;
        } else {
          playerObject = cloneModel(CHARACTER_MODEL_SRC);
          if (playerObject) {
            scene.add(playerObject);
            cachedPlayerObjects.current[player.getId()] = playerObject;
            enableShadowOnObject(playerObject);
          }
        }

        if (playerObject) {
          playerObject.position.set(
            offsetX + player.getPosition().getX() + 0.5,
            0,
            offsetZ + player.getPosition().getZ() + 0.5
          );
          playerObject.rotation.y = Math.PI - (player.getDirection().toNumber() * Math.PI) / 2;
        }
      });

      const playerKeys = players.map((player) => player.getId());
      forEach(cachedPlayerObjects.current, (playerObject, playerId) => {
        if (!playerKeys.includes(playerId) && playerObject) {
          scene.remove(playerObject);
          delete cachedPlayerObjects.current[playerId];
        }
      });
    },
    [scene, cloneModel, offset, players]
  );

  useEffect(
    function animateEffect() {
      let animationId: number | null = null;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animationId !== null) cancelAnimationFrame(animationId);
      };
    },
    [renderer, scene, camera]
  );

  return <div ref={wrapperRef} className="relative w-full h-full flex" />;
}

export default GameCanvas;
