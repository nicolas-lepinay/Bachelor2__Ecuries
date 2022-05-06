import React from 'react';
import { useFormik } from 'formik';
import moment from 'moment';
import classNames from 'classnames';
import { useMeasure } from 'react-use';

// 🛠️ useAuth hook :
import useAuth from '../../hooks/useAuth';

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
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import showNotification from '../../components/extras/showNotification';
import Icon from '../../components/icon/Icon';
import Alert from '../../components/bootstrap/Alert';
import Avatar from '../../components/Avatar';
import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';

import { dashboardMenu } from '../../menu';
import useDarkMode from '../../hooks/useDarkMode';

const LandingPage = () => {
	const { darkModeStatus } = useDarkMode();

    // ⚙️ Strapi's API URL :
    const API_URL = process.env.REACT_APP_API_URL;

    // 🦸 User:
    const auth = useAuth();
    console.log(auth.user)

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

            // Success or error message :
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>{auth.error ? auth.error.message : 'Vos informations ont été mises à jour.' }</span>
				</span>
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
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>{auth.error ? auth.error.message : 'Votre adresse a été mise à jour.' }</span>
				</span>
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
                    <span className='d-flex align-items-center'>
                        <Icon icon='Info' size='lg' className='me-1' />
                        <span>Le mot de passe actuel est incorrect.</span>
                    </span>
                );
            } else {
                if(values.newPassword !== values.confirmNewPassword) {
                    showNotification(
                        <span className='d-flex align-items-center'>
                            <Icon icon='Info' size='lg' className='me-1' />
                            <span>Les mots de passe ne correspondent pas.</span>
                        </span>
                    );
                } else {
                    auth.update({ password: values.newPassword })
                    showNotification(
                        <span className='d-flex align-items-center'>
                            <Icon icon='Info' size='lg' className='me-1' />
                            <span>Votre mot de passe a été mis à jour.</span>
                        </span>
                    );
                }
            }
		},
	});

    const [ref, { height }] = useMeasure();

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
													srcSet={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
													src={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                                                    color={auth.user?.color}
													className='rounded-circle'
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='h2 fw-bold'>
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
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon icon='Mail' size='3x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{auth.user.email ||
																'Nope'}
														</div>
														<div className='text-muted'>
															Adresse e-mail
														</div>
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='PhoneIphone'
															size='3x'
															color='info'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{auth.user.phone || '01 23 45 67 89'}
														</div>
														<div className='text-muted'>Téléphone</div>
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

						<Card>
							<CardHeader>
								<CardLabel>
									<CardTitle>À propos</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<p>
                                    Auprès des chevaux depuis sa naissance, Karine a grandi dans les troupeaux 
                                    de poneys et chevaux de l’élevage familial. En selle depuis ses 3 ans, Karine 
                                    a reçu une formation complète auprès de nombreux cavaliers de haut niveau : 
                                    Pascale Massot-Dandoy, Philippe Limousin, Alain Franckville, Serge Balbin, 
                                    Patrick Le Rolland, Wilfried Pierrot. 
								</p>
                                <p>
                                    Elle évoluera en compétition de dressage jusqu’à intégrer l’équipe de France 
                                    de dressage espoir de l’âge de 14 à 18 ans.
                                </p>
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
											<FormGroup
												className='col-10'
												id='street'
												label='Rue'>
												<Input
													placeholder='Adresse de la rue'
													autoComplete='address-line1'
													onChange={formikAddress.handleChange}
													value={formikAddress.values.street}
												/>
											</FormGroup>

											<FormGroup
												className='col-md-4'
												id='city'
												label='Ville'>
												<Input
													placeholder='Ville'
													autoComplete='address-level2'
													onChange={formikAddress.handleChange}
													value={formikAddress.values.city}
												/>
											</FormGroup>
											<FormGroup
												className='col-md-4'
												id='country'
												label='Pays'>
												<Input
													placeholder='Pays'
													autoComplete='country-name'
													onChange={formikAddress.handleChange}
													value={formikAddress.values.country}
												/>
											</FormGroup>

											<FormGroup
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
							<CardTabItem id='profile2' title='Mot de passe' icon='Lock'>
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
