import { useContext, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import GameContext from '@/contexts/GameContext';
import StyleContext from '@/contexts/StyleContext';
import GameCanvas from '@/components/canvas/GameCanvas';

const Room: NextPage = function Room() {
  const router = useRouter();
  const gameId = router.query.id as string;
  const styleContext = useContext(StyleContext);
  const { game, myPlayer, players, joinGame } = useContext(GameContext);

  useEffect(() => {
    if (!gameId) return;
    joinGame(gameId);
  }, [gameId]);

  console.log(game, players, myPlayer);

  return (
    <main
      className="w-screen h-screen flex"
      style={{ width: styleContext.windowWidth, height: styleContext.windowHeight }}
    >
      {game && (
        <GameCanvas game={game} players={players || []} />
      )}
    </main>
  );
};

export default Room;
