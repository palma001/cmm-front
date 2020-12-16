import gql from 'graphql-tag'
export const ALL_PRODUCT = gql`
  query getAllProducts($empresa_id: Int!) {
    articulos (
      input: {
        empresa_id: $empresa_id
      }
    )
    {
      id
      codigo
      precio_venta
      articulo
      stock
      tipo
      detalleIngresos {
        id
        precio_venta
      }
    }
  }
`
