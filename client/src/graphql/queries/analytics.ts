import { gql } from '@apollo/client';

export const ANALYTICS_QUERY = gql`
  query Analytics($limitNumber: Int!) {
    topMostPopularBooksWithLimit(limitNumber: $limitNumber) {
      id
      title
      purchasesCount
      price
    }
    totalRevenue
    getSalesByAuthor {
      author
      totalPurchases
    }
    users
    getNumberOfBooksByGenre {
      genre
      count
    }
    bestRatedBooksByGenre {
      genre
      books {
        id
        title
        currentRating
      }
    }
    userWithMostPurchases {
      username
      receiptsCount
    }
    userMostSpend {
      username
      totalSpent
    }
    userWithMostComments {
      username
      commentsCount
    }
    booksWithTheFewestPurchases {
      id
      title
      purchasesCount
    }
    favoriteBooksCount {
      title
      favoriteCount
    }
    recentPurchases {
      username
      totalPrice
      creationDate
    }
  }
`;
