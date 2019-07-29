import styled from 'styled-components';

const Button = styled.button`
    border: none;
    border-radius: 3px;
    background-color: #e1e1e1;
    color: black;
    padding: 10px 15px;
    cursor: pointer;
    outline: none;
    margin-top: 10px;
    margin-bottom: 10px;
`;

Button.Primary = styled(Button)`
    background-color: #0080ff;
    color: white;
`;

export { Button };