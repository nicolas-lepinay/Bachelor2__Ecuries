import React, { useState, useContext, useEffect, useLayoutEffect } from 'react';
import { useNavigate, Link  } from 'react-router-dom';
import classNames from 'classnames';
import ThemeContext from '../../../contexts/themeContext';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import SkeletonScreen from '../../../components/SkeletonScreeen';

import Card, { CardBody } from '../../../components/bootstrap/Card';
import Avatar, { AvatarGroup } from '../../../components/Avatar';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';

import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle } from '../../../components/bootstrap/Modal'

import Alert from '../../../components/bootstrap/Alert';

import CommonHorseCreation from '../../common/CommonHorseCreation';
import { adminMenu, queryPages, clientQueryPages } from '../../../menu';

// 🛠️ Hooks :
import useAuth from '../../../hooks/useAuth';
import useFetchHorses from '../../../hooks/useFetchHorses'

import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';
import defaultHorseAvatar from '../../../assets/img/horse-avatars/defaultHorseAvatar.webp';

function HorseList() {

    const navigate = useNavigate();

    // ⚙️ Strapi's API ROUTES :
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

    // Filter owner's horse(s) if user is not admin or pro :
    const filters = (!isAdmin && !isPro) ? `&filters[owner][id]=${auth.user.id}` : ''

    // Fetch clients :
    const { 
        data: horses, 
        setData: setHorses, 
        loading,
        error } = useFetchHorses({filters: filters});

    const [triggerNewHorseModal, setTriggerNewHorseModal] = useState(false);

    const { setRightPanel } = useContext(ThemeContext);

    const navigateToOwnerProfile = (ownerId) => {
        let collection = 'users'

        if(Number(ownerId) === Number(PRO_ID) || Number(ownerId) === Number(ADMIN_ID))
            collection = 'professionals'

        if(isAdmin || isPro) {
            navigate(`/${queryPages[collection].path}/${ownerId}`)
        }
    }

    useLayoutEffect(() => {
		setRightPanel(false);
	});

    // Chargement :
    if(loading)
        return <SkeletonScreen />

    if(horses.length < 1)
        return(
            <PageWrapper title={adminMenu.accounts.accounts.subMenu.clients.text}>
                <Page>
                <Alert
                    color='warning'
                    isLight
                    icon='Info'
                >
                    Vous n'avez aucun cheval enregistré.
                </Alert>
                </Page>
            </PageWrapper>
        )

    return (
        <PageWrapper title={adminMenu.accounts.accounts.subMenu.horses.text}>
            <Page >
                <div className='h1 font-family-playfair d-flex justify-content-center mb-5'>{isAdmin || isPro ? 'Liste des chevaux' : 'Mes chevaux'}</div>

                {isAdmin && 
                <div style={{marginRight: '0', marginLeft: 'auto'}}>
                    <Button
                        color='info'
                        className='my-3'
                        icon='Add'
                        onClick={() => setTriggerNewHorseModal(true)}
                    >
                        Ajouter
                    </Button>
                </div>}

                <div className='row row-cols-lg-2 row-cols-1 mt-5'>
                    {horses.map((user) => (
                        <div key={user.name} className='col mx-auto'>
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
													            src={user?.avatar ? `${API_URL}${user.avatar?.data?.attributes?.url}` : `${defaultHorseAvatar}`}
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
                                                            <div className='d-flex align-items-center align-items-start mb-2'>
                                                                <div className='fw-bold fs-5 me-2 font-family-playfair'>
                                                                    {user?.name}
                                                                </div>
                                                                {user?.breed && 
                                                                <small 
                                                                    className={classNames(
                                                                        `border-${user?.color || 'info'}`,
                                                                        `text-${user?.color || 'info'}`,
                                                                        'border border-2 fw-bold px-3 py-1 rounded-1 text-uppercase mx-2',                                                                        
                                                                    )}>
                                                                    {user?.breed}
                                                                </small>}
                                                            </div>

                                                            <div className='h5 text-muted opacity-75 font-family-playfair'>
                                                               {`${user.owner.data.attributes.name} ${user.owner.data.attributes.surname}`}
                                                            </div>

                                                            <div className='h6 text-muted opacity-75'>
                                                                <b>Email : </b> {user.owner.data.attributes.email}
                                                            </div>

                                                            <div className='h6 text-muted opacity-75'>
                                                                <b>Téléphone : </b> {user.owner.data.attributes.phone || <i>non-communiqué</i>}
                                                            </div>
                                                        </div>
                                                        <div className='col-auto'>
                                                            <Avatar
                                                                srcSet={user.owner?.data.attributes?.avatar?.data ? `${API_URL}${user.owner?.data?.attributes?.avatar?.data?.attributes?.url}` : `${defaultAvatar}`}
                                                                src={user.owner?.data.attributes?.avatar?.data ? `${API_URL}${user.owner?.data?.attributes?.avatar?.data?.attributes?.url}` : `${defaultAvatar}`}
                                                                userName={`${user.owner.data.attributes.name} ${user.owner.data.attributes.surname}`}
                                                                color={user.owner.data.attributes.color}
                                                                size={40}
                                                                role={isAdmin || isPro ? 'button' : ''} // role = 'button' <==> cursor: pointer
                                                                onClick={ () => {
                                                                    navigateToOwnerProfile(user?.owner?.data?.attributes?.role?.data?.id); // owner's id
                                                                }}
                                                            />
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

                <Modal
                    isOpen={triggerNewHorseModal}
                    setIsOpen={setTriggerNewHorseModal}
                    titleId='confirmationModal'
                    fullScreen
                    isScrollable
                    >
                        <ModalHeader setIsOpen={setTriggerNewHorseModal} className='p-5' >
                            <ModalTitle id='confirmationModal'>Ajouter un nouveau cheval</ModalTitle>
                        </ModalHeader>
                        <ModalBody className='px-5 text-center new-line'>
                            <CommonHorseCreation 
                                isAdmin={isAdmin}
                                setIsOpen={setTriggerNewHorseModal} 
                                setHorses={setHorses}
                            />
                        </ModalBody>
                        <ModalFooter className='px-5'>
                            <Button
                                color='light'
                                className='border-0 mx-3'
                                isOutline
                                onClick={() => setTriggerNewHorseModal(false)} >
                                Annuler
                            </Button>
                        </ModalFooter>
                </Modal>

            </Page>
        </PageWrapper>
);
}

export default HorseList