import { useState, useContext, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import moment from 'moment';
import classNames from 'classnames';
import { useMeasure } from 'react-use';

import ThemeContext from '../contexts/themeContext';

// 🛠️ Hooks :
import useAuth from '../hooks/useAuth';
import useFetchHorses from '../hooks/useFetchHorses';
import useDarkMode from '../hooks/useDarkMode';

import Button from '../components/bootstrap/Button';
import Page from '../layout/Page/Page';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../components/bootstrap/Dropdown';

import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle } from '../components/bootstrap/Modal'

import Popovers from '../components/bootstrap/Popovers';
import FormGroup from '../components/bootstrap/forms/FormGroup';
import Input from '../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../components/bootstrap/forms/InputGroup';
import Textarea from '../components/bootstrap/forms/Textarea';
import Icon from '../components/icon/Icon';
import Alert from '../components/bootstrap/Alert';
import showNotification from '../components/extras/showNotification';
import Avatar from '../components/Avatar';
import CommonHorseCreation from './common/CommonHorseCreation';
import CommonAvatarCreation from './common/CommonAvatarCreation';
import defaultAvatar from '../assets/img/wanna/defaultAvatar.webp';
import defaultHorseAvatar from '../assets/img/horse-avatars/defaultHorseAvatar.webp';
import { profilePage, queryPages, clientQueryPages, loginPage } from '../menu';

const ProfilePage = () => {

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

    const colorList = [
        { value: 'info', description: 'Bleu'},
        { value: 'primary', description: 'Violet'},
        { value: 'secondary', description: 'Rose'},
        { value: 'success', description: 'Vert'},
        { value: 'warning', description: 'Jaune'},
        { value: 'danger', description: 'Rouge'},
        { value: 'light', description: 'Blanc'},
        { value: 'dark', description: 'Noir'},
    ];

    const [triggerNewHorseModal, setTriggerNewHorseModal] = useState(false);
    const [triggerNewAvatarModal, setTriggerNewAvatarModal] = useState(false);

    // 🐎 Fetch user's horse(s) :
    const { 
        data: horses, 
        setData: setHorses } = useFetchHorses({ filters: `&filters[owner][id]=${auth.user.id}` });

    const formikProfile = useFormik({
		initialValues: {
			name: auth.user.name,
			surname: auth.user.surname,
			occupation: auth.user?.occupation,
			email: auth.user.email,
			phone: auth.user?.phone,
            biography: auth.user?.biography,
		},
		onSubmit: (values) => {
            // Delete empty fields :
            for (const key in values) {
                if (values[key] === '' || !values[key]) {
                  delete values[key];
                }
            }
            // Update user :
            auth.updateUser(values);

            showNotification(
                'Mise à jour.', // title
				auth.error ? auth.error.message : 'Vos informations ont été mises à jour.', // message
                auth.error ? 'danger' : 'success' // type
			);
		},
	});

    const formikColor = useFormik({
		initialValues: {
            color: auth.user?.color,
		},
		onSubmit: (values) => {
            // Update user :
            auth.updateUser(values);

            // Success or error message :
            showNotification(
                'Mise à jour.', // title
				auth.error ? auth.error.message : 'La couleur du profil a été mise à jour.', // message
                auth.error ? 'danger' : 'success' // type
			);
		},
	});

    const formikAddress = useFormik({
		initialValues: {
            id: auth.user?.address?.id,
			street: auth.user?.address?.street,
			city: auth.user?.address?.city,
			country: auth.user?.address?.country,
			zipcode: auth.user?.address?.zipcode,
		},
		onSubmit: (values) => {
            // Delete empty fields :
            for (const key in values) {
                if (values[key] === '' || !values[key]) {
                  delete values[key];
                }
            }
            // Update user :
            auth.updateUser({ address: { ...values} });

            // Success or error message :
            showNotification(
                'Mise à jour.', // title
				auth.error ? auth.error.message : 'Votre adresse a été mise à jour.', // message
                auth.error ? 'danger' : 'success' // type
			);
		},
	});

    const formikPassword = useFormik({
		initialValues: {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		},
		onSubmit: (values) => {
            for (const key in values) {
                if (values[key] === '') {
                  values = null;
                  return
                }
            }
            // Check if current password is correct :
            auth.login({ 
                identifier: auth.user.email, 
                password: values.currentPassword 
            })
            if(auth.error) {
                showNotification(
                    'Mise à jour.', // title
                    'Le mot de passe actuel est incorrect.', // message
                    'danger' // type
                );
            } else {
                if(values.newPassword !== values.confirmNewPassword) {
                    showNotification(
                        'Mise à jour.', // title
                        'Les mots de passe ne correspondent pas.', // message
                        'danger' // type
                    );
                } else {
                    auth.update({ password: values.newPassword })
                    showNotification(
                        'Mise à jour.', // title
                        'Votre mot de passe a été mis à jour.', // message
                        'success' // type
                    );
                }
            }
		},
	});

    const [ref, { height }] = useMeasure();

    const { setRightPanel } = useContext(ThemeContext);

    const { darkModeStatus } = useDarkMode();

    useLayoutEffect(() => {
		setRightPanel(false);
	});

	return (
		<PageWrapper title={profilePage.profile.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-xxl-4 col-xl-6'>
						<Card ref={ref} className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5'>
									<div className='col-12'>
										<div className='d-flex align-items-center'>
											<div className='flex-shrink-0'>
												<Avatar
													srcSet={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.url}` : `${defaultAvatar}`}
													src={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.url}` : `${defaultAvatar}`}
                                                    color={formikColor.values.color}
													className='rounded-circle transition-base bg-l25-info-hover'
                                                    size={200}
                                                    role='button'
                                                    title='Modifier son avatar'
                                                    onClick={setTriggerNewAvatarModal}
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='h2 fw-bold text-capitalize font-family-playfair'>
													{auth.user.name || 'Prénom'}
                                                    {' '}
													{auth.user.surname || 'Nom'}
												</div>
												<div className='h5 text-muted'>{auth.user.occupation}</div>
											</div>
										</div>
									</div>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-end mb-2'>
													<div className='flex-shrink-0'>
														<Icon icon='Mail' size='3x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='text-muted'>Adresse e-mail</div>
														<div className='fw-bold fs-5 mb-0'>
															{auth.user.email ||'Non-renseigné'}
														</div>
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-end mb-2'>
													<div className='flex-shrink-0'>
														<Icon
															icon='PhoneIphone'
															size='3x'
															color='info'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='text-muted'>Téléphone</div>
														<div className='fw-bold fs-5 mb-0'>
															{auth.user.phone || 'Non-renseigné'}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>

						<Card className='px-5 py-4'>
                            <CardHeader>
                                    <CardLabel icon='AutoAwesome' iconColor='warning'>
                                        <CardTitle>Biographie</CardTitle>
                                    </CardLabel>
                                </CardHeader>
							<CardBody>
								<p className='new-line'>
                                    {auth.user.biography || 'Dites-en nous plus à votre sujet.'}
                                </p>
                                <div className='col-auto pt-3'>
                                    <FormGroup id='color'>
                                        <Dropdown>
                                            <DropdownToggle hasIcon={false}>
                                                <Button color='dark' isLink isActive icon='MoreHoriz'></Button>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem isHeader>Couleur du profil</DropdownItem>
                                                {colorList.map(
                                                    (color) => (
                                                        <DropdownItem 
                                                            key={color.value} 
                                                            onClick={() => formikColor.setFieldValue('color', color.value)}
                                                        >
                                                            <div>
                                                                <Icon
                                                                    icon='Circle'
                                                                    color={color.value}
                                                                />
                                                                {color.description}
                                                            </div>
                                                        </DropdownItem>
                                                    )
                                                )}
                                                <Button 
                                                    onClick={formikColor.handleSubmit} 
                                                    color='info' 
                                                    isLink isOutline 
                                                    icon='Save' 
                                                    className='mx-3 my-3'
                                                >
                                                    Appliquer
                                                </Button>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </FormGroup>
								</div>
							</CardBody>
						</Card>
					</div>

					<div className='col-xxl-8 col-xl-6'>
						<Card hasTab>
							<CardTabItem id='profile' title='Profil' icon='Contacts'>
								<Alert isLight className='border-0' shadow='md' icon='LocalPolice'>
									Vos informations personnelles.
								</Alert>

								<Card
									className='rounded-2'
									tag='form'
									onSubmit={formikProfile.handleSubmit}>
									<CardHeader>
										<CardLabel icon='Person'>
											<CardTitle>Mes informations</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-md-3'
												id='name'
												label='Prénom'>
												<Input
													placeholder='Prénom'
													autoComplete='given-name'
													onChange={formikProfile.handleChange}
													value={formikProfile.values.name}
												/>
											</FormGroup>

											<FormGroup
												className='col-md-3'
												id='surname'
												label='Nom de famille'>
												<Input
													placeholder='Nom de famille'
													autoComplete='family-name'
													onChange={formikProfile.handleChange}
													value={formikProfile.values.surname}
												/>
											</FormGroup>

                                            <FormGroup
												className='col-md-2'
												id='role'
												label='Rôle'>
												<Input
													placeholder='Rôle'
													value={auth.user.role.name}
                                                    disabled
												/>
											</FormGroup>

                                            <FormGroup
												className='col-md-4'
												id='occupation'
												label='Profession'>
												<Input
													placeholder='Profession'
													onChange={formikProfile.handleChange}
													value={formikProfile.values.occupation}
												/>
											</FormGroup>

											<FormGroup
												className='col-lg-6'
												id='email'
												label='Adresse e-mail'>
												<Input
													type='email'
													placeholder='john@domain.com'
													autoComplete='email'
													onChange={formikProfile.handleChange}
													value={formikProfile.values.email}
												/>
											</FormGroup>
											<FormGroup
												className='col-lg-6'
												id='phone'
												label='Téléphone'>
												<Input
													type='tel'
													placeholder='+33 6 12 34 56 78'
													autoComplete='tel'
													mask='+99 9 99 99 99 99'
													onChange={formikProfile.handleChange}
													value={formikProfile.values.phone}
												/>
											</FormGroup>

                                            <FormGroup
												className='col-12'
												id='biography'
												label='Biographie'>
												<Textarea
													placeholder='Dites-en nous plus à votre sujet...'
                                                    style={{minHeight: '120px'}}
                                                    onChange={formikProfile.handleChange}
													value={formikProfile.values.biography}
												/>
											</FormGroup>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button type='submit' color='primary' icon='Save'>
												Appliquer
											</Button>
										</CardFooterRight>
									</CardFooter>
								</Card>
							</CardTabItem>

							<CardTabItem id='address' title='Adresse' icon='HolidayVillage'>
								<Card
									className='rounded-2'
									tag='form'
									onSubmit={formikAddress.handleSubmit}>
									<CardHeader>
										<CardLabel icon='HolidayVillage'>
											<CardTitle>Mon adresse</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
                                            <FormGroup className='col-10'>
                                                <InputGroup>
                                                    <InputGroupText id='street'>Rue</InputGroupText>
                                                    <Input
                                                        id='street'
                                                        placeholder='Adresse de la rue'
                                                        onChange={formikAddress.handleChange}
                                                        value={formikAddress.values.street}
                                                    />
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup className='col-md-3'>
                                                <InputGroup>
                                                    <InputGroupText id='zipcode'>Code postal</InputGroupText>
                                                    <Input
                                                        id='zipcode'
                                                        placeholder='Code postal'
                                                        pattern="[0-9]+"
                                                        onChange={formikAddress.handleChange}
                                                        value={formikAddress.values.zipcode}
                                                    />
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup className='col-md-4'>
                                                <InputGroup>
                                                    <InputGroupText id='city'>Ville</InputGroupText>
                                                    <Input
                                                        id='city'
                                                        placeholder='Ville'
                                                        onChange={formikAddress.handleChange}
                                                        value={formikAddress.values.city}
                                                    />
                                                </InputGroup>
                                            </FormGroup>

                                            <FormGroup className='col-md-3'>
                                                <InputGroup>
                                                    <InputGroupText id='country'>Pays</InputGroupText>
                                                    <Input
                                                        id='country'
                                                        placeholder='Pays'
                                                        onChange={formikAddress.handleChange}
                                                        value={(formikAddress.values.country)}
                                                    />
                                                </InputGroup>
                                            </FormGroup>

										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button type='submit' color='info' icon='Save'>
												Appliquer
											</Button>
										</CardFooterRight>
									</CardFooter>
								</Card>
							</CardTabItem>

                            <CardTabItem id='horses' title='Chevaux' icon='Horse'>
                                <Alert isLight className='border-0' shadow='md' icon='LocalPolice' color='info'>
									Vous retrouverez ici la liste de vos chevaux.
								</Alert>

                                <Button
                                    color='info'
                                    className='my-4'
                                    icon='Add'
                                    onClick={() => setTriggerNewHorseModal(true)}
                                >
                                    Ajouter
                                </Button>

                                <div className='row row-cols-xxl-2 row-cols-lg-1'>
                                    {horses.map((horse) => (
                                        <Link 
                                            to={isAdmin || isPro ? `${queryPages.horses.path}/${horse.id}` : `${clientQueryPages.horses.path}/${horse.id}`}
                                            style={{textDecoration: 'none', color: 'inherit'}}>
                                            <div key={horse.name} className='col'>
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
                                                                                    `bg-l25-${horse.color}`,
                                                                                    'rounded-2',
                                                                                    'd-flex align-items-center justify-content-center',
                                                                                    'overflow-hidden',
                                                                                    'shadow',
                                                                                )}>
                                                                                <img
                                                                                    src={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.url}` : `${defaultHorseAvatar}`}
                                                                                    alt={'.🐴.'}
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
                                                                                <div className='d-flex align-items-center'>
                                                                                    <div className='fw-bold fs-5 me-3 font-family-playfair'>
                                                                                        {horse.name}
                                                                                    </div>
                                                                                    {horse?.breed &&
                                                                                    <small className={`border border-${horse?.color} border-2 text-${horse?.color} fw-bold px-2 py-1 rounded-1`}>
                                                                                        {horse?.breed}
                                                                                    </small>}
                                                                                </div>

                                                                                {horse?.sex &&
                                                                                <div className='d-flex align-items-center mt-3'>
                                                                                    <Icon icon={horse.sex === 'male' ? 'Male' : 'Female'} size='lg' color={darkModeStatus ? 'light' : 'dark'} className='opacity-25 mr-2 mb-1' />
                                                                                    <div className='h6 text-muted opacity-50'>
                                                                                        {horse.sex === 'male' ? 'Mâle' : 'Femelle'}
                                                                                    </div>
                                                                                </div>
                                                                                }

                                                                                {horse?.age != null &&
                                                                                <div className='d-flex align-items-center mt-2'>
                                                                                    <Icon icon='Today' size='lg' color={darkModeStatus ? 'light' : 'dark'} className='opacity-25 mr-2 mb-1' />
                                                                                    <div className='h6 text-muted opacity-50'>
                                                                                        {horse.age === 0 ? "Moins d'un an" : `${horse.age} ans`}
                                                                                    </div>
                                                                                </div>
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {horses && horses.length < 1 &&
                                <Alert isLight className='border-0' shadow='md' icon='Info' color='warning'>
                                    Vous n'avez aucun cheval enregistré.
                                </Alert>
                                }
							</CardTabItem>

                            <CardTabItem id='invoices' title='Factures' icon='StickyNote2'>
								<Card
									className='rounded-2'
									tag='form'
									//</CardTabItem>onSubmit={formikPassword.handleSubmit}
                                >
									<CardHeader>
										<CardLabel icon='StickyNote2'>
											<CardTitle>Mes factures</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
                                        <Alert isLight className='border-0' shadow='md' icon='LocalPolice' color='info'>
                                            Vous retrouverez ici la liste de vos factures.
                                        </Alert>

                                        <Alert isLight className='border-0' shadow='md' icon='Info' color='warning'>
                                            Vous n'avez aucune facture enregistrée.
                                        </Alert>
									</CardBody>
								</Card>
							</CardTabItem>

							<CardTabItem id='password' title='Mot de passe' icon='Lock'>
								<Card
									className='rounded-2'
									tag='form'
									onSubmit={formikPassword.handleSubmit}>
									<CardHeader>
										<CardLabel icon='Lock'>
											<CardTitle>Mon mot de passe</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-lg-4'
												id='currentPassword'
												label='Mot de passe actuel'>
												<Input
													type='password'
													placeholder='Mot de passe actuel'
													autoComplete='current-password'
													onChange={formikPassword.handleChange}
													value={formikPassword.values.formCurrentPassword}
												/>
											</FormGroup>
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-4'
												id='newPassword'
												label='Nouveau mot de passe'>
												<Input
													type='password'
													placeholder='Nouveau mot de passe'
													autoComplete='new-password'
													onChange={formikPassword.handleChange}
													value={formikPassword.values.formNewPassword}
												/>
											</FormGroup>
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-4'
												id='confirmNewPassword'
												label='Confirmer le mot de passe'>
												<Input
													type='password'
													placeholder='Confirmer le mot de passe'
													autoComplete='new-password'
													onChange={formikPassword.handleChange}
													value={formikPassword.values.formConfirmNewPassword}
												/>
											</FormGroup>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button 
                                                type='submit' 
                                                color='info' 
                                                icon='Save' 
                                                disabled={formikPassword.values.currentPassword === '' || formikPassword.values.newPassword === '' || formikPassword.values.confirmNewPassword === ''}
                                                >
												Sauvegarder
											</Button>
										</CardFooterRight>
									</CardFooter>
								</Card>
							</CardTabItem>
						</Card>


                        {isAdmin && 
                        <Card>
							<CardHeader>
								<CardLabel icon='ShowChart' iconColor='secondary'>
									<CardTitle>Statistiques</CardTitle>
								</CardLabel>
								<CardActions>
									Au mois de <strong>{moment().format('MMMM')}</strong>
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 align-items-center'>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-warning': !darkModeStatus,
													'bg-lo25-warning': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon
													icon='MonetizationOn'
													size='3x'
													color='warning'
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>23K</div>
												<div className='text-muted mt-n2'>de chiffre d'affaire</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-info': !darkModeStatus,
													'bg-lo25-info': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon icon='Person' size='3x' color='info' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>12</div>
												<div className='text-muted mt-n2'>partenaires professionnels</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-primary': !darkModeStatus,
													'bg-lo25-primary': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon icon='Horse' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>25</div>
												<div className='text-muted mt-n2'>pensionnaires</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-success': !darkModeStatus,
													'bg-lo25-success': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon icon='Money' size='3x' color='success' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>12K</div>
												<div className='text-muted mt-n2'>de bénéfices</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>}
					</div>
				</div>

                <Modal
                    isOpen={triggerNewHorseModal}
                    setIsOpen={setTriggerNewHorseModal}
                    titleId='new-horse-modal'
                    fullScreen
                    isScrollable
                    >
                        <ModalHeader setIsOpen={setTriggerNewHorseModal} className='p-5' >
                            <ModalTitle id='new-horse-modal'>Ajouter un nouveau cheval</ModalTitle>
                        </ModalHeader>
                        <ModalBody className='px-5 text-center new-line'>
                            <CommonHorseCreation 
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

                <Modal
                    isOpen={triggerNewAvatarModal}
                    setIsOpen={setTriggerNewAvatarModal}
                    titleId='new-avatar-modal'
                    fullScreen
                    isScrollable
                >
                    <ModalHeader setIsOpen={setTriggerNewAvatarModal} className='p-5' >
                        <ModalTitle id='new-avatar-modal'>Créer son avatar</ModalTitle>
                    </ModalHeader>
                    <ModalBody className='px-5 text-center new-line'>
                        <CommonAvatarCreation 
                            setIsOpen={setTriggerNewAvatarModal} 
                        />
                    </ModalBody>
                    {/* <ModalFooter className='px-5'>
                        <Button
                            color='light'
                            className='border-0 mx-3'
                            isOutline
                            onClick={() => setTriggerNewAvatarModal(false)} >
                            Annuler
                        </Button>
                    </ModalFooter> */}
                </Modal>

			</Page>
		</PageWrapper>
	);
};

export default ProfilePage;
