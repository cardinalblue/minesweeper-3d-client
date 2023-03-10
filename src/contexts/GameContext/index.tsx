import { createContext, useCallback, useState, useMemo } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import GameSocket from '@/apis/GameSocket';
import { DirectionVo } from '@/models/valueObjects';
import { PlayerAgg, GameAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerAgg | null;
  players: PlayerAgg[] | null;
  game: GameAgg | null;
  joinGame: (gameId: string, name: string) => void;
  movePlayer: (direction: DirectionVo) => void;
  revivePlayer: () => void;
  flagArea: () => void;
  changeCamera: () => void;
  leaveGame: () => void;
  resetGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'DISCONNECTED',
    myPlayer: null,
    players: null,
    game: null,
    joinGame: () => {},
    movePlayer: () => {},
    revivePlayer: () => {},
    flagArea: () => {},
    changeCamera: () => {},
    leaveGame: () => {},
    resetGame: () => {},
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
    (gameId: string, playerName: string) => {
      const hasUncleanedConnection = !!gameSocket;
      if (hasUncleanedConnection) {
        return;
      }

      const newGameSocket = GameSocket.newGameSocket(gameId, playerName, {
        onNotificationSent: (message: string) => {
          toast(message);
        },
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

  const revivePlayer = useCallback(() => {
    gameSocket?.revivePlayer();
  }, [gameSocket]);

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocket?.disconnect();
  }, [gameSocket]);

  const flagArea = useCallback(() => {
    gameSocket?.flagArea();
  }, [gameSocket]);

  const changeCamera = useCallback(() => {
    gameSocket?.changeCamera();
  }, [gameSocket]);

  const resetGame = useCallback(() => {
    gameSocket?.resetGame();
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
          revivePlayer,
          leaveGame,
          flagArea,
          changeCamera,
          resetGame,
        }),
        [
          gameStatus,
          myPlayer,
          players,
          game,
          joinGame,
          movePlayer,
          revivePlayer,
          leaveGame,
          flagArea,
          changeCamera,
          resetGame,
        ]
      )}
    >
      <ToastContainer
        position="top-right"
        autoClose={200}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {children}
    </Context.Provider>
  );
}

export default Context;
