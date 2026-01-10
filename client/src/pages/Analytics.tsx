import { useQuery } from '@apollo/client/react';
import {
  VStack,
  Text,
  Center,
  Spinner,
  Card,
  CardBody,
  Box,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from '@chakra-ui/react';
import { ANALYTICS_QUERY } from '../graphql/queries/analytics';
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Line,
  LineChart
} from 'recharts';
import { useEffect, useMemo } from 'react';
import { COLORS } from '../globalColors';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

type AnalyticsData = {
  topMostPopularBooksWithLimit: {
    id: string;
    title: string;
    purchasesCount: number;
    price: number;
  }[];
  totalRevenue: number;
  getSalesByAuthor: [{ author: string; totalPurchases: number }];
  users: number;
  getNumberOfBooksByGenre: [{ genre: string; count: number }];
  bestRatedBooksByGenre: [
    { genre: string; books: [{ id: string; title: string; currentRating: number }] }
  ];
  userWithMostPurchases: [{ username: string; receiptsCount: number }];
  userMostSpend: [{ username: string; totalSpent: number }];
  userWithMostComments: [{ username: string; commentsCount: number }];
  booksWithTheFewestPurchases: [{ id: string; title: string; purchasesCount: number }];
  favoriteBooksCount: [{ title: string; favoriteCount: number }];
  recentPurchases: [{ username: string; totalPrice: number; creationDate: Date }];
};

type AnalyticsVars = {
  limitNumber: number;
};

const Analytics = () => {
  const { data, loading, error } = useQuery<AnalyticsData, AnalyticsVars>(ANALYTICS_QUERY, {
    variables: { limitNumber: 5 }
  });
  const navigate = useNavigate();

  const PIE_COLORS = [
    '#0088FE', // Fantasy
    '#00C49F', // Classics
    '#FFBB28', // Crime novel
    '#FF8042', // Thriller
    '#A28CFE', // Post-apocalyptic
    '#FF4F81' // Horror
  ];

  const TITLE_STYLE = {
    fontSize: '2xl',
    color: COLORS.primaryColor
  };

  useEffect(() => {
    console.log('ALL DATA: ', data?.recentPurchases);
  }, [data]);

  const convertedDateForRecentPurchases = useMemo(() => {
    if (!data?.recentPurchases) {
      return [];
    }
    return data.recentPurchases.map((purchase) => ({
      ...purchase,
      creationDate: new Date(Number(purchase.creationDate)).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }));
  }, [data?.recentPurchases]);

  if (loading)
    return (
      <Center height={'100vh'}>
        <Spinner></Spinner>
      </Center>
    );

  if (error)
    <Center height={'100vh'}>
      <Text>{error.message}</Text>
    </Center>;

  return (
    <>
      {data && (
        <>
          <HStack mt={20} as="ul" spacing={2} justify={'center'}>
            <Card width={'500px'}>
              <CardBody>
                <VStack>
                  <Text fontSize={'x-large'}>Total Revenue</Text>
                  <Text fontSize={'xxx-large'} fontWeight={'bold'}>
                    {data.totalRevenue.toFixed(2)}$
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card width={'500px'}>
              <CardBody>
                <VStack>
                  <Text fontSize={'x-large'}>Total Users</Text>
                  <Text fontSize={'xxx-large'} fontWeight={'bold'}>
                    {data.users}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </HStack>

          <HStack justifyContent={'space-evenly'} mt={5}>
            <Box width={'50vw'} height={'50vh'}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={data.getSalesByAuthor}
                  margin={{
                    bottom: 60
                  }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend verticalAlign="top" />
                  <XAxis dataKey="author" angle={-30} textAnchor="end" style={{ fontSize: 13 }} />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="totalPurchases"
                    name={'Sold Books By Authors'}
                    fill={COLORS.primaryColor}
                    activeBar={
                      <Rectangle
                        fill={COLORS.darkPrimaryColor}
                        stroke={COLORS.darkerPrimaryColor}
                      />
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Table width={'50vh'}>
              <TableCaption {...TITLE_STYLE} placement="top">
                Most Popular Books
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Sold Copies</Th>
                  <Th>Total Revenue</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.topMostPopularBooksWithLimit.map((book, index) => (
                  <Tr key={index}>
                    <Td
                      _hover={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: COLORS.darkPrimaryColor
                      }}
                      onClick={() => navigate(ROUTES.BOOK_DETAILS_DYNAMIC_PATH(book.id))}>
                      {book.title}
                    </Td>
                    <Td>{book.purchasesCount}</Td>
                    <Td>{(book.purchasesCount * book.price).toFixed(2)}$</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </HStack>

          <HStack alignItems={'start'} mt={8} mb={16}>
            <Box width={'50vw'} height={'50vh'}>
              <Text {...TITLE_STYLE} textAlign={'center'} fontWeight={'medium'}>
                Number Of Books By Genre
              </Text>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="count"
                    nameKey="genre"
                    isAnimationActive={true}
                    data={data.getNumberOfBooksByGenre}
                    cx="50%"
                    cy="50%"
                    outerRadius={'80%'}
                    label>
                    {data.getNumberOfBooksByGenre.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend></Legend>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Tabs>
              <TabList>
                {data.bestRatedBooksByGenre.map((item, index) => (
                  <Tab key={index}>{item.genre}</Tab>
                ))}
              </TabList>

              <TabPanels>
                {data.bestRatedBooksByGenre.map((item) => (
                  <>
                    <TabPanel key={item.genre}>
                      <Center>
                        <Table width={'50vh'}>
                          <TableCaption {...TITLE_STYLE} placement="top">
                            Best Rated {item.genre}
                          </TableCaption>
                          <Thead>
                            <Tr>
                              <Th>Title</Th>
                              <Th>Rating</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {item.books.map((book, index) => (
                              <Tr key={index}>
                                <Td
                                  _hover={{
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    color: COLORS.darkPrimaryColor
                                  }}
                                  onClick={() =>
                                    navigate(ROUTES.BOOK_DETAILS_DYNAMIC_PATH(book.id))
                                  }>
                                  {book.title}
                                </Td>
                                <Td>{book.currentRating.toFixed(2)}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Center>
                    </TabPanel>
                  </>
                ))}
              </TabPanels>
            </Tabs>
          </HStack>

          <HStack justifyContent={'space-evenly'} mt={5} alignItems={'start'}>
            <Box width={'40vw'} height={'50vh'}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={data.userWithMostPurchases}
                  margin={{
                    bottom: 60
                  }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend verticalAlign="top" />
                  <XAxis dataKey="username" angle={-30} textAnchor="end" style={{ fontSize: 13 }} />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="receiptsCount"
                    name={'Most Number Of Purchases'}
                    fill={COLORS.primaryColor}
                    activeBar={
                      <Rectangle
                        fill={COLORS.darkPrimaryColor}
                        stroke={COLORS.darkerPrimaryColor}
                      />
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Table width={'40vh'}>
              <TableCaption {...TITLE_STYLE} placement="top">
                Users With The Most Money Spent
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Username</Th>
                  <Th>Money Spent</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.userMostSpend.map((user) => (
                  <Tr>
                    <Td>{user.username}</Td>
                    <Td>{user.totalSpent.toFixed(2)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Table width={'40vh'}>
              <TableCaption {...TITLE_STYLE} placement="top">
                Users The With Most Comments
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Username</Th>
                  <Th>Number Of Comments</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.userWithMostComments.map((user) => (
                  <Tr>
                    <Td>{user.username}</Td>
                    <Td textAlign={'center'}>{user.commentsCount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </HStack>

          <HStack justifyContent={'space-evenly'} mt={5} alignItems={'start'}>
            <Table width={'60vh'}>
              <TableCaption {...TITLE_STYLE} placement="top">
                The Fewest Purchased Books
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Sold Copies</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.booksWithTheFewestPurchases.map((book) => (
                  <Tr>
                    <Td
                      _hover={{
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: COLORS.darkPrimaryColor
                      }}
                      onClick={() => navigate(ROUTES.BOOK_DETAILS_DYNAMIC_PATH(book.id))}>
                      {book.title}
                    </Td>
                    <Td>{book.purchasesCount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Box width={'40vw'} height={'50vh'}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={400}
                  data={data.favoriteBooksCount}
                  margin={{
                    bottom: 80
                  }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Legend verticalAlign="top" />
                  <XAxis
                    height={100}
                    dataKey="title"
                    angle={-40}
                    interval={0}
                    textAnchor="end"
                    style={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="favoriteCount"
                    name={'The highest number of books which are added to "favorites” list'}
                    fill={COLORS.primaryColor}
                    activeBar={
                      <Rectangle
                        fill={COLORS.darkPrimaryColor}
                        stroke={COLORS.darkerPrimaryColor}
                      />
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </HStack>

          <HStack justifyContent={'space-evenly'} mt={5} alignItems={'start'}>
            <Box>
              <Text {...TITLE_STYLE} textAlign={'center'} fontWeight={'medium'}>
                Recent Purchases
              </Text>
              <LineChart
                width={670}
                height={400}
                data={convertedDateForRecentPurchases}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 5
                }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="creationDate" fontSize={12} />
                <YAxis width="auto" />
                <Tooltip formatter={(value: number) => value.toFixed(2) + '$'} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="totalPrice"
                  stroke={COLORS.primaryColor}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </Box>
          </HStack>
        </>
      )}
    </>
  );
};

export default Analytics;
