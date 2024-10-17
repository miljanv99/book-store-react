import { StarIcon } from "@chakra-ui/icons";
import { HStack, Icon } from "@chakra-ui/react";

interface BookRatingProps  {
    rating:number,
    size?: number
}

const BookRating: React.FC<BookRatingProps> = ({rating, size}) => {

    return(
        <HStack spacing={1}>
            {Array(5)
              .fill('')
              .map((_, i) => (
                <Icon
                  key={i}
                  as={StarIcon}
                  boxSize={25} 
                  style={{
                    color: i < Math.floor(rating) ? '#fcc203' : 'gray',
                    width: `${size}px`,
                    height: `${size}px`
                    }}
                />
              ))}
        </HStack>
    )
}

export default BookRating;