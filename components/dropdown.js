import { useState } from 'react';

function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative mt-2 inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-primary"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </button>
            <ul
                className={`absolute ${isOpen ? '' : 'hidden'
                    } bg-white shadow-lg rounded mr-2 mt-2`}
            >
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                        Delete
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default Dropdown;