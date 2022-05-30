import React, { lazy, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import contents from '../../routes/contentRoutes'; // All routes (admin, pro, clients)
import useAuth from '../../hooks/useAuth'; // 🛠️ useAuth hook :

const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));

const ContentRoutes = () => {

    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'
    
    // 🦸 Logged-in user
    const user = useAuth().user;

    const isAdmin = user && Number(user.role.id) === Number(ADMIN_ID);
    const isPro = user && Number(user.role.id) === Number(PRO_ID);
    const isClient = user && Number(user.role.id) === Number(CLIENT_ID);

    // 🚗 Routes
    const { admin, professional, client, common, auth, queries } = contents; // All routes (admin, pro, clients)
    const [filteredContents, setFilteredContents] = useState([]); // Routes filtered depending on user's role

    useEffect(() => {
        if(user) {
            isAdmin && setFilteredContents([ ...admin, ...common, ...auth ]);
            isPro && setFilteredContents([ ...professional, ...common, ...auth ]);
            isClient && setFilteredContents([ ...client, ...common, ...auth ]);
        } else {
            setFilteredContents([ ...auth])
        }
    }, [user])

	return (
		<Routes>
			{filteredContents.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))}
			<Route path='*' element={<PAGE_404 />} />
		</Routes>
	);
};

export default ContentRoutes;
