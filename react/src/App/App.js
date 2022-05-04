import React, { useContext, useEffect, useLayoutEffect, useRef, useState, useMemo } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { TourProvider } from '@reactour/tour';
import ThemeContext from '../contexts/themeContext';
import { UserContext } from "../contexts/UserContext"
import { ProvideAuth } from '../hooks/useAuth';

import Footer from '../layout/Footer/Footer';

import Aside from '../layout/Aside/Aside';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
import { dashboardMenu, demoPages, layoutMenu } from '../menu';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import steps, { styles } from '../steps';

const App = () => {
	getOS();

	/**
	 * Dark Mode
	 */
	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
		};
	}, [darkModeStatus]);

	/**
	 * Full Screen
	 */
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const ref = useRef(null);
	useFullscreen(ref, fullScreenStatus, {
		onClose: () => setFullScreenStatus(false),
	});

	/**
	 * Modern Design
	 */
	useLayoutEffect(() => {
		if (process.env.REACT_APP_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});

	//	Add paths to the array that you don't want to be "Aside".
	const withOutAsidePages = [demoPages.login.path, demoPages.signUp.path, layoutMenu.blank.path];

    const [user, setUser] = useState(JSON.parse(localStorage.getItem("persevere_user")) || null);
    const currentUser = useMemo( () => ({user, setUser}), [user, setUser] );

	return (
        <UserContext.Provider value={currentUser}>
            <ProvideAuth>
                <ThemeProvider theme={theme}>
                    <ToastProvider components={{ ToastContainer, Toast }}>
                        <TourProvider
                            steps={steps}
                            styles={styles}
                            showNavigation={false}
                            showBadge={false}>
                            <div
                                ref={ref}
                                className='app'
                                style={{
                                    backgroundColor: fullScreenStatus && 'var(--bs-body-bg)',
                                    zIndex: fullScreenStatus && 1,
                                    overflow: fullScreenStatus && 'scroll',
                                }}>
                                <Routes>
                                    {/* {withOutAsidePages.map((path) => (
                                        <>
                                            {!user && <Route key={path} path={path} />}
                                            {user && <Route key={path} path={path} element={<Navigate replace to={dashboardMenu.dashboard.path} />} />}
                                        </>
                                    ))}
                                    {!user && <Route path='*' element={<Navigate replace to={demoPages.login.path} />} />}
                                    {user && <Route path='*' element={<Aside />} />} */}

                                    {withOutAsidePages.map((path) => (
                                        <Route key={path} path={path} />
                                    ))}
							        <Route path='*' element={<Aside />} />

                                </Routes>
                                <Wrapper />
                            </div>
                            <Portal id='portal-notification'>
                                <ReactNotifications />
                            </Portal>
                        </TourProvider>
                    </ToastProvider>
                </ThemeProvider>
            </ProvideAuth>
        </UserContext.Provider>
	);
};

export default App;
