import React, { useState, useContext } from 'react'
import { FirebaseContext } from '../../firebase'

const Orden = ({platillos}) => {
    // Destructuring
    const { id, orden, total, tiempoEntrega, completado } = platillos

    // Context de firebase
    const { firebase } = useContext(FirebaseContext)

    // State del componente
    const [tiempoOrden, setTiempoOrden] = useState(0)

    const definirTiempo = id => {
        try {
            firebase.db
                .collection('ordenes')
                .doc(id)
                .update({
                    tiempoEntrega: tiempoOrden
                })
        } catch (error) {
            console.log(error);
        }   
    }

    const completarOrden = id => {
        try {
            firebase.db
                .collection('ordenes')
                .doc(id)
                .update({
                    completado: true
                })
        } catch (error) {
            console.log(error);
        }
    }

    return ( 
        <div className="sm:w-1/2 lg:w-1/3 px-2 mb-4">
            <div className="p-3 shadow-md bg-white">
                <h1 className="text-yellow-600 text-lg font-bold">Orden: {id}</h1>
                {
                    orden.map((platillos, i) => (
                        <p 
                            className="text-gray-600" 
                            key={id + i}
                        >{platillos.cantidad} {platillos.nombre}</p>
                    ))
                }
                <p className="text-gray-700 font-bold">Total a pagar: $ {total}</p>

                {
                    tiempoEntrega === 0 && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Tiempo de entrega
                            </label>
                            <input 
                                type="number"
                                className="shadow appearance-none border rounded w-full py-2p px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                min="1"                           
                                max="30"
                                placeholder="¿Cuántos minutos?"
                                value={tiempoOrden}
                                onChange={ e => setTiempoOrden(parseInt(parseInt(e.target.value))) }
                            />
                            <button
                                type="submit"
                                className="bg-gray-800 hover:bg-gray-600 w-full mt-5 p-2 text-white uppercase font-bold cursor-pointer"
                                onClick={ () => definirTiempo(id) }
                            >
                                Definir tiempo
                            </button>
                        </div>
                    ) 
                }

                {
                    tiempoEntrega > 0 && (
                        <p className="text-gray-700">
                            Tiempo de entrega: <span className="font-bold">{tiempoEntrega} minutos</span>
                        </p>
                    )
                }

                {
                    !completado && tiempoEntrega > 0 && (
                        <button
                            type="submit"
                            className="bg-blue-800 hover:bg-blue-600 w-full mt-5 p-2 text-white uppercase font-bold cursor-pointer"
                            onClick={ () => completarOrden(id) }
                        >
                            Completar orden
                        </button>
                    )
                }
            </div>
        </div>
    )
}
 
export default Orden