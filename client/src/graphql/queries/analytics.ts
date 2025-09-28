import { gql } from '@apollo/client';

export const ANALYTICS_QUERY = gql`
  query Analytics($limitNumber: Int!) {
    topMostPopularBooksWithLimit(limitNumber: $limitNumber) {
      title
      id
      description
    }
    totalRevenue
  }
`;
