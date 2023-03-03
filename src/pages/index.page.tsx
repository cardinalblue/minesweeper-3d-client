import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import StyleContext from '@/contexts/StyleContext';
import TextLogo from '@/components/svg/TextLogo';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import GameContext from '@/contexts/GameContext';

function OrangeBlock({ top, right, left, bottom }: { top?: number; right?: number; bottom?: number; left?: number }) {
  return (
    <div
      className="absolute bg-[#FEB89C] w-[90px] h-[90px]"
      style={{ position: 'absolute', top, right, bottom, left }}
    />
  );
}

const Landing: NextPage = function Landing() {
  const styleContext = useContext(StyleContext);
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [loading, setLoading] = useState(false);

  const { gameStatus, joinGame } = useContext(GameContext);

  useEffect(() => {
    if (gameStatus === 'OPEN') {
      router.push('/game/dc3e3d8c-da82-4e15-8263-49c178f57bff');
    }
  }, [gameStatus]);

  const onStartClick = () => {
    if (!playerName) {
      alert('Common! Put your name!');
      return;
    }
    setLoading(true);
    joinGame('dc3e3d8c-da82-4e15-8263-49c178f57bff', playerName);
  };

  return (
    <main
      className="relative w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#FFCCB7]"
      style={{
        width: styleContext.windowWidth,
        height: styleContext.windowHeight,
      }}
    >
      <OrangeBlock top={0} left={0} />
      <OrangeBlock top={0} left={90} />
      <OrangeBlock top={90} left={0} />
      <OrangeBlock top={0} right={0} />
      <OrangeBlock top={0} right={90} />
      <OrangeBlock top={90} right={0} />
      <OrangeBlock bottom={0} left={0} />
      <OrangeBlock bottom={0} left={90} />
      <OrangeBlock bottom={90} left={0} />
      <OrangeBlock bottom={0} right={0} />
      <OrangeBlock bottom={0} right={90} />
      <OrangeBlock bottom={90} right={0} />
      <div className="flex flex-col justify-center">
        <TextLogo />
        <div className="mt-5 ml-[-40px] flex items-center">
          <img src="/dog.png" alt="hi" />
          <Input value={playerName} onInput={setPlayerName} />
        </div>
        <div className="mt-15 ml-[-280px] flex justify-center">
          <Button copy={loading ? 'loading...' : 'Start'} onClick={onStartClick} />
        </div>
      </div>
    </main>
  );
};

export default Landing;
