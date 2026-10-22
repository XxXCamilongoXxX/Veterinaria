import Encabezado from './Encabezado'
import PiePagina from './PiePagina'
export default function DisenoBase({ children }) { return <><Encabezado /><main>{children}</main><PiePagina /></> }
