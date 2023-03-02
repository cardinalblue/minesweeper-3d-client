import { createContext, useCallback, useState, useMemo } from 'react';
import GameSocket from '@/apis/GameSocket';
import { DirectionVo } from '@/models/valueObjects';
import { PlayerAgg, GameAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerAgg | null;
  players: PlayerAgg[] | null;
  game: GameAgg | null;
  joinGame: (gameId: string) => void;
  movePlayer: (direction: DirectionVo) => void;
  flagArea: () => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'DISCONNECTED',
    myPlayer: null,
    players: null,
    game: null,
    joinGame: () => {},
    movePlayer: () => {},
    flagArea: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [gameSocket, setGameSocket] = useState<GameSocket | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');

  const initialContextValue = createInitialContextValue();
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerAgg[] | null>(initialContextValue.players);
  const [game, setGame] = useState<GameAgg | null>(initialContextValue.game);

  const myPlayer = useMemo(() => {
    if (!players) {
      return null;
    }
    return players.find((player) => player.getId() === myPlayerId) || null;
  }, [myPlayerId, players]);

  const reset = useCallback(() => {
    setMyPlayerId(null);
    setPlayers(initialContextValue.players);
    setGame(initialContextValue.game);
  }, []);

  const joinGame = useCallback(
    (gameId: string) => {
      const hasUncleanedConnection = !!gameSocket;
      if (hasUncleanedConnection) {
        return;
      }

      const newGameSocket = GameSocket.newGameSocket(gameId, {
        onGameUpdated: (newGame: GameAgg) => {
          setGame(newGame);
        },
        onPlayersUpdated: (newMyPlayerId: string, newPlayers: PlayerAgg[]) => {
          setMyPlayerId(newMyPlayerId);
          setPlayers(newPlayers);
        },
        onOpen: () => {
          setGameStatus('OPEN');
        },
        onClose: (disconnectedByClient: boolean) => {
          if (disconnectedByClient) {
            setGameStatus('WAITING');
            setGameSocket(null);
            reset();
          } else {
            setGameStatus('DISCONNECTED');
            setGameSocket(null);
          }
        },
      });
      setGameStatus('CONNECTING');
      setGameSocket(newGameSocket);
    },
    [gameSocket]
  );

  const movePlayer = useCallback(
    (direction: DirectionVo) => {
      gameSocket?.movePlayer(direction);
    },
    [gameSocket]
  );

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocket?.disconnect();
  }, [gameSocket]);

  const flagArea = useCallback(() => {
    gameSocket?.flagArea();
  }, [gameSocket]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          myPlayer,
          players,
          game,
          joinGame,
          movePlayer,
          leaveGame,
          flagArea,
        }),
        [gameStatus, myPlayer, players, game, joinGame, movePlayer, leaveGame]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
