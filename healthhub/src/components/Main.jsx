import styled from 'styled-components';

const OuterWrapper = styled.div`
    height: 95vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 7rem;
        font-weight: 500;
        margin: 0;
    }
    
    h2 {
        margin: 0;
        font-size: 3rem;
        font-weight: 100;
    }
`

export default function Main() {

    return (
        <OuterWrapper>
            <h1>HealthHub</h1>
            <h2>One place for your health info</h2>
        </OuterWrapper>
    )
}