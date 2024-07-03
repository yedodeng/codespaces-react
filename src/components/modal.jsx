export default function Modal({ show, close, children, btn }) {
    return (
        <div onClick={close} style={{ backgroundColor: "rgba(0, 0, 0, 0.35)", top: show ? 0 : "-150%" }}
            className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center duration-300">
            <div onClick={(ev) => ev.stopPropagation()} className="w-4/5 bg-base-100 p-3 rounded relative">
                {children}
                <button onClick={close} className="bg-error rounded absolute p-1 w-16 right-2 top-2 font-bold">{btn}</button>
            </div>
        </div>
    )
}