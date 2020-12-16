import gql from 'graphql-tag'
export const ALL_BOX = gql`
  query getAllbox($sucursal_id: Int!, $vendedor_id: Int) {
    cajas (
      input: {
        sucursal_id: $sucursal_id
        vendedor_id: $vendedor_id
      }
    )
    {
      id
      nombre_caja
      descripcion
    }
  }
`
