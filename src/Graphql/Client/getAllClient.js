import gql from 'graphql-tag'
export const ALL_CLIENT = gql`
  query getAllclientes($empresa_id: Int!) {
    clientes (
      input: {
        empresa_id: $empresa_id
      }
    )
    {
      id
      full_name
    }
  }
`
