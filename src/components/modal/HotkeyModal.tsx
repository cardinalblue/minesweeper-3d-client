import Text from '@/components/text/Text';
import BaseModal from '@/components/modal/BaseModal';
import Key from '@/components/svg/Key';

type BlockProps = {
  keyCode: string;
  copy: string;
};

function Block({ keyCode, copy }: BlockProps) {
  return (
    <div
      className="rounded-lg bg-[#DF9C5D] font-silkscreen py-2 px-5 flex items-center w-full"
      style={{
        boxShadow:
          '4.51546px 7.90205px 22.5773px 7.33762px #AEAEAE, inset 5.64432px 5.64432px 7.33762px rgba(255, 223, 192, 0.35), inset -5.64432px -5.64432px 3.95103px rgba(0, 0, 0, 0.25)',
      }}
    >
      <div className="relative">
        <Key />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="relative top-[-2px] left-[1px]">
            <Text copy={keyCode} />
          </div>
        </div>
      </div>
      <div className="ml-2">
        <Text copy={copy} />
      </div>
    </div>
  );
}

type Props = {
  opened: boolean;
  onClose?: () => void;
};

function HotkeyModal({ opened, onClose = () => {} }: Props) {
  return (
    <BaseModal width={600} opened={opened} onBackgroundClick={onClose}>
      <section className="relative p-6 w-full h-full flex flex-col items-center bg-[rbga(#FFFFFF, 0)]">
        <div className="w-full">
          <Block keyCode="Q" copy="Turn on/off this hint popup" />
        </div>
        <div className="mt-3 w-full">
          <Block keyCode="W" copy="Let your character go foward to where it's facing" />
        </div>
        <div className="mt-3 w-full">
          <Block keyCode="A" copy="Let your character turn to its left" />
        </div>
        <div className="mt-3 w-full">
          <Block keyCode="S" copy="Let your character turn to its back" />
        </div>
        <div className="mt-3 w-full">
          <Block keyCode="D" copy="Let your character turn to its right" />
        </div>
        <div className="mt-3 w-full">
          <Block keyCode="R" copy="Revive your character when it died" />
        </div>
      </section>
    </BaseModal>
  );
}

export default HotkeyModal;
