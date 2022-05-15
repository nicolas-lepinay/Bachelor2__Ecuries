import React from 'react';
import { useMeasure } from 'react-use';
import classNames from 'classnames';
import useDarkMode from '../../hooks/useDarkMode';

const Footer = () => {
	const [ref, { height }] = useMeasure();

	const root = document.documentElement;
	root.style.setProperty('--footer-height', `${height}px`);

	const { darkModeStatus } = useDarkMode();

	return (
		<footer ref={ref} className='footer'>
			<div className='container-fluid'>
				<div className='row'>
					<div className='col'>
						<span className='fw-light' style={{letterSpacing: '1px'}}>リコルヌ • <span className='fw-bold gradient-text'>licorne™</span> • 🦄</span>
					</div>
					<div className='col-auto'>
						<a
							href='https://www.linkedin.com/in/nicolas-lepinay'
                            target='_blank'
							className={classNames('text-decoration-none', {
								'link-dark': !darkModeStatus,
								'link-light': darkModeStatus,
							})}>
							<small className='fw-light'>Copyright © 2022 • Nicolas Lépinay</small>
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
