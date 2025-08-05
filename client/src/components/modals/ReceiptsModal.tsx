import React from 'react';
import { Receipt } from '../../model/Receipts.model';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  HStack,
  Flex,
  ModalFooter,
  Button,
  Image,
  Text
} from '@chakra-ui/react';

type ReceiptsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  isCentered: boolean;
  selectedReceipt: Receipt | undefined;
};

const ReceiptsModal: React.FC<ReceiptsModalProps> = ({ onClose, isOpen, selectedReceipt }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay>
        <ModalContent maxW={'800px'}>
          <ModalHeader textAlign={'center'}>Receipt ID: {selectedReceipt?._id}</ModalHeader>
          <ModalBody>
            {selectedReceipt?.productsInfo.map((product) => (
              <VStack key={product.id}>
                <HStack w={'100%'}>
                  <Image height={'100px'} mt={'8px'} src={product.cover}></Image>
                  <Flex flex={1}>
                    <Text w={'50%'}>{product.title}</Text>
                    <HStack flex={1} justify="space-between">
                      <Text>Qty: {product.qty}</Text>
                      <Text>{product.price}$</Text>
                      <Text>{(product.price * product.qty).toFixed(2)}$</Text>
                    </HStack>
                  </Flex>
                </HStack>
              </VStack>
            ))}
            <Text textAlign={'end'} fontSize={'x-large'} fontWeight={600}>
              {selectedReceipt?.totalPrice.toFixed(2)}$
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

export default ReceiptsModal;
