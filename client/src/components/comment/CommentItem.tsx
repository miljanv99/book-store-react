import { Avatar, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { Comment } from '../../model/Comment.model';
import { formattedDate } from '../../utils/formatDate';

type CommentItemProps = {
  comment: Comment;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <HStack w={'100%'} key={comment._id}>
      <Avatar boxSize={'70px'} src={comment.user.avatar}></Avatar>
      <VStack alignItems={'start'} gap={0}>
        <HStack>
          <Text>{comment.user.username}</Text>
          <Text textColor={'lightslategray'}>{formattedDate(comment.creationDate)}</Text>
        </HStack>
        <Text>{comment.content}</Text>
      </VStack>
    </HStack>
  );
};

export default CommentItem;
