type Props = {
  copy: string;
  onClick: () => void;
};

function Button({ copy, onClick }: Props) {
  return (
    <button
      className="flex items-center justify-center py-3 px-6 bg-[#DF9C5D] text-xl font-silkscreen"
      style={{
        boxShadow:
          '6.64826px 11.6345px 33.2413px 10.8034px #FFB698, inset 8.31032px 8.31032px 10.8034px rgba(255, 223, 192, 0.35), inset -8.31032px -8.31032px 5.81723px rgba(0, 0, 0, 0.25)',
        borderRadius: '16.6206px',
      }}
      type="button"
      onClick={onClick}
    >
      <div className="relative top-[-2px]">{copy}</div>
    </button>
  );
}

export default Button;
