// insertConversation.js
import mongoose from 'mongoose';
import { CONVERSATION } from '../models/Conversation.js';
import { MESSAGE } from '../models/Message.js';

// Replace with real user IDs
const user1Id = '6814ec438d3e2d1001557979';
const user2Id = '6814e640eb7685b417928eec';
const user3Id = '6814eed8afaf85cf61fe8ba0';

// const conversation_id_test = '69bf009e85aabd8911045ba0';

async function main() {
  try {
    // Connect to the same MongoDB as your server
    await mongoose.connect('mongodb://127.0.0.1:27017/BookStore', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    let conversation = await CONVERSATION.findOne({
      participants: {
        $all: [
          new mongoose.Types.ObjectId(user1Id),
          new mongoose.Types.ObjectId(user3Id),
        ],
        $size: 2,
      },
    });

    if (!conversation) {
      // Insert a new conversation
      console.log('CONVERSATION DOES NOT EXIST');
      conversation = await CONVERSATION.create({
        participants: [user1Id, user3Id],
      });
    } else {
      console.log('CONVERSATION EXISTS');
    }

    const message = await MESSAGE.create({
      conversation_id: conversation._id,
      senderId: user1Id,
      text: 'This is fourth message.',
      read: false,
    });

    const updatedConversation = await CONVERSATION.findByIdAndUpdate(
      conversation._id,
      {
        lastMessage: message.text,
        lastMessageAt: message.createdAt,
        lastMessageSender: message.senderId,
      },
      { new: true }
    );

    console.log('Conversation created:', updatedConversation);
    console.log('Message created:', message);

    // Disconnect when done
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error(err);
  }
}

main();
