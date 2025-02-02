interface Props {
    placeholder: string;
    type: string;
    name: string;
}

function TextField(props: Props) {
    return (
        <input
            type="text"
            placeholder={props.placeholder}
            className="text-input"
            name={props.name}
        />
    );
}

export default TextField;
