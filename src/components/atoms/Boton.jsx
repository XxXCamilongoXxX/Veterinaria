export default function Boton({ children, className = '', ...props }) { return <button className={`boton-verde ${className}`} {...props}>{children}</button> }
