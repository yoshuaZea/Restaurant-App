import React, { useContext, useState } from 'react'
import { FirebaseContext } from '../../firebase'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import FileUploader from 'react-firebase-file-uploader'

const NuevoPlatillo = () => {

    // Context con operaciones de firebase
    const { firebase } = useContext(FirebaseContext)

    // Hook para redireccionar
    const navigate = useNavigate()

    // State para las imágenes
    const [subiendo, setSubiendo] = useState(false)
    const [progreso, setProgreso] = useState(0)
    const [urlImagen, setUrlImagen] = useState('')

    // Categorías
    const categoriasOptions = [
        { value: 'desayuno', text: 'Desayunno' },
        { value: 'comida', text: 'Comida' },
        { value: 'cena', text: 'Cena' },
        { value: 'bebida', text: 'Bebidas' },
        { value: 'postre', text: 'Postres' },
        { value: 'ensalada', text: 'Ensaladas' }
    ]

    // Ordenamiento ascendente
    categoriasOptions.sort((a,b) => {
        if(a.text > b.text) return 1
        else if(a.text < b.text) return -1
        else return 0
    })

    // Validación y leer datos del formulario
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            imagen: '',
            descripcion: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                    .min(3, 'Los platillos deben tener al menos 3 caracteres')
                    .required('El nombre del platillo es obligatorio'),
            precio: Yup.number()
                    .min(1, 'Debes agregar el precio en número')
                    .required('El precio del platillo es obligatorio'),
            categoria: Yup.string()
                    .required('La categoría del platillo es obligatoria'),
            descripcion: Yup.string()
                    .min(10, 'Debes agregar una descripción más detallada')
                    .required('La descripción del platillo es obligatoria')
        }),
        onSubmit: platillo => {
            try {
                platillo.existencia = true
                platillo.imagen = urlImagen // url de imagen subida a firebase
                firebase.db.collection('platillos').add(platillo)

                Toast.fire({
                    icon: 'success',
                    title: 'Platillo creado correctamente'
                })

                // Redireccionar
                navigate('/')
            } catch (error) {
                console.log(error);
            }
        }
    })

    // Mensaje de alerta
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    // Todo sobre las imágenes
    const handleUploadStart = () => {
        setProgreso(0)
        setSubiendo(true)
    }

    const handleUploadError = error => {
        setSubiendo(false)
        console.log(error)
    }

    const handleUploadSuccess = async nombre => {
        setProgreso(100)
        setSubiendo(false)

        // Almacenar url destino
        const url = await firebase
                    .storage
                    .ref('platillos')
                    .child(nombre)
                    .getDownloadURL()
        
        setUrlImagen(url)
    }

    const handleProgress = progreso => {
        setProgreso(progreso)
    }


    return (
        <>
            <h1 className="text-3xl font-light mb-4">Agregar nuevo platillo</h1>

            <div className="flex justify-center mt-10">
                <div className="w-full max-w-3xl">
                    <form
                        onSubmit={formik.handleSubmit}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="nombre"
                                type="text"
                                placeholder="¿Cuál es el nombre del platillo?"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { 
                            formik.touched.nombre && formik.errors.nombre ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-600 p-4 mb-3" role="alert">
                                    <p className="font-bold">Hubo un error</p>
                                    <p>{formik.errors.nombre}</p>
                                </div>
                            ) : null
                        }

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                            <input 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="precio"
                                type="number"
                                placeholder="¿Cuánto cuesta el platillo?"
                                min="0"
                                value={formik.values.precio}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </div>

                        { 
                            formik.touched.precio && formik.errors.precio ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-600 p-4 mb-3" role="alert">
                                    <p className="font-bold">Hubo un error</p>
                                    <p>{formik.errors.precio}</p>
                                </div>
                            ) : null
                        }
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">Categoría</label>
                            <select
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="categoria"
                                value={formik.values.categoria}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="">Selecciona una opción</option>
                                {
                                    categoriasOptions.map((opt,i) => (
                                        <option key={i} value={opt.value}>{opt.text}</option>
                                    ))
                                }
                            </select>
                        </div>

                        { 
                            formik.touched.categoria && formik.errors.categoria ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-600 p-4 mb-3" role="alert">
                                    <p className="font-bold">Hubo un error</p>
                                    <p>{formik.errors.categoria}</p>
                                </div>
                            ) : null
                        }

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="imagen">Imagen</label>
                            <FileUploader 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="imagen"
                                name="imagen"
                                randomizeFilename
                                accept="image/*"
                                storageRef={firebase.storage.ref('platillos')}
                                onUploadStart={handleUploadStart}
                                onUploadError={handleUploadError}
                                onUploadSuccess={handleUploadSuccess}
                                onProgress={handleProgress}
                            />
                        </div>

                        { subiendo && (
                            <div className="h-12 relative w-full border">
                                <div className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center" style={{ width: `${progreso}%` }}>
                                    {progreso} %
                                </div>
                            </div>
                        )}

                        { urlImagen && (
                            <p className="bg-green-500 text-white p-3 text-center my-5">La imagen se subió correctamente</p>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">Descripción</label>
                            <textarea 
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                                id="descripcion"
                                placeholder="Descripción del platillo, ingredientes, coción, etc."
                                value={formik.values.descripcion}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            ></textarea>
                        </div>

                        { 
                            formik.touched.descripcion && formik.errors.descripcion ? (
                                <div className="bg-red-100 border-l-4 border-red-500 text-red-600 p-4 mb-3" role="alert">
                                    <p className="font-bold">Hubo un error</p>
                                    <p>{formik.errors.descripcion}</p>
                                </div>
                            ) : null
                        }

                        <input 
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-600 w-full mt-5 p-2 text-white uppercase font-bold cursor-pointer"
                            value="Agregar platillo"
                        />
                    </form>
                </div>
            </div>
        </>
    )
}
 
export default NuevoPlatillo