type Props = {
  copy?: string;
  color?: string;
  size?: number;
  weight?: 'regular' | 'bold';
};

function Text({ copy = '', color = 'black', size = 16, weight = 'regular' }: Props) {
  return (
    <span
      className={[weight === 'regular' ? 'font-normal' : 'font-bold', 'font-silkscreen', 'tracking-tightest'].join(' ')}
      style={{
        color,
        fontSize: size,
      }}
    >
      {copy}
    </span>
  );
}

export default Text;
