import Text from '@/components/text/Text';
import BaseModal from '@/components/modal/BaseModal';
import Button from '../button/Button';

type Props = {
  opened: boolean;
  onClose?: () => void;
};

function SubscribeModal({ opened, onClose = () => {} }: Props) {
  return (
    <BaseModal width={800} opened={opened} onBackgroundClick={onClose}>
      <section className="relative p-20 w-full h-full flex flex-col items-center ">
        <Text copy="Subscribe to Minesweeper Premium to activate this feature" size={30} />
        <div className="mt-5">
          <Button copy="GOT IT" onClick={onClose} />
        </div>
      </section>
    </BaseModal>
  );
}

export default SubscribeModal;
