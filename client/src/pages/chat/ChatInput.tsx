import { IconButton, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react';
import React, { FC, useState } from 'react';
import { MdSend } from 'react-icons/md';

type ChatInputProps = {
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  sendMessage: (value: string) => void;
};

const ChatInput: FC<ChatInputProps> = ({ inputRef, sendMessage }) => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <InputGroup padding={'5px'}>
      <Input
        ref={inputRef}
        h={50}
        placeholder="Type message here..."
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage(inputValue);
            setInputValue('');
          }
        }}></Input>
      <InputRightElement pr={5} height={'100%'} display={'flex'} alignItems={'center'}>
        <IconButton
          _hover={{
            color: 'blue.500'
          }}
          backgroundColor={'transparent'}
          icon={<MdSend></MdSend>}
          aria-label={'send_message'}
          isDisabled={!inputValue}
          onClick={() => {
            sendMessage(inputValue);
            setInputValue('');
          }}></IconButton>
      </InputRightElement>
    </InputGroup>
  );
};

export default React.memo(ChatInput);
