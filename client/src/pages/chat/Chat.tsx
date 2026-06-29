import {
  Avatar,
  Button,
  Divider,
  HStack,
  IconButton,
  Input,
  List,
  ListItem,
  Text,
  useColorMode,
  useColorModeValue,
  useTheme,
  VStack
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { socket } from '../../socket';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../reducers/authSlice';
import { formattedDate } from '../../utils/formatDate';
import ChatPanel from './ChatPanel';
import { MdMessage } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa6';
import { AddIcon, ChatIcon } from '@chakra-ui/icons';
import { SOCKET_EVENTS } from '../../socket';
import { Conversation } from '../../model/Conversation.model';
import { User } from '../../model/User.model';
import { Message } from '../../model/Message.model';

const Chat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const userId = useSelector(selectUserData)._id;
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  useEffect(() => {
    console.log('SOCKET ID: ', socket.id);
    console.log(socket.connected);
    console.log(socket.id);
    socket.emit(SOCKET_EVENTS.PULL_CONVERSATIONS);

    const pulledConversations = (allConversations: any) => {
      console.log('Received conversations:', allConversations);
      setConversations(allConversations);
    };

    const pulledMessages = (allMessages: any) => {
      console.log('Received messages:', allMessages);
      setMessages(allMessages);
    };

    socket.on(SOCKET_EVENTS.PULLED_CONVERSATIONS, pulledConversations);
    socket.on(SOCKET_EVENTS.PULLED_MESSAGES, pulledMessages);

    socket.on('conversation_updated', (conversation_data) => {
      console.log('UPDATE CONV LAST MESSAGE: ', conversation_data);
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === conversation_data._id
            ? {
                ...conversation,
                lastMessage: conversation_data.lastMessage,
                lastMessageAt: conversation_data.lastMessageAt,
                lastMessageSender: {
                  _id: conversation_data.lastMessageSender._id,
                  username: conversation_data.lastMessageSender.username
                }
              }
            : conversation
        )
      );
    });

    return () => {
      socket.off(SOCKET_EVENTS.PULLED_CONVERSATIONS, pulledConversations);
      socket.off(SOCKET_EVENTS.PULLED_MESSAGES, pulledMessages);
      socket.off('conversation_updated');
    };
  }, []);

  useEffect(() => {
    if (!selectedConversationId) return;

    socket.emit('join_conversation', selectedConversationId);
  }, [selectedConversationId]);

  return (
    <HStack h="calc(100vh - 40px)" pt={'100px'} px={'50px'} data-test-id="TEST">
      <VStack h="full" w="40%">
        <HStack width={'100%'}>
          <Input placeholder="Search Conversation" aria-label="search_conversation"></Input>
          <IconButton aria-label="new_conversation" icon={<AddIcon></AddIcon>}></IconButton>
        </HStack>
        <List
          width={'100%'}
          spacing={4}
          overflowY={conversations.length > 9 ? 'scroll' : 'hidden'}
          overflowX={'hidden'}>
          {conversations.map((conversation) => {
            console.log('PARTICIPANTS: ', conversation.participants);
            const receiver = conversation.participants.find((p: User) => p._id !== userId)!;
            console.log('WHOLE CONVERSATION: ', conversation);
            return (
              <ListItem
                onClick={() => {
                  console.log('THIS IS ID: ', conversation._id);
                  setSelectedConversationId(conversation._id);
                  socket.emit(SOCKET_EVENTS.PULL_MESSAGES, conversation._id);
                }}
                boxShadow="xl"
                borderRadius={3}
                px={3}
                _hover={{ boxShadow: 'md', cursor: 'pointer', backgroundColor: hoverBg }}
                transition="0.2s"
                overflow={'hidden'}
                p={1}>
                <HStack width={'100%'}>
                  <Avatar src={receiver.avatar} size={'lg'}></Avatar>
                  <VStack flex={1} alignItems={'start'} overflow={'hidden'}>
                    <Text overflow={'hidden'} width={'100%'} fontSize={'large'} isTruncated>
                      {receiver.username}
                    </Text>
                    <HStack width={'100%'} justifyContent={'space-between'}>
                      <HStack overflow={'hidden'} flex={1}>
                        <Text>
                          {userId === conversation.lastMessageSender._id
                            ? 'You:'
                            : `${conversation.lastMessageSender.username}:`}
                        </Text>
                        <Text fontSize={'md'} isTruncated>
                          {conversation.lastMessage}
                        </Text>
                      </HStack>
                      <Text textAlign={'end'} fontSize={'sm'}>
                        {formattedDate(conversation.lastMessageAt)}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </ListItem>
            );
          })}
        </List>
      </VStack>
      <Divider orientation="vertical" borderWidth={2} borderRadius={'3xl'}></Divider>
      <ChatPanel
        messages={messages}
        conversation_id={selectedConversationId}
        setMessages={setMessages}></ChatPanel>
    </HStack>
  );
};

export default Chat;
