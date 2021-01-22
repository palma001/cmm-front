import gql from 'graphql-tag'
export const CheckingAccount = gql`
  query getCheckingAccount($filters: CuentaCorrienteFiltersSearch) {
    cuentaCorrientes (
        input: $filters
    )
    {
      id
      full_name
      email
      num_documento
      tipo_documento
    }
  }
`
