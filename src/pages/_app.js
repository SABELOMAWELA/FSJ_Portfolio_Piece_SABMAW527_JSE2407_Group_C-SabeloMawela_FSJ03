// src/pages/_app.js
import '../app/globals.css';
import Footer from '../../components/footer';
import Navbar from '../../components/navbar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <main>
        <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}

export default MyApp;
