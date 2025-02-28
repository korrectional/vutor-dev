interface Props {
    placeholder: string;
    type: string;
    name: string;
    classes: string;
    autoComplete: string;
    disabled: boolean;
}

function TextField(props: Props) {
    return (
        <input
            type="text"
            placeholder={props.placeholder}
            className={props.classes} 
            name={props.name}
            autoComplete={props.autoComplete}
            disabled={props.disabled}
        />
    );
}

export default TextField;
