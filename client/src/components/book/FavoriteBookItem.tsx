import { Card, CardHeader, CardBody, Wrap, Text, Image, VStack } from '@chakra-ui/react';
import { User } from '../../model/User.model';
import { useNavigate } from 'react-router-dom';
import { cardTextStyle } from '../../globalStyles';
import { InfoIcon } from '@chakra-ui/icons';

type FavorteBookItemProps = {
  profile: User | undefined;
};

const FavoriteBookItem: React.FC<FavorteBookItemProps> = ({ profile }) => {
  const navigate = useNavigate();

  return (
    <Card w={'900px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <CardHeader display={'flex'} justifyContent={'center'}>
        <Text {...cardTextStyle} fontWeight={'600'}>
          Favorite Books
        </Text>
      </CardHeader>
      <CardBody>
        <Wrap display={'flex'} justify={'center'}>
          {profile?.favoriteBooks.length === 0 ? (
            <>
              <VStack>
                <InfoIcon boxSize={10} />
                <Text>No Favorite Book</Text>
              </VStack>
            </>
          ) : (
            profile?.favoriteBooks.map((book) => (
              <Image
                key={book._id}
                w={200}
                h={300}
                src={book.cover}
                cursor={'pointer'}
                onClick={async () => {
                  navigate(`/bookDetails/${book._id}`);
                  scrollTo({ top: 0, behavior: 'instant' });
                }}></Image>
            ))
          )}
        </Wrap>
      </CardBody>
    </Card>
  );
};

export default FavoriteBookItem;
