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
  cameraCase: number;
};

const CHARACTER_MODEL_SRC = '/characters/robot.gltf';
const BASE_MODEL_SRC = '/bases/grass.gltf';
const MOUND_MODEL_SRC = '/bases/mound.gltf';
const ROOM_MODEL_SRC = '/bases/mini_room_art_copy.glb';
const MOUNT_HEIGHT = 0.3;
const CAMERA_HEIGHT = 30;
const DIR_LIGHT_X_OFFSET = -10;
const DIR_LIGHT_HEIGHT = 30;
const DIR_LIGHT_Z_OFFSET = 50;
const HEMI_LIGHT_HEIGHT = 20;

function GameCanvas({ players, game, cameraCase }: Props) {
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

  const posOffset: [x: number, z: number] = useMemo(
    () => [-Math.floor(game.getSize().getWidth() / 2), -Math.floor(game.getSize().getHeight() / 2)],
    [game.getSize().getWidth(), game.getSize().getHeight()]
  );

  useEffect(() => {
    loadModel(CHARACTER_MODEL_SRC);
    loadModel(BASE_MODEL_SRC);
    loadModel(MOUND_MODEL_SRC);
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
    function updateCameraPositionOnGameSizeChange() {
      const gameSize = game.getSize();
      switch (cameraCase) {
        case 0:
          camera.position.set(0, CAMERA_HEIGHT * 1, gameSize.getHeight() * 1 + 10);
          break;
        case 1:
          camera.position.set(0, CAMERA_HEIGHT * 3, gameSize.getHeight() * 3 + 10);
          break;
        case 2:
          camera.position.set(0, CAMERA_HEIGHT * 6, gameSize.getHeight() * 6 + 10);
          break;
        case 3:
          camera.position.set(0, 3, gameSize.getHeight() * 1.5);
          break;
        default:
          break;
      }
      camera.lookAt(0, 0, 0);
    },
    [camera, cameraCase, game]
  );

  useEffect(
    function updateOnGameChange() {
      const [posOffsetX, posOffsetZ] = posOffset;
      const mountObjs: THREE.Group[] = [];
      game.traverse((area, pos) => {
        if (!area.getRevealed()) {
          const mountObject = cloneModel(MOUND_MODEL_SRC);
          if (mountObject) {
            enableShadowOnObject(mountObject);
            mountObject.position.set(posOffsetX + pos.getX() + 0.5, 0, posOffsetZ + pos.getZ() + 0.5);
            scene.add(mountObject);
            mountObjs.push(mountObject);
          }
        }
      });

      return () => {
        mountObjs.forEach((mountObj) => {
          scene.remove(mountObj);
        });
      };
    },
    [scene, cloneModel, game, posOffset]
  );

  useEffect(
    function handleBasesUpdated() {
      const grassObject = cloneModel(BASE_MODEL_SRC);
      if (!grassObject) return () => {};

      enableShadowOnObject(grassObject);
      grassObject.position.set(0, -0.15, 0);
      grassObject.scale.set(game.getSize().getWidth(), 1, game.getSize().getHeight());
      // Adjust the color of the grass object
      grassObject.traverse(function (obj) {
        // for all mesh objects in grassObject
        if (obj.type === 'Mesh') {
          // @ts-ignore
          obj.material.color = new THREE.Color('rgb(225, 215, 255)');
        }
      });
      scene.add(grassObject);

      const roomObject = cloneModel(ROOM_MODEL_SRC);
      if (!roomObject) {
        return () => {
          scene.remove(grassObject);
        };
      }

      enableShadowOnObject(roomObject);
      const roomScale = game.getSize().getWidth() * 0.1;
      roomObject.position.set(0, 1, 0);
      roomObject.scale.set(roomScale, roomScale, roomScale);
      roomObject.rotateY(Math.PI / 4);
      scene.add(roomObject);

      return () => {
        scene.remove(grassObject);
        scene.remove(roomObject);
      };
    },
    [scene, cloneModel, game]
  );

  useEffect(
    function handlePlayersUpdated() {
      players.forEach((player) => {
        const [posOffsetX, posOffsetZ] = posOffset;

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
          const playerPos = player.getPosition();
          const areaStood = game.getArea(playerPos);
          playerObject.position.set(
            posOffsetX + player.getPosition().getX() + 0.5,
            areaStood.getRevealed() ? 0 : MOUNT_HEIGHT,
            posOffsetZ + player.getPosition().getZ() + 0.5
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
    [scene, cloneModel, posOffset, players, game]
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
