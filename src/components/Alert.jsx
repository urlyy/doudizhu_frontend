import { useState } from 'react';

const Alert = ({ message, type }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <div
            className={`${isVisible ? 'block' : 'hidden'
                } fixed top-0 left-0 right-0 bg-opacity-50 bg-gray-500 flex items-center justify-center h-screen`}
        >
            <div className={`bg-white p-4 rounded ${type == 'error' ? 'border-red-500' : 'border-green-500'} border`}>
                <p className={`${type == 'error' ? 'text-red-600' : 'text-green-600'} font-bold`}>{message}</p>
                <button
                    onClick={handleClose}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded focus:outline-none hover:bg-blue-600"
                >
                    关闭
                </button>
            </div>
        </div>
    );
};

export default Alert;
