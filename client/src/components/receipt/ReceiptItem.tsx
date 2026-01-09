import React, { useState } from 'react';
import { Receipt } from '../../model/Receipts.model';
import { VStack, HStack, Button, Text, Card, CardBody, CardHeader, Wrap } from '@chakra-ui/react';
import { buttonStyles, cardTextStyle } from '../../globalStyles';
import { InfoIcon } from '@chakra-ui/icons';

type ReceiptItemProps = {
  onOpen: () => void;
  receipts: Receipt[];
  setSelectedReceipt: React.Dispatch<React.SetStateAction<Receipt | undefined>>;
  cardWidth?: number | string;
};

const ReceiptItem: React.FC<ReceiptItemProps> = ({
  onOpen,
  receipts,
  setSelectedReceipt,
  cardWidth
}) => {
  const [isExpand, setIsExpand] = useState<Record<string, boolean>>({});

  const showDetails = (receiptId: string) => {
    onOpen();
    const receipt = receipts.find((rec) => rec._id === receiptId);
    setSelectedReceipt(receipt);
  };

  return (
    <Card w={cardWidth ?? '900px'} display={'flex'}>
      <CardHeader display={'flex'} justifyContent={'center'}>
        <Text {...cardTextStyle} fontWeight={'600'}>
          Purchase History
        </Text>
      </CardHeader>
      <CardBody>
        {receipts.length === 0 ? (
          <>
            <VStack justifyContent={'center'}>
              <InfoIcon boxSize={10} />
              <Text>No Receipt</Text>
            </VStack>
          </>
        ) : (
          <Wrap justify="center" spacing={6} mx="auto">
            {receipts?.map((receipt, index) => (
              <VStack key={receipt._id}>
                <Text
                  _active={{ color: 'grey' }}
                  fontWeight={600}
                  cursor={'pointer'}
                  onClick={() => {
                    console.log('BEFORE: ', isExpand);
                    setIsExpand((prevState) => ({
                      ...prevState,
                      [receipt._id]: !prevState[receipt._id]
                    }));
                  }}>
                  {index + 1}. {receipt._id}
                </Text>

                <VStack>
                  {isExpand[receipt._id] ? (
                    <>
                      <HStack>
                        <Text>
                          {receipt.productsInfo.length > 1 ? 'Items' : 'Item'}:{' '}
                          {receipt.productsInfo.length}
                        </Text>
                        <Text>Total price: {receipt.totalPrice.toFixed(2)}$</Text>
                      </HStack>
                      <Button {...buttonStyles} onClick={() => showDetails(receipt._id)}>
                        View Details
                      </Button>
                    </>
                  ) : null}
                </VStack>
              </VStack>
            ))}
          </Wrap>
        )}
      </CardBody>
    </Card>
  );
};

export default ReceiptItem;
