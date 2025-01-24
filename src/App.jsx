import SearchBox from "./components/SearchBox.jsx";
import Header from "./components/Header.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-gray-200">
      <Header />
      <main className="w-full max-w-4xl">
        <SearchBox />
      </main>
    </div>
  );
}

export default App;
