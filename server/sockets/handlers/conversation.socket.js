import mongoose from 'mongoose';
import { CONVERSATION } from '../../models/Conversation.js';
import { MESSAGE } from '../../models/Message.js';
import { CHAT_EVENTS } from '../events/chat.event.js';

export default function registerConversationSocket(io, socket) {
  console.log('REGISTER CONVERSATION SOCKET');
  socket.on(CHAT_EVENTS.PULL_CONVERSATIONS, async () => {
    const conversations = await CONVERSATION.find({
      participants: { $in: [new mongoose.Types.ObjectId(socket.user.id)] },
    })
      .sort({ lastMessageAt: -1 })
      .populate('lastMessageSender', ['_id', 'username'])
      .populate('participants', ['_id', 'username', 'avatar']);

    console.log('CONVERSATIONS: ', conversations);

    socket.emit(CHAT_EVENTS.PULLED_CONVERSATIONS, conversations);
  });

  socket.on(CHAT_EVENTS.PULL_MESSAGES, async (conversation_id) => {
    console.log('ON SERVER SIDE CONVERSATION ID: ', conversation_id);
    socket.join(conversation_id);
    const messages = await MESSAGE.find({
      conversation_id: conversation_id,
    })
      .populate('senderId', ['username', 'avatar'])
      .populate({
        path: 'conversation_id',
        populate: { path: 'participants', select: '_id username' },
      })
      .sort({ createdAt: -1 })
      .limit(30);

    // the newest messages will be at the end when mapping
    messages.reverse();
    console.log('MESSAGES: ', messages);
    console.log('ROOM ID: ', socket.rooms);
    socket.emit(CHAT_EVENTS.PULLED_MESSAGES, messages);
  });

  socket.on('send_message', async ({ conversation_id, text }) => {
    console.log('SOCKET USER ID: ', socket.user);
    const newMessage = await MESSAGE.create({
      conversation_id: new mongoose.Types.ObjectId(conversation_id),
      senderId: new mongoose.Types.ObjectId(socket.user.id),
      text: text,
    });

    const updatedConverstaionItem = await CONVERSATION.findByIdAndUpdate(
      { _id: conversation_id },
      {
        lastMessage: newMessage.text,
        lastMessageAt: newMessage.createdAt,
        lastMessageSender: newMessage.senderId,
      },
      { new: true }
    ).populate('lastMessageSender', ['_id', 'username']);

    const populatedNewMessage = await newMessage.populate('senderId', [
      'username',
      'avatar',
    ]);

    console.log('NEW MESSGE: ', populatedNewMessage);

    io.to(conversation_id).emit('new_message', populatedNewMessage);
    io.to(conversation_id).emit(
      'conversation_updated',
      updatedConverstaionItem
    );
  });
}
