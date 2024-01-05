

export function WelcomePage({onClick}){
    return (
        <>
            <button onClick={() => onClick('')}>Single Player</button>
            <button onClick={() => onClick('0')}>Player1</button>
            <button onClick={() => onClick('1')}>Player2</button>
        </>
    )
}