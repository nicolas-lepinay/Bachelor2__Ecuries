import React, { useState, useContext, useLayoutEffect } from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import classNames from 'classnames';
import { useFormik } from 'formik';
import ThemeContext from '../../../contexts/themeContext';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import SkeletonScreen from '../../../components/SkeletonScreeen';

import Card, { CardBody } from '../../../components/bootstrap/Card';
import Avatar, { AvatarGroup } from '../../../components/Avatar';
import Badge from '../../../components/bootstrap/Badge';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import showNotification from '../../../components/extras/showNotification';

import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SERVICES from '../../../common/data/serviceDummyData';
import { adminMenu, queryPages, clientQueryPages } from '../../../menu';

// 🛠️ Hooks :
import useAuth from '../../../hooks/useAuth';
import useFetchClients from '../../../hooks/useFetchClients'

import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';
import defaultHorseAvatar from '../../../assets/img/horse-avatars/defaultHorseAvatar.webp';

import axios from 'axios';

function UserList() {

    const navigate = useNavigate();

    // ⚙️ Strapi's API ROUTES :
    const API_URL = process.env.REACT_APP_API_URL;
    const USERS_ROUTE = process.env.REACT_APP_USERS_ROUTE;

    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    // 🦸 User:
    const auth = useAuth();

    const isAdmin = auth.user && Number(auth.user.role.id) === Number(ADMIN_ID);
    const isPro = auth.user && Number(auth.user.role.id) === Number(PRO_ID);
    const isClient = auth.user && Number(auth.user.role.id) === Number(CLIENT_ID);

    // Fetch clients :
    const { 
        data: clients, 
        setData: setClients, 
        loading,
        error } = useFetchClients();

    const { setRightPanel } = useContext(ThemeContext);

    const handleUpdate = async (newData) => {
        try {
            const res = await axios.put(`${API_URL}${USERS_ROUTE}/${newData.id}?populate=*`, newData); // Update
            const updatedUser = res.data;

            const newState = clients.map(user => {
                // 👇️ If id equals updated user's id, update 'confirmed' property:
                if (user.id === updatedUser.id)
                    return {...user, confirmed: updatedUser.confirmed};
                // 👇️ ...otherwise return object user as is
                return user;
            });
            setClients(newState);
              
            showNotification(
                'Mise à jour.', // title
                `Le statut du compte de ${updatedUser?.name} ${updatedUser?.surname} a été mis à jour.`, // message
                'success' // type
            );
        } catch(err) {
            console.log("UPDATE | User | L'utilisateur n'a pas pu être modifié dans la base de données. | " + err);
            showNotification(
                'Mise à jour.', // title
				"Oops ! Une erreur s'est produite. Le statut du compte de l'utilisateur n'a pas pu être modifié.", // message
                'danger' // type
			);
        }
    }

    useLayoutEffect(() => {
		setRightPanel(false);
	});

    // Chargement :
    if(loading)
        return <SkeletonScreen />

    return (
        <PageWrapper title={adminMenu.accounts.accounts.subMenu.clients.text}>
            <Page >
                <div className='h1 font-family-playfair d-flex justify-content-center mb-5'>Liste des utilisateurs</div>
                <div className='row row-cols-lg-2 row-cols-1 mt-5'>
                    {clients.map((user) => (
                        <div key={user.username} className='col mx-auto'>
                            <Card >
                                <CardBody>
                                    <div className='row g-3'>
                                        <div className='col d-flex'>
                                            <div className='flex-shrink-0'>
                                                <Link 
                                                    to={`${user?.id}`} 
                                                    className='position-relative' style={{cursor: 'pointer'}}>
                                                    <div
                                                        className='ratio ratio-1x1'
                                                        style={{ width: 100 }}>
                                                        <div
                                                            className={classNames(
                                                                `bg-l25-${user?.color || 'info'}`,
                                                                'rounded-2',
                                                                'd-flex align-items-center justify-content-center',
                                                                'overflow-hidden',
                                                                'shadow',
                                                            )}>
                                                            <img
													            src={user?.avatar ? `${API_URL}${user.avatar?.url}` : `${defaultAvatar}`}
                                                                width={100}
                                                            />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className='flex-grow-1 ms-3 d-flex justify-content-between'>
                                                <div className='w-100'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <div className='d-flex align-items-md-center align-items-start mb-3'>
                                                                <div className='fw-bold fs-5 me-2 font-family-playfair'>
                                                                    {`${user?.name} ${user?.surname}`}
                                                                </div>
                                                                {/* <small 
                                                                    className={classNames(
                                                                        `border-${user.confirmed ? 'success' : 'danger'}`,
                                                                        `text-${user.confirmed ? 'success' : 'danger'}`,
                                                                        'border border-2 fw-bold px-3 py-1 rounded-1 text-uppercase mx-2',                                                                        
                                                                    )}>
                                                                    {user.confirmed ? 'Confirmé' : 'En attente'}
                                                                </small> */}

                                                                <Dropdown>
                                                                    <DropdownToggle hasIcon={false}>
                                                                        <Button 
                                                                            color={user.confirmed ? 'success' : 'danger'} 
                                                                            className={classNames(
                                                                                `border-2 border-${user.confirmed ? 'success' : 'danger'}`,
                                                                                'mx-3 text-uppercase',
                                                                            )}
                                                                            isOutline
                                                                            size='sm' 
                                                                            disabled={!isAdmin}
                                                                        >
                                                                            {user.confirmed ? 'Confirmé' : 'En attente'}
                                                                        </Button>
                                                                    </DropdownToggle>
                                                                    <DropdownMenu>
                                                                    <DropdownItem isHeader>Status du compte</DropdownItem>
                                                                        <DropdownItem 
                                                                            onClick={() => handleUpdate({ id: user.id, confirmed: true, username: user.username })}
                                                                        >
                                                                            <div>
                                                                                <Icon icon='Circle' color='success'/>Confirmé
                                                                            </div>
                                                                        </DropdownItem>

                                                                        <DropdownItem
                                                                            onClick={() => handleUpdate({ id: user.id, confirmed: false, username: user.username })}
                                                                        >
                                                                            <div>
                                                                                <Icon icon='Circle' color='danger'/>En attente
                                                                            </div>
                                                                        </DropdownItem>
                                                                    </DropdownMenu>
                                                                </Dropdown>


                                                            </div>

                                                            <div className='h6 text-muted opacity-75'>
                                                                {user?.email}
                                                            </div>
                                                            <div className='h6 text-muted opacity-75'>
                                                                {user?.phone}
                                                            </div>
                                                        </div>
                                                        <div className='col-auto'>
                                                            {/* <Button
                                                                icon='Info'
                                                                color='dark'
                                                                isLight
                                                                hoverShadow='sm'
                                                                tag='a'
                                                                //to={`../${demoPages.appointment.subMenu.employeeID.path}/${user?.id}`}
                                                                data-tour={user?.name}
                                                            /> */}
                                                            <AvatarGroup className='me-3'>
                                                                {user.horses.map( horse => (
                                                                    <Avatar
                                                                        key={horse?.name}
                                                                        srcSet={horse?.avatar ? `${API_URL}${horse?.avatar?.url}` : `${defaultHorseAvatar}`}
                                                                        src={horse?.avatar ? `${API_URL}${horse?.avatar?.url}` : `${defaultHorseAvatar}`}
                                                                        userName={horse.name}
                                                                        color={horse?.color}
                                                                        onClick={() => navigate(`${queryPages.horses.path}/${horse?.id}`)}
                                                                    />
                                                                ))}
                                                            </AvatarGroup>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    ))}
                </div>
            </Page>
        </PageWrapper>
);
}

export default UserList