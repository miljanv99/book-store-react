import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  HStack,
  Button
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { buttonStyles } from '../../globalStyles';
import { COLORS } from '../../globalColors';

interface BaseModalProps {
  headerText: string;
  bodyContent: ReactNode;
  isModalOpen: boolean;
  onCloseBtnText: string;
  onClose: () => void;
}

type ModalProps =
  | (BaseModalProps & { onConfirmBtnText: string; onConfirm: () => void })
  | (BaseModalProps & { onConfirmBtnText?: undefined; onConfirm?: undefined });

const ConfirmationModal: FC<ModalProps> = ({
  bodyContent,
  headerText,
  isModalOpen,
  onClose,
  onCloseBtnText,
  onConfirm,
  onConfirmBtnText
}) => {
  return (
    <>
      <Modal isCentered={true} isOpen={isModalOpen} onClose={onClose}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
          <ModalHeader textAlign={'center'}>{headerText}</ModalHeader>
          <ModalBody textAlign={'center'}>{bodyContent}</ModalBody>
          <ModalFooter>
            <HStack justifyContent={'center'}>
              {onConfirm !== undefined ? (
                <Button
                  {...buttonStyles}
                  backgroundColor={COLORS.darkerPrimaryColor}
                  onClick={onConfirm}>
                  {onConfirmBtnText}
                </Button>
              ) : null}

              <Button {...buttonStyles} onClick={onClose}>
                {onCloseBtnText}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
