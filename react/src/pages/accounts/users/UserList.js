import React, { useState, useContext, useLayoutEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import classNames from 'classnames';
import { useFormik } from 'formik';
import ThemeContext from '../../../contexts/themeContext';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Avatar, { AvatarGroup } from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import Badge from '../../../components/bootstrap/Badge';
import Button from '../../../components/bootstrap/Button';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
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



function UserList() {

    const navigate = useNavigate();

    // ⚙️ Strapi's API URL :
    const API_URL = process.env.REACT_APP_API_URL;

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

    useLayoutEffect(() => {
		setRightPanel(false);
	});

    return (
        <PageWrapper title={adminMenu.accounts.accounts.subMenu.clients.text}>
            <Page container='fluid'>
                <div className='row row-cols-xxl-3 row-cols-lg-2 row-cols-md-1'>
                    {clients.map((client) => (
                        <div key={client.username} className='col'>
                            <Card>
                                <CardBody>
                                    <div className='row g-3'>
                                        <div className='col d-flex'>
                                            <div className='flex-shrink-0'>
                                                <div className='position-relative'>
                                                    <div
                                                        className='ratio ratio-1x1'
                                                        style={{ width: 100 }}>
                                                        <div
                                                            className={classNames(
                                                                `bg-l25-${client?.color || 'info'}`,
                                                                'rounded-2',
                                                                'd-flex align-items-center justify-content-center',
                                                                'overflow-hidden',
                                                                'shadow',
                                                            )}>
                                                            <img
													            src={client?.avatar ? `${API_URL}${client.avatar?.url}` : `${defaultAvatar}`}
                                                                width={100}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex-grow-1 ms-3 d-flex justify-content-between'>
                                                <div className='w-100'>
                                                    <div className='row'>
                                                        <div className='col'>
                                                            <div className='d-flex align-items-md-center align-items-start mb-3'>
                                                                <div className='fw-bold fs-5 me-2'>
                                                                    {`${client?.name} ${client?.surname}`}
                                                                </div>
                                                                <small 
                                                                    className={classNames(
                                                                        `border-${client.confirmed ? 'success' : 'danger'}`,
                                                                        `text-${client.confirmed ? 'success' : 'danger'}`,
                                                                        'border border-2 fw-bold px-3 py-1 rounded-1 text-uppercase mx-2',                                                                        
                                                                    )}>
                                                                    {client.confirmed ? 'Confirmé' : 'En attente'}
                                                                </small>
                                                            </div>

                                                            <div className='h6 text-muted opacity-75'>
                                                                {client?.email}
                                                            </div>
                                                            <div className='h6 text-muted opacity-75'>
                                                                {client?.phone}
                                                            </div>
                                                        </div>
                                                        <div className='col-auto'>
                                                            {/* <Button
                                                                icon='Info'
                                                                color='dark'
                                                                isLight
                                                                hoverShadow='sm'
                                                                tag='a'
                                                                //to={`../${demoPages.appointment.subMenu.employeeID.path}/${client?.id}`}
                                                                data-tour={client?.name}
                                                            /> */}
                                                            <AvatarGroup className='me-3'>
                                                                {client.horses.map( horse => (
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