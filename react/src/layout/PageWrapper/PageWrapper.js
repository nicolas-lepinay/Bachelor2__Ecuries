// 🌌 React :
import React, { useLayoutEffect, forwardRef } from 'react';
import { Navigate } from 'react-router-dom';

// 🛠️ useAuth hook :
import useAuth from '../../hooks/useAuth';
import useFetchClients from '../../hooks/useFetchClients';

// Menu :
import { landingPage, loginPage } from '../../menu';

// Spinner :
import Spinner from '../../components/bootstrap/Spinner';

// 📚 Libraries :
import PropTypes from 'prop-types';
import classNames from 'classnames';

const PageWrapper = forwardRef(({ title, description, className, isLoginPage, children }, ref) => {
    
    // 🦸 Logged-in user :
    const auth = useAuth(); 

    // ⚙️ Role IDs :
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'

    const isAdmin = auth.user ? Number(auth.user.role.id) === Number(ADMIN_ID) : false;

    // 👨 Fetch up-to-date user from database to check if their account has been disabled or not :
    const { 
        data: user,
        error,
    } = useFetchClients({ filters: `&filters[role][id]=${PRO_ID}&filters[id]=${auth?.user?.id || 0}`, isUnique: true });

	useLayoutEffect(() => {
		// document.getElementsByTagName('TITLE')[0].text = `${title ? `${title} | ` : ''}${
		// 	process.env.REACT_APP_SITE_NAME
		// }`;
        document.getElementsByTagName('TITLE')[0].text = `${title ? `${title}` : ''}`;
		document
			.querySelector('meta[name="description"]')
			.setAttribute('content', description || process.env.REACT_APP_META_DESC);
	});

    // If user is on Login Page but is already logged-in -> go to Home Page :
    if(auth.user && isLoginPage) 
        return <Navigate replace to={landingPage.landing.path} />

    // If user is not logged-in and is not on Login Page -> go to Login Page :
    if(!auth.user && !isLoginPage) {
        return <Navigate replace to={loginPage.login.path} />
    }

    // If user's account has been disabled -> logout and go to Login Page :
    if((!isAdmin && user?.confirmed === false) || error) {
        auth.logout();
        return <Navigate replace to={loginPage.login.path} />
    }

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
