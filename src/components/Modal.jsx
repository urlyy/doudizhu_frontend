const Modal = ({ isOpen, children }) => {
    if (isOpen) {
        return (
            <div className="modal z-50 fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md relative">
                    {/* Close Button */}
                    {/* <button onClick={onClose} className="absolute top-0 right-0 mt-4 mr-4 text-gray-500 hover:text-gray-700">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button> */}
                    {children}
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

export default Modal;