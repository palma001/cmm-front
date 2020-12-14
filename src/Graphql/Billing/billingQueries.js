import gql from 'graphql-tag'
export const GET_BILLINGS = gql`
  query getBillings($billing: FacturaFiltersSearch) {
    facturas (
      input: $billing
    )
    {
      id
      tipo_comprobante
      num_comprobante
      total_format
      created_at
      cliente {
        id
        full_name
      }
    }
  }
`
