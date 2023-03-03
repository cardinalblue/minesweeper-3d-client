import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { DirectionVo } from '@/models/valueObjects';
import GameContext from '@/contexts/GameContext';
import StyleContext from '@/contexts/StyleContext';
import GameCanvas from '@/components/canvas/GameCanvas';
import useKeyPress from '@/hooks/useKeyPress';
import HotkeyModal from '@/components/modal/HotkeyModal';

const Room: NextPage = function Room() {
  const router = useRouter();
  const gameId = router.query.id as string;
  const styleContext = useContext(StyleContext);
  const { game, players, myPlayer, joinGame, movePlayer, revivePlayer, flagArea, changeCamera, resetGame } =
    useContext(GameContext);

  const [displayHotkeyModal, setDisplayHotkeyModal] = useState(true);

  useEffect(() => {
    if (!gameId) return;
    joinGame(gameId);
  }, [gameId]);

  useKeyPress('KeyQ', {
    onKeyDown: () => {
      setDisplayHotkeyModal(!displayHotkeyModal);
    },
  });
  useKeyPress('KeyR', { onKeyDown: revivePlayer });
  useKeyPress('KeyP', { onKeyDown: resetGame });
  useKeyPress('KeyF', { onKeyDown: flagArea });
  useKeyPress('KeyC', { onKeyDown: changeCamera });

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
      const goUpInterval = setInterval(doMove, 200);

      return () => {
        clearInterval(goUpInterval);
      };
    },
    [isUpPressed, isRightPressed, isDownPressed, isLeftPressed, movePlayer]
  );

  const onHotkeyModalConfirm = () => {
    setDisplayHotkeyModal(false);
  };

  return (
    <main
      className="w-screen h-screen flex"
      style={{ width: styleContext.windowWidth, height: styleContext.windowHeight }}
    >
      <HotkeyModal opened={displayHotkeyModal} onClose={onHotkeyModalConfirm} />
      {game && players && myPlayer && <GameCanvas game={game} players={players} myPlayer={myPlayer} />}
    </main>
  );
};

export default Room;
