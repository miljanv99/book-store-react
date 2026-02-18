import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  VStack,
  Box,
  Input,
  Button,
  Text,
  HStack,
  UseDisclosureReturn,
  ModalCloseButton,
  ModalFooter
} from '@chakra-ui/react';
import { COLORS } from '../../globalColors';
import { buttonStyles } from '../../globalStyles';
import { FC, useState } from 'react';
import Papa from 'papaparse';
import { useDispatch } from 'react-redux';
import { API_ROUTES } from '../../constants/apiConstants';
import { useApi } from '../../hooks/useApi';
import { useToastHandler } from '../../hooks/useToastHandler';
import { ApiResponse } from '../../model/ApiResponse.model';
import { Book } from '../../model/Book.model';
import { addToAllBooks, addToTheNewest } from '../../reducers/bookSlice';

type ImportBooksModalProps = {
  importModalDisclosure: UseDisclosureReturn;
};

const ImportBooksModal: FC<ImportBooksModalProps> = ({ ...props }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [importedBooks, setImportedBooks] = useState<Book[]>();
  const toast = useToastHandler();
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
  const importBooksApi = useApi<ApiResponse<Book[], string>>();
  const dispatch = useDispatch();
  const currentPath = location.pathname;

  const handleCsvFile = (
    e: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    setIsDragging(false);

    let files: FileList | null = null;
    let selectedFile: File | null = null;

    if ('dataTransfer' in e) {
      files = e.dataTransfer.files;
    } else {
      files = e.target.files;
    }
    selectedFile = files && files[0];

    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        toast('Please upload CSV file', 'error', 'top-right');
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        toast('File too large. Max size is 2 MB.', 'error', 'top-right');
        return;
      }

      setFile(selectedFile);

      // parse csv to json
      Papa.parse<Book>(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('results: ', results);
          setImportedBooks(results.data);
        }
      });

      // Read file content
      const reader = new FileReader();
      reader.onload = () => {
        toast('CSV file uploaded successfully', 'success', 'top-right');
      };
      reader.readAsText(selectedFile);
    } else {
      toast('Something went wrong', 'error', 'top-right');
    }
  };

  const handleImport = async () => {
    const response = await importBooksApi({
      method: 'POST',
      url: API_ROUTES.importBooks,
      data: importedBooks
    });
    if (response && response.status === 200) {
      props.importModalDisclosure.onClose();
      setFile(null);
      toast(response.data.message, 'success', 'top-right');
      currentPath === '/store'
        ? dispatch(addToAllBooks(response.data.data))
        : dispatch(addToTheNewest(response.data.data));
    } else {
      const errors = response && response.data.errors;
      const firstError: string = errors && Object.values(errors)[0];

      toast(firstError, 'error', 'top-right');
    }
  };

  return (
    <Modal
      isOpen={props.importModalDisclosure.isOpen}
      onClose={() => {
        props.importModalDisclosure.onClose();
        setFile(null);
      }}>
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalHeader textAlign={'center'}>Import Books</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <Text>Please Select CSV File</Text>
            <Box
              w="100%"
              h="200px"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="lg"
              display="flex"
              bg={isDragging || file ? COLORS.primaryColor : 'transparent'}
              color={isDragging || file ? 'black' : 'white'}
              fontWeight={file ? 'semibold' : 'normal'}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => {
                setIsDragging(false);
              }}
              onDrop={handleCsvFile}
              alignItems="center"
              justifyContent="center">
              <VStack spacing={4}>
                <Input
                  type="file"
                  accept=".csv"
                  id="csv-upload"
                  display="none"
                  onChange={handleCsvFile}
                />
                {file ? (
                  <Text>{file.name}</Text>
                ) : (
                  <Button as="label" htmlFor="csv-upload" {...buttonStyles}>
                    Choose CSV File
                  </Button>
                )}
              </VStack>
            </Box>
            <ModalFooter>
              {file !== null && (
                <HStack>
                  <Button {...buttonStyles} onClick={handleImport}>
                    Import
                  </Button>
                  {
                    <Button
                      {...buttonStyles}
                      onClick={() => {
                        setFile(null);
                      }}>
                      Clear
                    </Button>
                  }
                </HStack>
              )}
            </ModalFooter>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ImportBooksModal;
