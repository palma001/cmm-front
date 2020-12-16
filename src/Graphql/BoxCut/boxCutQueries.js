import gql from 'graphql-tag'
export const GET_CORTE_CAJA_ACTIVE = gql`
  query getCorteCaja($boxCutFilter: CorteCajaFilterInput!) {
    verificarCorte (
      input: $boxCutFilter
    )
    {
      id
      arqueo_id
      caja {
        nombre_caja
      }
    }
  }
`
