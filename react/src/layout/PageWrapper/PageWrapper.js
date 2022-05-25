// 🌌 React :
import React, { useLayoutEffect, forwardRef } from 'react';
import { Navigate } from 'react-router-dom';

// 🛠️ useAuth hook :
import useAuth from '../../hooks/useAuth';

// Menu :
import { landingPage, loginPage } from '../../menu';

// Spinner :
import Spinner from '../../components/bootstrap/Spinner';

// 📚 Libraries :
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PageWrapper = forwardRef(({ title, description, className, isLoginPage, children }, ref) => {
    
    const auth = useAuth(); // 🦸 Auth

	useLayoutEffect(() => {
		// document.getElementsByTagName('TITLE')[0].text = `${title ? `${title} | ` : ''}${
		// 	process.env.REACT_APP_SITE_NAME
		// }`;
        document.getElementsByTagName('TITLE')[0].text = `${title ? `${title}` : ''}`;
		document
			.querySelector('meta[name="description"]')
			.setAttribute('content', description || process.env.REACT_APP_META_DESC);
	});

    if(auth.user && isLoginPage) 
        return <Navigate replace to={landingPage.landing.path} />

    if(!auth.user && !isLoginPage) 
        return <Navigate replace to={loginPage.login.path} />
    

	return (
		<div ref={ref} className={className === 'no-class' ? classNames('page-wrapper') : classNames('page-wrapper', 'container-fluid', className)}>
			{children}
		</div>
	);
});

PageWrapper.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
    isLoginPage: PropTypes.bool,
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
PageWrapper.defaultProps = {
	title: null,
	description: null,
    isLoginPage: false,
	className: null,
};

export default PageWrapper;
