import { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
import { useFormik } from 'formik';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';

import { getUserDataWithId } from '../../../common/data/userDummyData';

// 🛠️ Hooks :
import useAuth from '../../../hooks/useAuth';
import useFetchEmployees from '../../../hooks/useFetchEmployees';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';

import ThemeContext from '../../../contexts/themeContext';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, {
    SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';

import Spinner from '../../../components/bootstrap/Spinner'
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../../components/bootstrap/Card';

import Popovers from '../../../components/bootstrap/Popovers';

import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import Select from '../../../components/bootstrap/forms/Select';
import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import showNotification from '../../../components/extras/showNotification';

import Avatar from '../../../components/Avatar';
import defaultHorseAvatar from '../../../assets/img/horse-avatars/defaultHorseAvatar.webp';
import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';

import { adminMenu, queryPages } from '../../../menu';
import Badge from '../../../components/bootstrap/Badge';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';

import EVENT_STATUS from '../../../common/data/enumEventStatus';

import axios from 'axios';

function EmployeePage() {

    const { darkModeStatus, themeStatus } = useDarkMode();

    const navigate = useNavigate();

    // Horse's ID :
    const { id } = useParams();

    // ⚙️ Strapi's API ROUTES :
    const API_URL = process.env.REACT_APP_API_URL;
    const USERS_ROUTE = process.env.REACT_APP_USERS_ROUTE;

    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    const { setRightPanel } = useContext(ThemeContext);

    // 🦸 User:
    const auth = useAuth();

    const isAdmin = auth.user && Number(auth.user.role.id) === Number(ADMIN_ID);
    const isPro = auth.user && Number(auth.user.role.id) === Number(PRO_ID);
    const isClient = auth.user && Number(auth.user.role.id) === Number(CLIENT_ID);

    // 🙎‍♀️ Fetch user by ID :
    const { 
        data: user, 
        loading: loadingUser,
        error,
        setData: setUser } = useFetchEmployees({ filters: `&filters[id]=${id}`, isUnique: true });

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

    const formikProfile = useFormik({
        initialValues: {
            id: '',
            name: '',
            surname: '',
            email: '',
            phone: '',
            role: {
                id: ''
            }
        },
        onSubmit: (values) => {
            // Delete empty fields :
            for (const key in values) {
                if (values[key] === '' || !values[key]) {
                    delete values[key];
                }
            }
            // S'il y a changement de rôle, on redirige vers la page Pro:
            const redirect = Number(user.role.id) !== Number(values.role.id) ? true : false;

            // Update user:
            handleUpdate(values);

            // Redirect:
            redirect && navigate(`/${adminMenu.accounts.accounts.subMenu.professionals.path}/${user.id}`, { replace: true });
        }
    });

    const formikAddress = useFormik({
		initialValues: {
            id: '',
			street: '',
			city: '',
			country: '',
			zipcode: '',
		},
		onSubmit: (values) => {
            // Delete empty fields :
            for (const key in values) {
                if (values[key] === '' || !values[key]) {
                  delete values[key];
                }
            }
            // Update user :
		},
	});

    const handleUpdate = async (newData) => {
        try {
            await axios.put(`${API_URL}${USERS_ROUTE}/${newData.id}?populate=*`, newData); // Update
            const res = await axios.get(`${API_URL}${USERS_ROUTE}?populate=*&filters[id]=${newData.id}`, { data: newData }); // Fetch to get all fields
            setUser(res.data[0])

            showNotification(
                'Mise à jour.', // title
                `Les informations de ${user?.username} ont été mises à jour.`, // message
                'success' // type
            );
        } catch(err) {
            console.log("UPDATE | User | L'utilisateur n'a pas pu être modifié dans la base de données. | " + err);
            showNotification(
                'Mise à jour.', // title
				"Oops ! Une erreur s'est produite. L'utilisateur n'a pas pu être modifié.", // message
                'danger' // type
			);
        }
    }

    useLayoutEffect(() => {
		setRightPanel(false);
	});

    useEffect(() => {
        if(user) {
            formikProfile.setValues({
                ...formikProfile.values,
                id: user.id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone: user.phone,
                role: {
                    id: user?.role?.id
                }
            });
            formikAddress.setValues({
                ...formikAddress.values,
                id: user?.address?.id,
                street: user?.address?.street,
                city: user?.address?.city,
                country: user?.address?.country,
                zipcode: user?.address?.zipcode,
            });
        }
        
        return () => {};
    }, [user]);
    
    // Chargement :
    if(loadingUser)
        return (
            <PageWrapper title='Chargement...'>
                <div className='position-absolute top-50 start-50 translate-middle'>
                    <Spinner size={62} color="info" />
                </div>
            </PageWrapper>
        );

    // Erreur :
    if(error)
        return (
            <PageWrapper title="Une erreur s'est produite">
                <div className='position-absolute top-50 start-50 translate-middle'>
                    <Alert icon='Report' isLight color="danger" className='new-line'>
                        {`Nous n'avons pas pu charger les données de l'utilisateur\n(${error}).`}
                    </Alert>
                </div>
            </PageWrapper>
        );

    // Si aucun utilisateur :
    if(!user)
        return <Navigate to={`/${adminMenu.accounts.accounts.subMenu.clients.path}`}/>

    return (
        <PageWrapper title={`${user.name} ${user.surname}`}>
            <Page container='fluid'>
                <div className="row d-flex justify-content-center">
                    <div className="col-xl-9">
                        <div className='pt-3 pb-5 d-flex align-items-center'>
                            <span className='display-4 fw-bold me-3 text-capitalize font-family-playfair'>{`${user.name} ${user.surname}`}</span>

                            {(isAdmin || isPro) && 
                            <Dropdown>
                                <DropdownToggle hasIcon={false}>
                                    <Button 
                                        color={user.confirmed ? 'success' : 'danger'} 
                                        isOutline
                                        size='lg' 
                                        className={classNames(
                                            `border-2 border-${user.confirmed ? 'success' : 'danger'}`,
                                            'mx-3 text-uppercase',
                                        )}
                                        disabled={!isAdmin}
                                    >
                                        {user.confirmed ? 'Confirmé' : 'En attente'}
                                    </Button>
                                </DropdownToggle>
                                <DropdownMenu>
                                <DropdownItem isHeader>Status du compte</DropdownItem>
                                    <DropdownItem 
                                        onClick={() => handleUpdate({ id: user.id, confirmed: true })}
                                    >
                                        <div>
                                            <Icon icon='Circle' color='success'/>Confirmé
                                        </div>
                                    </DropdownItem>

                                    <DropdownItem
                                        onClick={() => handleUpdate({ id: user.id, confirmed: false })}
                                    >
                                        <div>
                                            <Icon icon='Circle' color='danger'/>En attente
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>}
                        </div>
                    </div>

                    {/* EMPTY DIV FOR POSITIONING */}
                    <div className="col-xl-1"></div>
                    {/* EMPTY DIV */}
                </div>

                <div className='row d-flex justify-content-center'>
                    <div className='col-xl-3'>
                        <Card className='shadow-3d-info'>
                            <CardHeader>
                                <CardActions>
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
                                        {(isAdmin || isPro) &&
                                        <Button type='submit' color='info' isLink isOutline icon='Save' className='mx-3 my-3' disabled={!isAdmin}>
											Appliquer
										</Button>}
                                        </DropdownMenu>
                                    </Dropdown>
                                </CardActions>
                            </CardHeader>
                            <CardBody>
                                <div className='row g-5'>
                                    <div className='col-12 d-flex justify-content-center'>
                                        <Avatar
                                            src={user?.avatar ? `${API_URL}${user?.avatar?.url}` : `${defaultAvatar}`}
                                            srcSet={user?.avatar ? `${API_URL}${user?.avatar?.url}` : `${defaultAvatar}`}
                                            color={user?.color}
                                            size={200}
                                        />
                                    </div>
                                    <div className='col-12'>
                                        <div className='row g-2'>
                                            {user?.horses.length > 0 &&
                                            <div className='col-12'>
                                                <div className='d-flex align-items-start mb-2'>
                                                    <div className='flex-shrink-0 mt-4'>
                                                        <Icon icon='Horse' size='2x' color='info' />
                                                    </div>
                                                    <div className='flex-grow-1 ms-3'>
                                                        <div className='text-muted'>
                                                            Liste des chevaux
                                                        </div>
                                                        {user?.horses.map( horse => (
                                                            <Link 
                                                                to={`${queryPages.horses.path}/${horse.id}`}
                                                                className='text-decoration-none'
                                                                style={(isAdmin || isPro) ? {color: 'inherit', cursor: 'pointer'} : {color: 'inherit', pointerEvents: 'none'}}
                                                                >
                                                                <div className='fw-bold fs-5 mb-0 text-capitalize font-family-playfair link-hover'>
                                                                    {horse?.name}
                                                                </div>
                                                            </Link>
                                                        ))}
                                                        {user?.horses.length < 1 &&
                                                        <div className='fs-5 mb-0'>
                                                            <i>Aucun cheval enregistré.</i>
                                                        </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>}

                                            <div className='col-12'>
                                                <div className='d-flex align-items-end mb-2'>
                                                    <div className='flex-shrink-0'>
                                                        <Icon icon='Mail' size='2x' color='info' />
                                                    </div>
                                                    <div className='flex-grow-1 ms-3'>
                                                        <div className='text-muted'>
                                                            Adresse e-mail
                                                        </div>
                                                        <div className='fw-bold fs-5 mb-0'>
                                                            <a 
                                                                href={`mailto:${user?.email}`}
                                                                className='text-decoration-none'
                                                                style={{color: 'inherit'}}
                                                            >
                                                                {user?.email}
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='col-12'>
                                                <div className='d-flex align-items-end mb-2'>
                                                    <div className='flex-shrink-0'>
                                                        <Icon icon='PhoneIphone' size='2x' color='info' />
                                                    </div>
                                                    <div className='flex-grow-1 ms-3'>
                                                        <div className='text-muted'>
                                                            Téléphone
                                                        </div>
                                                        <div className='fw-bold fs-5 mb-0'>
                                                            {user?.phone || <i>Non-communiqué</i>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        <Card className='px-4 py-3'>
                            <CardHeader>
                                <CardLabel icon='AutoAwesome' iconColor='warning'>
                                    <CardTitle>Biographie</CardTitle>
                                </CardLabel>
                            </CardHeader>
                            <CardBody>
                                <p className='new-line'>
                                    {user?.biography || 'Cette personne est bien mystérieuse...'}
                                </p>
                            </CardBody>
                        </Card>

                    </div>

                    <div className='col-xl-7'>
                        
                        <Card hasTab>
							<CardTabItem id='profile' title='Profil' icon='Contacts'>
								<Alert isLight className='border-0' shadow='md' icon='LocalPolice'>
                                    Les informations personnelles de {user.name} {user.surname}.
								</Alert>

                                <Card
									className='rounded-2'
									tag='form'
									onSubmit={formikProfile.handleSubmit}>
									<CardHeader>
										<CardLabel icon='Person'>
											<CardTitle>Coordonnées</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-md-5'
												>
                                                <InputGroup>
                                                    <InputGroupText id='name'>Prénom</InputGroupText>
                                                    <Input
                                                        id='name'
                                                        name='name'
                                                        placeholder='Prénom'
                                                        autoComplete='given-name'
                                                        onChange={formikProfile.handleChange}
                                                        value={formikProfile.values.name}
                                                    />
                                                </InputGroup>
											</FormGroup>

                                            <FormGroup
												className='col-md-5'
												>
                                                <InputGroup>
                                                    <InputGroupText id='surname'>Nom de famille</InputGroupText>
                                                    <Input
                                                        id='surname'
                                                        placeholder='Nom de famille'
                                                        autoComplete='family-name'
                                                        onChange={formikProfile.handleChange}
                                                        value={formikProfile.values.surname}
                                                    />
                                                </InputGroup>
											</FormGroup>
									
                                            <FormGroup
												className='col-md-5'
												>
                                                <InputGroup>
                                                    <InputGroupText id='email'>Email</InputGroupText>
                                                    <Input
                                                        id='email'
                                                        type='email'
                                                        placeholder='janedoe@gmail.com'
                                                        autoComplete='email'
                                                        onChange={formikProfile.handleChange}
                                                        value={formikProfile.values.email}
                                                    />
                                                </InputGroup>
											</FormGroup>

                                            <FormGroup
												className='col-md-5'
												>
                                                <InputGroup>
                                                    <InputGroupText id='phone'>Téléphone</InputGroupText>
                                                    <Input
                                                        id='phone'
                                                        type='tel'
                                                        placeholder='+33 6 12 34 56 78'
                                                        autoComplete='tel'
                                                        mask='+99 9 99 99 99 99'
                                                        onChange={formikProfile.handleChange}
                                                        value={formikProfile.values.phone}
                                                    />
                                                </InputGroup>
											</FormGroup>

                                            <FormGroup className='col-md-5'>
                                                <InputGroup>
                                                    <InputGroupText
                                                        tag='label'
                                                        htmlFor='role.id'>
                                                        Rôle
                                                    </InputGroupText>
                                                    <Select
                                                        id='role.id'
                                                        ariaLabel='Default select example'
                                                        placeholder='Modifier le rôle...'
                                                        onChange={formikProfile.handleChange}
                                                        value={formikProfile.values.role.id}
                                                        list={[ {value: CLIENT_ID, text: 'Client' }, {value: PRO_ID, text: 'Professionnel'} ]}
                                                    />
                                                </InputGroup>
											</FormGroup>

										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											{(isAdmin || isPro) &&
                                            <Button type='submit' color='primary' icon='Save' disabled={!isAdmin}>
												Appliquer
											</Button>}
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
                                            <FormGroup className='col-6'>
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

                                            <FormGroup className='col-md-5'>
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

                                            <FormGroup className='col-md-5'>
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
											{(isAdmin || isPro) &&
                                            <Button type='submit' color='info' icon='Save' disabled={!isAdmin}>
												Appliquer
											</Button>}
										</CardFooterRight>
									</CardFooter>
								</Card>
							</CardTabItem>

                            <CardTabItem id='horses' title='Chevaux' icon='Horse'>
                                <Alert isLight className='border-0' shadow='md' icon='LocalPolice' color='info'>
									{`Vous retrouverez ici la liste des chevaux de ${user.name} ${user.surname}.`}
								</Alert>

                                <div className='row row-cols-xxl-2 row-cols-lg-1'>
                                    {user?.horses?.map((horse) => (
                                        <Link 
                                            to={`${queryPages.horses.path}/${horse.id}`}
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
                                                                                    src={horse?.avatar ? `${API_URL}${horse?.avatar?.url}` : `${defaultHorseAvatar}`}
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
                                                                                    <div className='fw-bold fs-5 me-2 font-family-playfair'>
                                                                                        {horse.name}
                                                                                    </div>

                                                                                   {horse?.breed &&
                                                                                   <small className={`border border-${horse?.color} border-2 text-${horse?.color} fw-bold px-2 py-1 rounded-1`}>
                                                                                        {horse.breed}
                                                                                    </small>
                                                                                    }
                                                                                </div>
                                                                                <div className='h6 text-muted opacity-50 mt-2'>
                                                                                    {user.name} {user.surname}
                                                                                </div>
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

                                {user?.horses.length < 1 &&
                                <Alert isLight className='border-0' shadow='md' icon='Info' color='warning'>
                                    {user.name} {user.surname} n'a aucun cheval enregistré.
                                </Alert>
                                }

							</CardTabItem>

                            {isAdmin ?
                            <CardTabItem id='password' title='Mot de passe' icon='Lock'>
                                <Card className='rounded-2'>
                                    <CardHeader>
										<CardLabel icon='Lock'>
											<CardTitle>Mot de passe</CardTitle>
										</CardLabel>
									</CardHeader>

                                    <CardBody>
                                        <Alert isLight className='border-0' shadow='md' icon='Report' color='warning'>
                                            En cours de construction.
                                        </Alert>
                                    </CardBody>
                                </Card>

                            </CardTabItem>
                            :
                            <CardTabItem></CardTabItem>
                            }

						</Card>
                    </div>
                </div>
            </Page>
        </PageWrapper>
    )
}

export default EmployeePage