import { SWRConfig } from "swr";
import "../styles/globals.scss";
import "react-toastify/dist/ReactToastify.css";

function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fallback: pageProps.fallback || {} }}>
      <Component {...pageProps} />
    </SWRConfig>
  );
}

export default App;
