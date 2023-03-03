import { useEffect, useState, useRef, useContext, useMemo } from 'react';
import * as THREE from 'three';
import range from 'lodash/range';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { GameAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';
import { enableShadowOnObject } from '@/libs/threeHelper';

type Props = {
  players: PlayerAgg[];
  myPlayer: PlayerAgg;
  game: GameAgg;
};

const getMineCountModelSrc = (mineCount: number) => `/mine_count/${mineCount}.gltf`;
const CHARACTER_MODEL_SRC = '/characters/robot.glb';
const BASE_MODEL_SRC = '/bases/grass.gltf';
const MOUND_MODEL_SRC = '/bases/mound.gltf';
const ROOM_MODEL_SRC = '/bases/mini_room_pic_v1.glb';
const MINE_MODEL_SRC = '/bases/mine.gltf';
const FLAG_MODEL_SRC = '/bases/flag.gltf';
const BOOM_MODEL_SRC = '/bases/boom.gltf';
const MOUNT_MODEL_HEIGHT = 0.3;
const DIR_LIGHT_X_OFFSET = -10;
const DIR_LIGHT_HEIGHT = 30;
const DIR_LIGHT_Z_OFFSET = 50;
const HEMI_LIGHT_HEIGHT = 20;

function GameCanvas({ players, myPlayer, game }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const myPlayerPos = myPlayer.getPosition();
  const boardOffset: [x: number, z: number] = useMemo(
    () => [-Math.floor(game.getSize().getWidth() / 2), -Math.floor(game.getSize().getHeight() / 2)],
    [game.getSize().getWidth(), game.getSize().getHeight()]
  );
  const [scene] = useState<THREE.Scene>(() => {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xffffff);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.5);
    hemiLight.position.set(0, HEMI_LIGHT_HEIGHT, 0);
    newScene.add(hemiLight);

    const grid = new THREE.GridHelper(game.getSize().getWidth(), game.getSize().getWidth(), 0x000000, 0x000000);
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
    const newCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
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

  useEffect(() => {
    loadModel(CHARACTER_MODEL_SRC);
    loadModel(BASE_MODEL_SRC);
    loadModel(MOUND_MODEL_SRC);
    loadModel(ROOM_MODEL_SRC);
    loadModel(MINE_MODEL_SRC);
    loadModel(FLAG_MODEL_SRC);
    loadModel(BOOM_MODEL_SRC);

    range(8).map((count) => loadModel(getMineCountModelSrc(count + 1)));
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
      const [boardOffsetX, boardOffsetZ] = boardOffset;
      const [myPlayerPosX, myPlayerPosZ] = [myPlayerPos.getX(), myPlayerPos.getZ()];
      switch (game.getCamera()) {
        case 0:
          camera.position.set(0, 40, 0);
          camera.lookAt(0, 0, 0);
          break;
        case 1:
          camera.position.set(boardOffsetX + myPlayerPosX, 20, boardOffsetZ + myPlayerPosZ + 10);
          camera.lookAt(boardOffsetX + myPlayerPosX, 0, boardOffsetZ + myPlayerPosZ);
          break;
        case 2:
          camera.position.set(0, 10, 50);
          camera.lookAt(0, 10, 0);
          break;
        case 3:
          camera.position.set(boardOffsetX + myPlayerPosX, 60, boardOffsetZ + myPlayerPosZ + 120);
          camera.lookAt(boardOffsetX + myPlayerPosX, 0, boardOffsetZ + myPlayerPosZ);
          break;
        case 4:
          switch (myPlayer.getDirection().toNumber()) {
            case 0:
              camera.position.set(boardOffsetX + myPlayerPosX, 1, boardOffsetZ + myPlayerPosZ);
              camera.lookAt(boardOffsetX + myPlayerPosX, 1, boardOffsetZ + myPlayerPosZ - 1);
              break;
            case 1:
              camera.position.set(boardOffsetX + myPlayerPosX, 1, boardOffsetZ + myPlayerPosZ);
              camera.lookAt(boardOffsetX + myPlayerPosX + 1, 1, boardOffsetZ + myPlayerPosZ);
              break;
            case 2:
              camera.position.set(boardOffsetX + myPlayerPosX, 1, boardOffsetZ + myPlayerPosZ);
              camera.lookAt(boardOffsetX + myPlayerPosX, 1, boardOffsetZ + myPlayerPosZ + 1);
              break;
            case 3:
              camera.position.set(boardOffsetX + myPlayerPosX, 1, boardOffsetZ + myPlayerPosZ);
              camera.lookAt(boardOffsetX + myPlayerPosX - 1, 1, boardOffsetZ + myPlayerPosZ);
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    },
    [camera, game, myPlayerPos, boardOffset]
  );

  useEffect(
    function updateOnGameChange() {
      const [boardOffsetX, boardOffsetZ] = boardOffset;
      const mountObjs: THREE.Group[] = [];
      const flagObjs: THREE.Group[] = [];
      const mineObjs: THREE.Group[] = [];
      const mineCountObjs: THREE.Group[] = [];
      const boomObjs: THREE.Group[] = [];
      game.traverse((area, pos) => {
        if (!area.getRevealed()) {
          const mountObject = cloneModel(MOUND_MODEL_SRC);
          if (mountObject) {
            enableShadowOnObject(mountObject);
            mountObject.position.set(boardOffsetX + pos.getX(), 0, boardOffsetZ + pos.getZ());
            scene.add(mountObject);
            mountObjs.push(mountObject);
          }

          const flagObject = cloneModel(FLAG_MODEL_SRC);
          if (flagObject && area.getFlagged()) {
            enableShadowOnObject(flagObject);
            flagObject.position.set(boardOffsetX + pos.getX(), MOUNT_MODEL_HEIGHT, boardOffsetZ + pos.getZ());
            scene.add(flagObject);
            flagObjs.push(flagObject);
          }
        } else if (area.getHasMine()) {
          if (area.getBoomed()) {
            const boomObject = cloneModel(BOOM_MODEL_SRC);
            if (boomObject) {
              enableShadowOnObject(boomObject);
              boomObject.position.set(boardOffsetX + pos.getX(), 0, boardOffsetZ + pos.getZ());
              scene.add(boomObject);
              boomObjs.push(boomObject);
            }
          } else {
            const mineObject = cloneModel(MINE_MODEL_SRC);
            if (mineObject) {
              enableShadowOnObject(mineObject);
              mineObject.position.set(boardOffsetX + pos.getX(), 0, boardOffsetZ + pos.getZ());
              scene.add(mineObject);
              mineObjs.push(mineObject);
            }
          }
        } else {
          const mineCountObject = cloneModel(getMineCountModelSrc(area.getAdjMinesCount()));
          if (mineCountObject) {
            enableShadowOnObject(mineCountObject);
            mineCountObject.position.set(boardOffsetX + pos.getX(), 0, boardOffsetZ + pos.getZ());
            scene.add(mineCountObject);
            mineCountObjs.push(mineCountObject);
          }
        }
      });

      return () => {
        mountObjs.forEach((obj) => {
          scene.remove(obj);
        });
        mineCountObjs.forEach((obj) => {
          scene.remove(obj);
        });
        mineObjs.forEach((obj) => {
          scene.remove(obj);
        });
        flagObjs.forEach((obj) => {
          scene.remove(obj);
        });
        boomObjs.forEach((obj) => {
          scene.remove(obj);
        });
      };
    },
    [scene, cloneModel, game, boardOffset]
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
    function updatePlayersOnUpdate() {
      const playerObjs: THREE.Group[] = [];

      players.forEach((player) => {
        const [boardOffsetX, boardOffsetZ] = boardOffset;

        const playerObject = cloneModel(CHARACTER_MODEL_SRC);
        if (playerObject) {
          enableShadowOnObject(playerObject);
          scene.add(playerObject);
          playerObjs.push(playerObject);

          const playerPos = player.getPosition();
          playerObject.position.set(boardOffsetX + playerPos.getX(), 0, boardOffsetZ + playerPos.getZ());
          playerObject.rotation.y = Math.PI - (player.getDirection().toNumber() * Math.PI) / 2;

          if (player.getGuilty()) {
            playerObject.position.setY(5.5);
            playerObject.translateZ(4);
            // playerObject.translateX(3);
            playerObject.scale.set(2.5, 2.5, 2.5);
            playerObject.rotation.set(-Math.PI / 4, 0, Math.PI / 7);
          }

          if (game.includePos(playerPos)) {
            const areaStood = game.getArea(playerPos);
            if (!areaStood.getRevealed()) {
              playerObject.position.setY(MOUNT_MODEL_HEIGHT);
            }
          }
        }
      });

      return () => {
        playerObjs.forEach((obj) => {
          scene.remove(obj);
        });
      };
    },
    [scene, cloneModel, boardOffset, players, game]
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
