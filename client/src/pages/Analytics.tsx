import { useQuery } from '@apollo/client/react';
import { VStack, Text, Center, Spinner, Card, CardBody } from '@chakra-ui/react';
import { ANALYTICS_QUERY } from '../graphql/queries/analytics';

const Analytics = () => {
  type AnalyticsData = {
    topMostPopularBooksWithLimit: {
      _id: string;
      title: string;
      description: string;
    }[];
    totalRevenue: number;
  };

  type AnalyticsVars = {
    limitNumber: number;
  };

  const { data, loading, error } = useQuery<AnalyticsData, AnalyticsVars>(ANALYTICS_QUERY, {
    variables: { limitNumber: 3 }
  });

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
        <VStack mt={20} as="ul" spacing={2}>
          <Card width={'500px'}>
            <CardBody>
              <VStack>
                <Text fontSize={'x-large'}>Total Revenue</Text>
                <Text fontSize={'xxx-large'} fontWeight={'bold'}>
                  {data.totalRevenue}$
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      )}
    </>
  );
};

export default Analytics;
