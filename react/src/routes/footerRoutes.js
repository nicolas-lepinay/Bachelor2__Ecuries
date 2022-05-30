import React from 'react';
import { landingPage, loginPage, logoutPage, demoPages } from '../menu';
import Footer from '../layout/Footer/Footer';

const footers = [
	// { path: layoutMenu.blank.path, element: null, exact: true },
	// { path: demoPages.login.path, element: null, exact: true },
	// { path: demoPages.signUp.path, element: null, exact: true },
    { path: logoutPage.logout.path, element: null, exact: true },
	{ path: loginPage.login.path, element: null, exact: true },
	{ path: '*', element: <Footer /> },
];

export default footers;
