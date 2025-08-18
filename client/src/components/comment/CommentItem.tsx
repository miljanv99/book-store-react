import {
  Avatar,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import { Comment } from '../../model/Comment.model';
import { formattedDate } from '../../utils/formatDate';
import { FiMoreVertical } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectUserData } from '../../reducers/authSlice';
import { COLORS } from '../../globalColors';
import React from 'react';

type CommentItemProps = {
  comment: Comment;
  removeComment: (commentId: string) => void;
};

const CommentItem: React.FC<CommentItemProps> = ({ comment, removeComment }) => {
  console.log('Rendering CommentItem:', comment._id);
  const userId = useSelector(selectUserData)._id;
  const hoverBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <HStack
      w={'100%'}
      _hover={{ backgroundColor: hoverBg }}
      p={2}
      borderRadius={5}
      key={comment._id}>
      <HStack flex={1}>
        <Avatar boxSize={'70px'} src={comment.user.avatar}></Avatar>
        <VStack alignItems={'start'} gap={0}>
          <HStack>
            <Text>{comment.user.username}</Text>
            <Text textColor={'lightslategray'}>{formattedDate(comment.creationDate)}</Text>
          </HStack>
          <Text>{comment.content}</Text>
        </VStack>
      </HStack>
      {comment.user._id === userId && (
        <Menu>
          <MenuButton as={IconButton} icon={<FiMoreVertical />} variant="ghost" />
          {
            <MenuList>
              <MenuItem>Edit</MenuItem>
              <MenuItem
                textColor={COLORS.lightRed}
                onClick={() => {
                  removeComment(comment._id);
                }}>
                Delete
              </MenuItem>
            </MenuList>
          }
        </Menu>
      )}
    </HStack>
  );
};

export default React.memo(CommentItem);
