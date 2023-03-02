import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { DirectionVo } from '@/models/valueObjects';
import GameContext from '@/contexts/GameContext';
import StyleContext from '@/contexts/StyleContext';
import GameCanvas from '@/components/canvas/GameCanvas';
import useKeyPress from '@/hooks/useKeyPress';

const Room: NextPage = function Room() {
  const router = useRouter();
  const gameId = router.query.id as string;
  const styleContext = useContext(StyleContext);
  const { game, players, joinGame, movePlayer, revealArea, flagArea } = useContext(GameContext);
  const [cameraCase, setCameraCase] = useState(0);

  useEffect(() => {
    if (!gameId) return;
    joinGame(gameId);
  }, [gameId]);

  useKeyPress('KeyF', { onKeyDown: flagArea });
  useKeyPress('Space', { onKeyDown: revealArea });
  useKeyPress('KeyC', {
    onKeyDown: () => {
      setCameraCase((cameraCase + 1) % 4);
    },
  });

  const isUpPressed = useKeyPress('KeyW');
  const isRightPressed = useKeyPress('KeyD');
  const isDownPressed = useKeyPress('KeyS');
  const isLeftPressed = useKeyPress('KeyA');
  useEffect(
    function () {
      let pressedKeysCount = 0;
      if (isUpPressed) pressedKeysCount += 1;
      if (isRightPressed) pressedKeysCount += 1;
      if (isDownPressed) pressedKeysCount += 1;
      if (isLeftPressed) pressedKeysCount += 1;
      if (pressedKeysCount !== 1) {
        return () => {};
      }

      const doMove = () => {
        if (isUpPressed) movePlayer(DirectionVo.new(0));
        if (isRightPressed) movePlayer(DirectionVo.new(1));
        if (isDownPressed) movePlayer(DirectionVo.new(2));
        if (isLeftPressed) movePlayer(DirectionVo.new(3));
      };

      doMove();
      const goUpInterval = setInterval(doMove, 100);

      return () => {
        clearInterval(goUpInterval);
      };
    },
    [isUpPressed, isRightPressed, isDownPressed, isLeftPressed, movePlayer]
  );

  return (
    <main
      className="w-screen h-screen flex"
      style={{ width: styleContext.windowWidth, height: styleContext.windowHeight }}
    >
      {game && <GameCanvas game={game} players={players || []} cameraCase={cameraCase} />}
    </main>
  );
};

export default Room;
