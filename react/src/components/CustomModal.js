// 🌌 React :
import { useState, useEffect } from 'react'

// 🅱️ Bootstrap components :
import Button from './bootstrap/Button';

import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from './bootstrap/Modal';

function CustomModal({ state, setState, src, action }) {

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [sizeStatus, setSizeStatus] = useState(null);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [longContentStatus, setLongContentStatus] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setSizeStatus(null);
		setFullScreenStatus(null);
		setAnimationStatus(true);
		setLongContentStatus(false);
		setHeaderCloseStatus(true);
	};

    useEffect ( () => {
        if(state) {
            initialStatus();
            setCenteredStatus(true);
        }
    }, [state])

    return (
        <Modal
            isOpen={state}
            setIsOpen={setState}
            titleId='confirmationModal'
            isStaticBackdrop={staticBackdropStatus}
            isScrollable={scrollableStatus}
            isCentered={centeredStatus}
            size={sizeStatus}
            fullScreen={fullScreenStatus}
            isAnimation={animationStatus}>
                <ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
                    <ModalTitle id='confirmationModal'>{src.title}</ModalTitle>
                </ModalHeader>

                <ModalBody className='text-center new-line'>{src.body}</ModalBody>

                <ModalFooter>
                    <Button
                        color={src.secondaryColor}
                        className='border-0'
                        icon={src.secondaryIcon}
                        isOutline
                        onClick={() => setState(false)}
                    >
                        {src.secondaryButton}
                    </Button>

                    <Button 
                        color={src.primaryColor} 
                        icon={src.primaryIcon}
                        onClick={action}
                    >
                        {src.primaryButton}
                    </Button>
                </ModalFooter>
        </Modal>
    )
}

export default CustomModal