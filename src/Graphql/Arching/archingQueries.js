import gql from 'graphql-tag'
export const GET_ARCHING = gql`
  query getArchings($arching: ArqueoFiltersSearch) {
    arqueos (
      input: $arching
    )
    {
      id
      estado
      descripcion
      sucursal_id
    }
  }
`
