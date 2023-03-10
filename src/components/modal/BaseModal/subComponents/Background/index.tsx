type BackgroundProps = {
  onClick?: () => void;
};

export default function Background({ onClick }: BackgroundProps) {
  return (
    <div
      className={['absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'z-0', onClick ? 'cursor-pointer' : ''].join(' ')}
      role="button"
      aria-label="modal background"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={onClick}
    />
  );
}
