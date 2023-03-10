import type { FormEvent } from 'react';

type Props = {
  value: string;
  onInput: (val: string) => void;
};

function LightBrick() {
  return (
    <div
      className="bg-[#DAB592] w-[53px] h-3"
      style={{
        boxShadow:
          'inset 8.31032px 8.31032px 10.8034px rgba(255, 223, 192, 0.35), inset -8.31032px -8.31032px 5.81723px rgba(0, 0, 0, 0.25)',
      }}
    />
  );
}

function DarkBrick() {
  return (
    <div
      className="bg-[#DF9C5D] w-[53px] h-3"
      style={{
        boxShadow:
          'inset 8.31032px 8.31032px 10.8034px rgba(255, 223, 192, 0.35), inset -8.31032px -8.31032px 5.81723px rgba(0, 0, 0, 0.25)',
      }}
    />
  );
}

function TransparentBrick() {
  return <div className="w-[53px] h-3" />;
}

function Input({ value, onInput }: Props) {
  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    const newVal = e.target.value as string;
    onInput(newVal);
  };
  return (
    <div className="flex flex-col">
      <input
        className="outline-none bg-transparent py-2 text-4xl font-silkscreen"
        placeholder="Your name please"
        value={value}
        onInput={handleInput}
      />
      <div className="flex">
        <LightBrick />
        <DarkBrick />
        <LightBrick />
        <DarkBrick />
        <LightBrick />
        <DarkBrick />
        <LightBrick />
        <DarkBrick />
        <LightBrick />
        <DarkBrick />
      </div>
      <div className="flex">
        <TransparentBrick />
        <TransparentBrick />
        <DarkBrick />
        <LightBrick />
        <DarkBrick />
        <TransparentBrick />
        <TransparentBrick />
        <LightBrick />
        <DarkBrick />
      </div>
    </div>
  );
}

export default Input;
