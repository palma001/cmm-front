import gql from 'graphql-tag'
export const GET_CORTE_CAJA_ACTIVE = gql`
  query getCorteCaja($user_session_id: Int!) {
    verificarCorte (
      vendedor_id: $user_session_id
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
