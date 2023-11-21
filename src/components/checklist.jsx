import "./checklist.css";

export default function Checklist({ data, handler }) {
  return (
    <div>
      <div className="row">
        <h1 className="pt-5">Lista de Presentes</h1>
      </div>
      <div className="row">
        {Object.keys(data).map((tag) => (
          <div key={tag} className="col-lg-12">
            <h2 className="py-3">{tag}</h2>
            <div className="row">
              {data[tag].map((item, index) => (
                <div key={index} className="col-6 align-self-start py-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={item.name}
                    checked={item.checked}
                    onChange={() => handler(tag, item.name)}
                  />
                  <label htmlFor={item.name} className="ps-1">{item.name}</label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
