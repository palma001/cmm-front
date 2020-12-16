import gql from 'graphql-tag'
export const SAVE_BILLING = gql`
  mutation saveBulling($billing: FacturaInput) {
    guardarFactura (input: $billing)
    {
      id
    }
  }
`
