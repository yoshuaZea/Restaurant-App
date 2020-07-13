import React, { useContext, useRef } from 'react'
import { FirebaseContext } from '../../firebase'

const Platillo = ({ platillo }) => {
    // Destructuring
    const { categoria, descripcion, existencia, id, imagen, nombre, precio } = platillo

    // Context con operaciones de firebase
    const { firebase } = useContext(FirebaseContext)

    // useRef para acceder al valor directamente del DOM
    const existenciaRef = useRef(existencia)

    // Modificar estado del platillo en firebase
    const actualizarDisponibilidad = () => {

        // Modificar string a boolean
        const existencia = (existenciaRef.current.value === "true")

        try {
            firebase.db.collection('platillos')
                .doc(id)
                .update({
                    existencia
                })
        } catch (error) {
            console.log(error)
        }
    }

    return ( 
        <div className="w-full px-3 mb-4">
            <div className="p-5 shadow-md bg-white">
                <div className="lg:flex">
                    <div className="lg:w-5/12 xl: 3/12">
                        <img className="rounded-md" src={imagen} alt="imagen platillo"/>
                        <div className="sm: flex sm:-mx-2">
                            <label className="block mt-5 sm: w-2/4">
                                <span className="block text-gray-800 mb-2 pl-2">Existencia</span>
                                <select 
                                    className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    value={existencia}
                                    ref={existenciaRef}
                                    onChange={ () => actualizarDisponibilidad() }
                                >
                                    <option value="true">Disponible</option>
                                    <option value="false">No disponible</option>
                                </select>
                            </label>
                        </div>
                    </div>
                    <div className="lg:w-7/12 xl: 9/12 pl-5">
                        <p className="font-bold text-2xl text-yellow-600 mb-4">{nombre}</p>
                        <p className="text-gray-600 mb-4">
                            Categoría: <span className="text-gray-700 font-bold">{categoria.toUpperCase()}</span>
                        </p>
                        <p className="text-gray-600 mb-4">{descripcion}</p>
                        <p className="text-gray-600 mb-4">
                            Precio: <span className="text-gray-700 font-bold">$ {precio}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default Platillo