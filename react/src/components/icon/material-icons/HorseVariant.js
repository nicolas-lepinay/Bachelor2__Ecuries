import * as React from 'react';

function HorseVariant(props) {
	return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1em'
            viewBox='0 0 24 24'
            width='1em'
            className='svg-icon'
            {...props}>

            <path fill="currentColor" d="M20 8V16L17 17L13.91 11.5C13.65 11.04 12.92 11.27 13 11.81L14 21L4 17L5.15 8.94C5.64 5.53 8.56 3 12 3H20L18.42 5.37C19.36 5.88 20 6.86 20 8Z" />        
        </svg>
	);
}

export default HorseVariant;