import { useParams } from 'react-router-dom';

function HorsePage() {

    const { id } = useParams();

    return (

        <div>
            <h1>PAGE 'HORSE LIST'</h1>
            <h4>ID : {id} </h4>
        </div>
    )
}

export default HorsePage