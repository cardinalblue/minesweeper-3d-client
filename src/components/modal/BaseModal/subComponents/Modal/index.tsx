type ModalProps = {
  width: number;
  height?: number;
  children: JSX.Element;
};

export default function Modal({ width, height, children }: ModalProps) {
  return (
    <section
      className="overflow-hidden bg-[#ffffff66] rounded-3xl"
      style={{
        width,
        height,
      }}
    >
      {children}
    </section>
  );
}
