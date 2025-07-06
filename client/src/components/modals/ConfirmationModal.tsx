import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Center,
  Text,
  ModalFooter,
  HStack,
  Button
} from '@chakra-ui/react';
import { FC } from 'react';

interface BaseModalProps {
  headerText: string;
  bodyText: string;
  isModalOpen: boolean;
  onCloseBtnText: string;
  onClose: () => void;
}

type ModalProps =
  | (BaseModalProps & { onConfirmBtnText: string; onConfirm: () => void })
  | (BaseModalProps & { onConfirmBtnText?: undefined; onConfirm?: undefined });

const ConfirmationModal: FC<ModalProps> = ({
  bodyText,
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
          <ModalBody textAlign={'center'}>
            <Text>{bodyText}</Text>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={'center'}>
              {onConfirm !== undefined ? (
                <Button onClick={onConfirm}>{onConfirmBtnText}</Button>
              ) : null}

              <Button onClick={onClose}>{onCloseBtnText}</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationModal;
