import gql from 'graphql-tag'
export const ENTRY_AND_EXIT_OF_MONEY = gql`
  mutation saveEntryAndExitOfMoney($entryAndExitOfMoney: EntradaSalidaDineroInput!) {
    agregarEntradaSalidaDinero (input: $entryAndExitOfMoney)
    {
      id
    }
  }
`
