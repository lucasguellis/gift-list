import "./App.css";
import { useEffect, useState } from "react";
import { useParams } from 'react-router';
import Checklist from './components/checklist';


function App() {
  const [data, setData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [API_URL, setAPI_URL] = useState('');
  const [AUTH_KEY_SECRET, setAUTH_KEY_SECRET] = useState('');
  const env_url = process.env.REACT_APP_API_URL || "";
  const params = useParams();

  useEffect(() => {
    const getEnvApi = async() => await fetch(env_url + 'envs/api_url')
    .then(res => res.text())
    .then(res => setAPI_URL(res));
    getEnvApi();
  }, [setAPI_URL, env_url])

  useEffect(() => {
    const getEnvAuthKey = async() => await fetch(env_url + 'envs/secret')
    .then(res => res.text())
    .then(res => setAUTH_KEY_SECRET(res));
    getEnvAuthKey();
  }, [setAUTH_KEY_SECRET, env_url])

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const result = await fetch(`${API_URL}/${params.name}`, {
        headers: { "Content-type": "application/json" },
        method: "GET",
      })
        .then((res) => res.json())
        .catch((err) => {
          console.log(err);
          return [];
        });
      setData(result);
      setIsLoading(false);
    };
    fetchData();
  }, [setData, params.name, API_URL]);

  useEffect(() => {
    const groupedData = data.reduce((acc, item) => {
      const tag = item.tag;
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(item);
      return acc;
    }, {});
    setGroupedData(groupedData);
  }, [data]);

  function handleCheckboxChange(tag, itemName) {
    // Update the local state
    const updatedData = data.map((item) =>
      item.tag === tag && item.name === itemName
        ? { ...item, checked: !item.checked }
        : item,
    );

    // Make the API request to update the checked property
    fetch(`${API_URL}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "X-Auth-Key": `${AUTH_KEY_SECRET}`,
      },
      body: JSON.stringify({
        key: `gift-list-${params.name}.json`,
        value: updatedData,
      }),
    })
      .then((res) => res.json())
      .then(setData(updatedData))
      .catch((err) => console.log(err));
  }

  return (
      <div className="App-body pb-5">
      <div className="container text-center">
        <div className="row">
            {isLoading ? <p>Carregando...</p> : (
              data.length > 0 ? (
                <Checklist data={groupedData} handler={handleCheckboxChange}/>
              ) : (
                <p>Essa lista não existe :(</p>
              )
            )}
        </div>
      </div>
      </div>
  );
}

export default App;
