import { useState, useEffect } from "react";
import "./App.css";

function Home() {
  const [teste, setTest] = useState('');
  useEffect(() => {
    const getEnv = async() => await fetch('envs/api_url', {
      method: "GET",
    }).then(res => {setTest(res.clone().text())});
    getEnv();
  }, [setTest])
  console.log(teste);
  return (
    <div className="App">
      <header className="App-header">
        Olá, você não acessou uma rota existente :(
      </header>
      <p>{teste}</p>
    </div>
  );
}

export default Home;
