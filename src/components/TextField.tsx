interface Props {
    placeholder: string,
    type: string,
}

function TextField(props: Props) {
    return <input type="text" placeholder={props.placeholder} />;
}

export default TextField;
