import gql from 'graphql-tag'
export const OPEN_BOX_CUT = gql`
  mutation openBoxCut($boxCut: CorteCajaInput) {
    abrirCorte (input: $boxCut)
    {
      id
      arqueo_id
      caja {
        nombre_caja
      }
    }
  }
`
export const CLOSE_BOX_CUT = gql`
  mutation closeBoxCut($id: ID!) {
    cerrarCorte (id: $id)
    {
      id
      arqueo_id
      caja {
        nombre_caja
      }
    }
  }
`
