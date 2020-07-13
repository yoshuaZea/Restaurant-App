import React, { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from '../../firebase'
import { Link } from 'react-router-dom'
import Spinner from '../ui/Spinner'
import Platillo from '../ui/Platillo'

const Menu = () => {
    // Context con operaciones de firebase
    const { firebase } = useContext(FirebaseContext)

    // State
    const [ platillos, setPlatillos ] = useState([])

    // Consultar base de datos al cargar
    useEffect(() => {
        const consultarPlatillos = () => {
            try {
                // Realtime database (escuchar cambios)
                firebase.db.collection('platillos').onSnapshot(handleSnapshot)
                
                // Consulta estática
                // const resultado = firebase.db.collection('platillos').get()
                // console.log(resultado)

            } catch (error) {
                console.log(error);
            }
        }

        consultarPlatillos()
        
        // eslint-disable-next-line
    }, [])

    // Snapshot permite utilizar la base de datos en tiempo real
    const handleSnapshot = snapshot => {
        const platillosShot = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            }
        })

        // Almacenar en el state
        setPlatillos(platillosShot)
    }
    
    return (
        <>
            <h1 className="text-3xl font-light mb-4">Menu</h1>
            <Link 
                exact="true"
                to="/nuevo-platillo" 
                className="bg-gray-800 hover:bg-gray-600 inline-block mb-5 p-2 text-white uppercase font-bold"
            >Agregar platillo</Link>

            { platillos.length === 0 && <Spinner /> }

            {
                platillos.map(platillo => (
                    <Platillo 
                        key={platillo.id}
                        platillo={platillo}
                    />
                ))
            }
        </>
    )
}
 
export default Menu