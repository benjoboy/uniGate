import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material"
import "./App.css"
import { CoinList } from "./components/CoinList"

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'white' },
          style: {
            textTransform: 'none',
            border: `1px solid white`,
          },
        },
      ],
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        size='xl'
      >
        <CoinList />
      </Container>
    </ThemeProvider>
  )
}

export default App
