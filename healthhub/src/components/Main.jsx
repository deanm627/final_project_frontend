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
        text-shadow: #67e8f9 5px 0 20px;
    }
    
    h2 {
        margin: 0;
        font-size: 3rem;
        font-weight: 100;
    }

    @media (max-width: 900px) {
        h1 {
            font-size: 4.8rem;
        }

        h2 {
            text-align: center;
        }
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