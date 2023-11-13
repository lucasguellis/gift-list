import './checklist.css'

export default function Checklist({ data, handler }){
    return (
        <div>
        <h2>Lista de Presentes</h2>
        {Object.keys(data).map((tag) => (
            <div key={tag}>
            <h3>{tag}</h3>
            <ul>
                {data[tag].map((item) => (
                <li key={item.name}>
                    <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handler(tag, item.name)}
                    />
                    <span>{item.name}</span>
                </li>
                ))}
            </ul>
            </div>
        ))}
        </div>
    );
}