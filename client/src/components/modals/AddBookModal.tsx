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

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ isOpen, onClose }) => {
  const [formInputs, setFormInputs] = useState({
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

  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const addBook = useApi<ApiResponse<Book>>();
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const toast = useToastHandler();
  const currentLocation = useLocation().pathname;
  const [isValidCoverURL, setIsValidCoverURL] = useState<boolean>(true);
  const [isValidYear, setIsValidYear] = useState<boolean>(true);
  const [isValidDescription, setIsValidDescription] = useState<boolean>(true);

  const addNewBook = async () => {
    const coverValid = urlRegex.test(formInputs.cover);
    const yearValid =
      Number(formInputs.year) >= 1000 && Number(formInputs.year) <= new Date().getFullYear();
    const descriptionValid = formInputs.description.length > 9;

    setIsValidCoverURL(coverValid);
    setIsValidYear(yearValid);
    setIsValidDescription(descriptionValid);

    if (!coverValid || !yearValid || !descriptionValid) {
      setIsDisabled(true);
      return;
    }

    const response = await addBook({
      method: 'POST',
      url: API_ROUTES.addBook,
      headers: { Authorization: `Bearer ${token}` },
      data: {
        title: formInputs.title,
        author: formInputs.author,
        genre: formInputs.genre,
        year: formInputs.year,
        description: formInputs.description,
        cover: formInputs.cover,
        isbn: formInputs.isbn,
        pagesCount: formInputs.pagesCount,
        price: formInputs.price
      }
    });

    if (response && response.status === 200) {
      onClose();
      setIsDisabled(true);
      toast('You successfully added new book in store', 'success');
      currentLocation === '/store'
        ? dispatch(addToAllBooks(response.data.data))
        : //else the location is '/' and add to the newest book list
          dispatch(addToTheNewest(response.data.data));
    }
  };

  const handleRequiredInputs = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormInputs((prevState) => ({
      ...prevState,
      [name]: value.trim()
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
  }, [formInputs]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign={'center'}>Add New Book</ModalHeader>
        <ModalBody display={'flex'} flexDirection={'column'} gap={4}>
          <Input onChange={handleRequiredInputs} placeholder="Title" name="title"></Input>
          <Input onChange={handleRequiredInputs} placeholder="Author" name="author"></Input>
          <VStack gap={0}>
            <HStack>
              <Input onChange={handleRequiredInputs} placeholder="Genre" name="genre"></Input>
              <Input
                type="number"
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
              size={'md'}
              placeholder="Enter your description here..."
              name="description"
              isInvalid={!isValidDescription}
              onChange={handleRequiredInputs}></Textarea>
            {!isValidDescription && (
              <Text width={'100%'} fontSize={'small'} textColor={'red'} textAlign={'start'}>
                The description must have at least 10 characters.
              </Text>
            )}
          </VStack>
          <VStack alignItems={'start'} gap={0}>
            <Input
              onChange={handleRequiredInputs}
              placeholder="Cover"
              name="cover"
              isInvalid={!isValidCoverURL}></Input>
            {!isValidCoverURL && (
              <Text fontSize={'small'} textColor={'red'}>
                Cover must be URL.
              </Text>
            )}
          </VStack>
          <Input onChange={handleRequiredInputs} placeholder="Isbn" name="isbn"></Input>
          <HStack>
            <Input
              type="number"
              onChange={handleRequiredInputs}
              placeholder="Number Of Pages"
              name="pagesCount"></Input>
            <Input
              type="number"
              onChange={handleRequiredInputs}
              placeholder="Price $$$"
              name="price"></Input>
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              isDisabled={isDisabled || !isValidCoverURL || !isValidYear || !isValidDescription}
              onClick={addNewBook}>
              Add
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddBookModal;
