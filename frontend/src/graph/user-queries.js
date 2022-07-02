import { gql } from 'graphql-request'

export const USER_DAOS = gql`
  query userDaosQuery($address: ID!) {
    members(where: { address: $address }) {
      id
      address
      dao {
        id
        address
        birth
        founder
        docs
        token {
          id
          name
          symbol
        }
      }
    }
  }
`