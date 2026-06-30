import { VStack, Text, HStack, Avatar } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { socket } from '../../socket/socket';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../reducers/authSlice';
import { COLORS } from '../../globalColors';
import { Message } from '../../model/Message.model';
import ChatInput from './ChatInput';

type ChatPanelProps = {
  conversation_id: string | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

const ChatPanel: FC<ChatPanelProps> = (props) => {
  const userData = useSelector(selectUserData);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isAtBottomRef = useRef(true);

  const hasInitialScroll = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isMessageSent, setIsMessageSent] = useState<boolean>(false);

  const handleScroll = () => {
    const el = bottomRef.current;
    if (!el) return;

    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;

    isAtBottomRef.current = atBottom;
  };

  const sendMessage = useCallback(
    (value: string) => {
      console.log('PROP CONVERSATION ID: ', props.conversation_id);
      setIsMessageSent(true);
      console.log('TEST VALUE: ', value);
      socket.emit('send_message', {
        conversation_id: props.conversation_id,
        text: value
      });
      inputRef.current && (inputRef.current.value = '');
    },
    [props.conversation_id]
  );

  useEffect(() => {
    socket.on('new_message', (msg) => {
      console.log('NEW MESSAGE: ', msg);
      props.setMessages((prev) => [...prev, msg]);
    });
    const el = bottomRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);

    return () => {
      socket.off('new_message');
      el.removeEventListener('scroll', handleScroll);
    };

    // return () => {};
  }, []);

  // useEffect(() => {
  //   hasInitialScroll.current = false;
  // }, [props.conversation_id]);

  useEffect(() => {
    if (!bottomRef.current) return;
    if (!isMessageSent) return;

    if (bottomRef.current) {
      bottomRef.current.scrollTo({
        top: bottomRef.current.scrollHeight,
        behavior: 'smooth'
      });
      // hasInitialScroll.current = true;
    }

    return () => {
      setIsMessageSent(false);
    };
  }, [props.messages]);

  useEffect(() => {
    // const el = bottomRef.current;
    // if (!el) return;
    // el.addEventListener('scroll', handleScroll);
    // return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    if (isAtBottomRef.current) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [props.messages]);

  return (
    <>
      <VStack h="full" w="60%" boxShadow={'2xl'}>
        <VStack
          ref={bottomRef}
          width={'100%'}
          flex={1}
          overflowY={'auto'}
          alignItems={'space-between'}
          padding={5}>
          {props.conversation_id ? (
            props.messages.map((message) => {
              const isSender = message.senderId._id === userData._id ? true : false;
              return (
                <>
                  <VStack>
                    <HStack width={'100%'} justifyContent={isSender ? 'end' : 'start'}>
                      <HStack maxWidth={'70%'} flexDirection={isSender ? 'row-reverse' : 'row'}>
                        <Avatar src={message.senderId.avatar} alignSelf={'start'}></Avatar>
                        <Text
                          borderRadius={'lg'}
                          padding={'2'}
                          color={'black'}
                          backgroundColor={COLORS.primaryColor}>
                          {message.text}
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </>
              );
            })
          ) : (
            <Text margin={'auto'}>Select Or Create New Converastion</Text>
          )}
        </VStack>
        {props.conversation_id && (
          <ChatInput inputRef={inputRef} sendMessage={sendMessage}></ChatInput>
        )}
      </VStack>
    </>
  );
};

export default ChatPanel;
