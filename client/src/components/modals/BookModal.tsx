import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  HStack,
  ModalFooter,
  Button,
  Textarea,
  Text,
  VStack
} from '@chakra-ui/react';
import { useApi } from '../../hooks/useApi';
import { ApiResponse } from '../../model/ApiResponse.model';
import { Book } from '../../model/Book.model';
import { API_ROUTES } from '../../constants/apiConstants';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken } from '../../reducers/authSlice';
import { useToastHandler } from '../../hooks/useToastHandler';
import { useLocation } from 'react-router-dom';
import { addToAllBooks, addToTheNewest } from '../../reducers/bookSlice';
import { urlRegex } from '../../constants/regex';

interface BaseBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddBookModalProps extends BaseBookModalProps {
  isEdit?: false;
  initialBook?: never;
  editedBook?: never;
}
interface EditBookModalProps extends BaseBookModalProps {
  isEdit: true;
  initialBook: Book;
  editedBook: (book: Book) => void;
}

type BookModalProps = AddBookModalProps | EditBookModalProps;

const BookModal: React.FC<BookModalProps> = ({
  isOpen,
  onClose,
  isEdit,
  initialBook,
  editedBook
}) => {
  const [formInputs, setFormInputs] = useState({
    title: initialBook ? initialBook.title : '',
    author: initialBook ? initialBook.author : '',
    genre: initialBook ? initialBook.genre : '',
    year: initialBook ? initialBook.year : '',
    description: initialBook ? initialBook.description : '',
    cover: initialBook ? initialBook.cover : '',
    isbn: initialBook ? initialBook.isbn : '',
    pagesCount: initialBook ? initialBook.pagesCount : '',
    price: initialBook ? initialBook.price : ''
  });

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const bookHandler = useApi<ApiResponse<Book>>();
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const toast = useToastHandler();
  const currentLocation = useLocation().pathname;
  const [isValidCoverURL, setIsValidCoverURL] = useState<boolean>(true);
  const [isValidYear, setIsValidYear] = useState<boolean>(true);
  const [isValidDescription, setIsValidDescription] = useState<boolean>(true);

  const handleBook = async () => {
    const coverValid = urlRegex.test(formInputs.cover);
    const yearValid =
      Number(formInputs.year) >= 1000 && Number(formInputs.year) <= new Date().getFullYear();
    const descriptionValid = formInputs.description.length > 9;

    setIsValidCoverURL(coverValid);
    setIsValidYear(yearValid);
    setIsValidDescription(descriptionValid);

    if (!coverValid || !yearValid || !descriptionValid) {
      //setIsDisabled(true);
      return;
    }

    const response = await bookHandler({
      method: isEdit ? 'PUT' : 'POST',
      url: isEdit ? API_ROUTES.editBook(initialBook._id) : API_ROUTES.addBook,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: formInputs.title.trim(),
        author: formInputs.author.trim(),
        genre: formInputs.genre.trim(),
        year: formInputs.year,
        description: formInputs.description.trim(),
        cover: formInputs.cover.trim(),
        isbn: formInputs.isbn.trim(),
        pagesCount: formInputs.pagesCount,
        price: formInputs.price
      }
    });

    try {
      onClose();
      setIsDisabled(true);
      toast(response && response.data.message, 'success');
      !isEdit
        ? // if the location is '/' and add to the newest book list, else ad to the full books list
          currentLocation === '/store'
          ? dispatch(addToAllBooks(response && response.data.data))
          : dispatch(addToTheNewest(response && response.data.data))
        : // set editedBook callback
          editedBook(response && response.data.data);

      !isEdit &&
        setFormInputs({
          title: '',
          author: '',
          genre: '',
          year: '',
          description: '',
          cover: '',
          isbn: '',
          pagesCount: '',
          price: ''
        });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequiredInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputs((prevState) => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'cover') {
      setIsValidCoverURL(true);
    }

    if (name === 'year') {
      setIsValidYear(true);
    }

    if (name === 'description') {
      setIsValidDescription(true);
    }
  };

  useEffect(() => {
    Object.values(formInputs).some((value) => value === '')
      ? setIsDisabled(true)
      : setIsDisabled(false);

    const isSameAsInitital =
      initialBook &&
      (Object.keys(formInputs) as (keyof typeof formInputs)[]).every((key) => {
        const formValue = formInputs[key] && formInputs[key].toString().trim();
        const initialValue = initialBook[key] && initialBook[key].toString().trim();

        return formValue === initialValue;
      });

    isSameAsInitital && setIsDisabled(isSameAsInitital);
  }, [formInputs]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>{isEdit ? 'Edit Book' : 'Add New Book'}</ModalHeader>
        <ModalBody display={'flex'} flexDirection={'column'} gap={4}>
          <Input
            value={formInputs.title}
            onChange={handleRequiredInputs}
            onBlur={(e) => setFormInputs((prev) => ({ ...prev, title: e.target.value.trim() }))}
            placeholder="Title"
            name="title"></Input>
          <Input
            value={formInputs.author}
            onChange={handleRequiredInputs}
            onBlur={(e) => setFormInputs((prev) => ({ ...prev, author: e.target.value.trim() }))}
            placeholder="Author"
            name="author"></Input>
          <VStack gap={0}>
            <HStack>
              <Input
                value={formInputs.genre}
                onChange={handleRequiredInputs}
                onBlur={(e) => setFormInputs((prev) => ({ ...prev, genre: e.target.value.trim() }))}
                placeholder="Genre"
                name="genre"></Input>
              <Input
                type="number"
                value={formInputs.year}
                isInvalid={!isValidYear}
                onChange={handleRequiredInputs}
                placeholder="Release Year"
                name="year"></Input>
            </HStack>
            {!isValidYear && (
              <Text width={'100%'} fontSize={'small'} textColor={'red'} textAlign={'end'}>
                {`Year must be between 1000-${new Date().getFullYear()}`}.
              </Text>
            )}
          </VStack>
          <VStack gap={0}>
            <Textarea
              value={formInputs.description}
              size={'md'}
              placeholder="Enter your description here..."
              name="description"
              isInvalid={!isValidDescription}
              onChange={handleRequiredInputs}
              onBlur={(e) =>
                setFormInputs((prev) => ({ ...prev, description: e.target.value.trim() }))
              }></Textarea>
            {!isValidDescription && (
              <Text width={'100%'} fontSize={'small'} textColor={'red'} textAlign={'start'}>
                The description must have at least 10 characters.
              </Text>
            )}
          </VStack>
          <VStack alignItems={'start'} gap={0}>
            <Input
              value={formInputs.cover}
              onChange={handleRequiredInputs}
              onBlur={(e) => setFormInputs((prev) => ({ ...prev, cover: e.target.value.trim() }))}
              placeholder="Cover"
              name="cover"
              isInvalid={!isValidCoverURL}></Input>
            {!isValidCoverURL && (
              <Text fontSize={'small'} textColor={'red'}>
                Cover must be URL.
              </Text>
            )}
          </VStack>
          <Input
            value={formInputs.isbn}
            onChange={handleRequiredInputs}
            onBlur={(e) => setFormInputs((prev) => ({ ...prev, isbn: e.target.value.trim() }))}
            placeholder="Isbn"
            name="isbn"></Input>
          <HStack>
            <Input
              type="number"
              value={formInputs.pagesCount}
              onChange={handleRequiredInputs}
              placeholder="Number Of Pages"
              name="pagesCount"></Input>
            <Input
              type="number"
              value={formInputs.price}
              onChange={handleRequiredInputs}
              placeholder="Price $$$"
              name="price"></Input>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              isDisabled={isDisabled || !isValidCoverURL || !isValidYear || !isValidDescription}
              onClick={handleBook}>
              {!isEdit ? 'Add' : 'Edit'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookModal;
