import React, { useContext, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import moment from 'moment';
import classNames from 'classnames';
import { useMeasure } from 'react-use';

import ThemeContext from '../../contexts/themeContext';

// 🛠️ Hooks :
import useAuth from '../../hooks/useAuth';
import useFetchHorses from '../../hooks/useFetchHorses';

import Button from '../../components/bootstrap/Button';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Popovers from '../../components/bootstrap/Popovers';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../../components/bootstrap/forms/InputGroup';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';
import Alert from '../../components/bootstrap/Alert';
import Avatar from '../../components/Avatar';
import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';
import defaultHorseAvatar from '../../assets/img/horse-avatars/defaultHorseAvatar.webp';

import { dashboardMenu, queryPages, clientQueryPages } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';

const LandingPage = () => {
	const { darkModeStatus } = useDarkMode();

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

    // 🐎 Fetch user's horse(s) :
    const { 
        data: horses, 
        setData: setHorses } = useFetchHorses({ filters: `&filters[owner][id]=${auth.user.id}` });

    const formikProfile = useFormik({
		initialValues: {
			name: auth.user.name,
			surname: auth.user.surname,
			occupation: auth.user.occupation,
			email: auth.user.email,
			phone: auth.user.phone,
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

    const formikAddress = useFormik({
		initialValues: {
            id: auth.user.address?.id,
			street: auth.user.address?.street,
			city: auth.user.address?.city,
			country: auth.user.address?.country,
			zipcode: auth.user.address?.zipcode,
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

    useLayoutEffect(() => {
		setRightPanel(false);
	});


	return (
		<PageWrapper title={dashboardMenu.dashboard.text}>
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
                                                    color={auth.user?.color}
													className='rounded-circle'
                                                    size={200}
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

						{/* <Card>
							<CardBody>
								<div className='d-flex justify-content-between'>
									<p>Complete Your Profile</p>
									<p className='fw-bold'>90%</p>
								</div>
								<Progress value={90} />
							</CardBody>
						</Card> */}

						<Card className='px-5 py-4'>
							<CardHeader>
								<CardLabel>
									<CardTitle>À propos</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<p className='new-line'>
                                    {auth.user.biography || 'Dites-en nous plus à votre sujet.'}
                                </p>
                                <div className='col-auto pt-3'>
                                    <Dropdown>
                                        <DropdownToggle hasIcon={false}>
                                            <Button color='dark' isLink isActive icon='MoreHoriz'></Button>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem isHeader>Couleur du profil</DropdownItem>
                                        {colorList.map(
                                            (color) => (
                                                <DropdownItem key={color.value}>
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
                                        </DropdownMenu>
                                    </Dropdown>
								</div>
							</CardBody>
						</Card>
					</div>

					<div className='col-xxl-8 col-xl-6'>
						{/* <Card
							className={classNames('shadow-3d-info', 'mb-5', {
								'bg-lo10-info': darkModeStatus,
								'bg-l25-info': !darkModeStatus,
							})}>
							<Carousel
								isHoverPause
								isRide
								height={height || 305}
								isDark={darkModeStatus}>
								<CarouselSlide>
									<div className='row align-items-center h-100'>
										<div
											className='col-6 carousel-slide-bg'
											style={{ backgroundImage: `url(${WannaImg1})` }}
										/>
										<div className='col-6'>
											<h2>New Products</h2>
											<p className='lead'>New products ready for sale.</p>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												onClick={() =>
													navigate(
														`../${demoPages.sales.subMenu.productsGrid.path}`,
													)
												}>
												Click
											</Button>
										</div>
									</div>
								</CarouselSlide>
								<CarouselSlide background={WannaImg5} />
								<CarouselSlide>
									<div className='row align-items-center h-100'>
										<div className='col-6 text-end'>
											<h2>Customize</h2>
											<h5>You can design your own screens</h5>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												onClick={() =>
													navigate(
														`../${demoPages.sales.subMenu.dashboard.path}`,
													)
												}>
												Click
											</Button>
										</div>
										<div
											className='col-6 carousel-slide-bg'
											style={{ backgroundImage: `url(${WannaImg2})` }}
										/>
									</div>
								</CarouselSlide>
								<CarouselSlide background={WannaImg6} />
							</Carousel>
						</Card> */}

						{/* <Card>
							<CardHeader>
								<CardLabel icon='PhotoSizeSelectActual' iconColor='info'>
									<CardTitle>Photos and Videos</CardTitle>
								</CardLabel>
								<CardActions>
									<Button
										color='info'
										isLight
										onClick={() => setGallerySeeAll(true)}>
										See All
									</Button>
								</CardActions>
							</CardHeader>
							<CardBody>{_gallery}</CardBody>
						</Card> */}

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
								{/* <Alert
									isLight
									className='border-0'
									shadow='md'
									icon='Public'
									color='warning'>
									As soon as you save the information, it will be shown to
									everyone automatically.
								</Alert> */}
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
											{/* <FormGroup
												className='col-10'
												id='street'
												label='Rue'>
												<Input
													placeholder='Adresse de la rue'
													autoComplete='address-line1'
													onChange={formikAddress.handleChange}
													value={formikAddress.values.street}
												/>
											</FormGroup> */}


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

											{/* <FormGroup
												className='col-md-4'
												id='city'
												label='Ville'>
												<Input
													placeholder='Ville'
													autoComplete='address-level2'
													onChange={formikAddress.handleChange}
													value={formikAddress.values.city}
												/>
											</FormGroup> */}

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

											{/* <FormGroup
												className='col-md-4'
												id='country'
												label='Pays'>
												<Input
													placeholder='Pays'
													autoComplete='country-name'
													onChange={formikAddress.handleChange}
													value={formikAddress.values.country}
												/>
											</FormGroup> */}

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

											{/* <FormGroup
												className='col-md-2'
												id='zipcode'
												label='Code postal'>
												<Input
													placeholder='Code postal'
													autoComplete='postal-code'
                                                    pattern="[0-9]+"
													onChange={formikAddress.handleChange}
													value={formikAddress.values.zipcode}
												/>
											</FormGroup> */}

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
                                                                                    alt={'My horse'}
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
                                                                                    <div className='fw-bold fs-5 me-2 font-family-playfair'>
                                                                                        {horse.name}
                                                                                    </div>
                                                                                    <small className={`border border-${horse?.color} border-2 text-${horse?.color} fw-bold px-2 py-1 rounded-1`}>
                                                                                        {horse.breed || 'Un noble cheval'}
                                                                                    </small>
                                                                                </div>
                                                                                <div className='text-muted'>
                                                                                    {horse.owner.data.attributes.name} {horse.owner.data.attributes.surname}
                                                                                </div>
                                                                            </div>
                                                                            {/* <div className='col-auto'>
                                                                                <Button
                                                                                    icon='Info'
                                                                                    color='info'
                                                                                    isLight
                                                                                    hoverShadow='sm'
                                                                                    tag='a'
                                                                                    //to={`../${demoPages.appointment.subMenu.employeeID.path}/${user.id}`}
                                                                                    //to={`/chevaux/${horse.id}`}
                                                                                    to={isAdmin || isPro ? `${queryPages.horses.path}/${horse.id}` : `${clientQueryPages.horses.path}/${horse.id}`}
                                                                                    data-tour={auth.user.name}
                                                                                />
                                                                            </div> */}
                                                                        </div>
                                                                        {/* {!!user?.services && (
                                                                            <div className='row g-2 mt-3'>
                                                                                {user?.services.map((service) => (
                                                                                    <div
                                                                                        key={service.name}
                                                                                        className='col-auto'>
                                                                                        <Badge
                                                                                            isLight
                                                                                            color={service.color}
                                                                                            className='px-3 py-2'>
                                                                                            <Icon
                                                                                                icon={service.icon}
                                                                                                size='lg'
                                                                                                className='me-1'
                                                                                            />
                                                                                            {service.name}
                                                                                        </Badge>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        )} */}
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

                        <Card>
							<CardHeader>
								<CardLabel icon='ShowChart' iconColor='secondary'>
									<CardTitle>Statistiques</CardTitle>
								</CardLabel>
								<CardActions>
									Only in <strong>{moment().format('MMM')}</strong>.
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
												<div className='fw-bold fs-3 mb-0'>183K</div>
												<div className='text-muted mt-n2'>Sales</div>
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
												<div className='fw-bold fs-3 mb-0'>1247</div>
												<div className='text-muted mt-n2'>Customers</div>
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
												<Icon icon='Inventory2' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>500+</div>
												<div className='text-muted mt-n2'>Products</div>
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
												<div className='fw-bold fs-3 mb-0'>112,458</div>
												<div className='text-muted mt-n2'>Profits</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>

				{/* <Modal setIsOpen={setSelectedImage} isOpen={!!selectedImage} isCentered>
					<ModalHeader setIsOpen={setSelectedImage}>
						<ModalTitle id='preview'>Preview</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<img src={selectedImage} alt='eneme' />
					</ModalBody>
				</Modal> */}

				{/* <Modal
					setIsOpen={setGallerySeeAll}
					isOpen={gallerySeeAll}
					fullScreen
					titleId='gallery-full'>
					<ModalHeader setIsOpen={setGallerySeeAll}>
						<ModalTitle id='gallery-full'>Gallery</ModalTitle>
					</ModalHeader>
					<ModalBody>{_gallery}</ModalBody>
				</Modal> */}
			</Page>
		</PageWrapper>
	);
};

export default LandingPage;
