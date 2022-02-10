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
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        size="xl"
        style={{ height: "100vh", backgroundColor: theme.backgroundColor }}
      >
        <CoinList />
      </Container>
    </ThemeProvider>
  )
}

export default App
