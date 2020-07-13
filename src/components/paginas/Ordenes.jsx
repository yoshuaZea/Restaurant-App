import React, { useState, useEffect, useContext } from 'react'
import { FirebaseContext } from '../../firebase'
import Orden from '../ui/Orden'

const Ordenes = () => {

    // Context firebase
    const { firebase } = useContext(FirebaseContext)

    // State de ordenes
    const [ordenes, setOrdenes] = useState([])

    useEffect(() => {
        const obtenerOrdenes = () => {
            firebase.db
                .collection('ordenes')
                .where('completado', '==', false)
                .onSnapshot((snapshot) => {
                    let ordenes = snapshot.docs.map(doc => {
                        return {
                            id: doc.id,
                            ...doc.data()
                        }
                    })

                    setOrdenes(ordenes);
                })
        }

        obtenerOrdenes()
        // eslint-disable-next-line
    }, [])

    
    return (
        <>
            <h1 className="text-3xl font-light mb-4">Ordenes</h1>

            <div className="sm:flex sm:flex-wrap -mx-3">
                {
                    ordenes.length > 0 ? (
                        ordenes.map(orden => (
                            <Orden
                                key={orden.id}
                                platillos={orden}
                            />
                        ))
                    ) : (
                        <h3 className="pl-3 text-3xl font-light mb-4">Aún no tienes órdenes por servir!</h3>
                    )
                }
            </div>

        </>
    )
}
 
export default Ordenes