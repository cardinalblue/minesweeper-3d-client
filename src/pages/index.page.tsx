import { useContext } from 'react';
import type { NextPage } from 'next';

import StyleContext from '@/contexts/StyleContext';

const Landing: NextPage = function Landing() {
  const styleContext = useContext(StyleContext);

  return (
    <main
      className="w-screen h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1E1E1E]"
      style={{
        width: styleContext.windowWidth,
        height: styleContext.windowHeight,
      }}
    >
      Hello
    </main>
  );
};

export default Landing;
