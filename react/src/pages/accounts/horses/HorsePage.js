import { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import classNames from 'classnames';
import moment from 'moment';
import 'moment/locale/fr';

// 🛠️ Hooks :
import useAuth from '../../../hooks/useAuth';
import useFetchHorses from '../../../hooks/useFetchHorses';
import useFetchEmployees from '../../../hooks/useFetchEmployees';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';

import ThemeContext from '../../../contexts/themeContext';

import Spinner from '../../../components/bootstrap/Spinner';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';

import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';

import Alert from '../../../components/bootstrap/Alert';
import Button from '../../../components/bootstrap/Button';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import Popovers from '../../../components/bootstrap/Popovers';
import Option from '../../../components/bootstrap/Option';

import OffCanvas, {
    OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle } from '../../../components/bootstrap/OffCanvas';

import Avatar from '../../../components/Avatar';
import defaultHorseAvatar from '../../../assets/img/horse-avatars/defaultHorseAvatar.webp';
import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';

import Icon from '../../../components/icon/Icon';
import { queryPages } from '../../../menu';

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';
import showNotification from '../../../components/extras/showNotification';

import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle } from '../../../components/bootstrap/Modal'

import { getUserDataWithId } from '../../../common/data/userDummyData';

// 🅰️ Axios :
import axios from 'axios';

function HorsePage() {

    const data = getUserDataWithId(2);

    const { darkModeStatus, themeStatus } = useDarkMode();

    // 🐴 Horse's ID :
    const { id } = useParams();

    // ⚙️ Strapi's API URL :
    const API_URL = process.env.REACT_APP_API_URL;
    const HORSES_ROUTE = process.env.REACT_APP_HORSES_ROUTE;

    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    // 🦸 User:
    const auth = useAuth();

    const isAdmin = auth.user && Number(auth.user.role.id) === Number(ADMIN_ID);
    const isPro = auth.user && Number(auth.user.role.id) === Number(PRO_ID);
    const isClient = auth.user && Number(auth.user.role.id) === Number(CLIENT_ID);

    const { setRightPanel } = useContext(ThemeContext);

    // 🌈 Liste des couleurs :
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

    // 🐴 Fetch horse by ID :
    const { 
        data: horse, 
        loading: loadingHorse,
        error,
        setData: setHorse } = useFetchHorses({ filters: `&filters[id]=${id}`, isUnique: true });

    // 👩‍🚀👨‍🚀 Fetch list of employees :
    const { data: employees } = useFetchEmployees();

    // 📆 Sort health_record and appointments tables by date :
    const { items: health_items, requestSort, getClassNamesFor } = useSortableData(horse.health_record ? horse.health_record : []);
    const { items: appointment_items, requestSort: requestSortAppointment, getClassNamesFor: getClassNamesForAppointment } = useSortableData(horse?.appointments?.data ? horse?.appointments?.data : []);

    // 📑 Pagination :
    const [healthPerPage, setHealthPerPage] = useState(PER_COUNT['3']);
    const [healthCurrentPage, setHealthCurrentPage] = useState(1);

    const [appointmentPerPage, setAppointmentPerPage] = useState(PER_COUNT['3']);
    const [appointmentCurrentPage, setAppointmentCurrentPage] = useState(1);

    // Open Health Record OffCanvas details :
    const [toggleHealthInfoCanvas, setToggleHealthInfoCanvas] = useState(false);
	const setInfoRecord = () => setToggleHealthInfoCanvas(!toggleHealthInfoCanvas);

    // Set item to be displayed in OffCanvas :
	const [eventItem, setEventItem] = useState(null);

    // Open '🗑️ Delete' modal :
    const [triggerModal, setTriggerModal] = useState(false);

    // Is user a record's author ? :
    const [isHealthRecordAuthor, setIsHealthRecordAuthor] = useState(false);

    // 📝 Formik for Health Record :
    const formikHealth = useFormik({
        initialValues: {
            id: '',
            message: '',
            field: '',
            date: '',
            color: '',
            employee: {
                id: '',
            },
        },
        onSubmit: (values, { resetForm }) => {
            // Return if no message :
            if(!values?.message || values?.message === '')
                return

            // Replace other necessary empty fields:
            if(!values?.color)
                values.color = 'success';

            if(!values?.date)
                values.date = moment().format(moment.HTML5_FMT.DATE);

            if(!values?.employee?.id)
                values.employee = {
                    id: auth.user.id
                };
            
            eventItem ? handleUpdate(values) : handlePost(values);

            setToggleHealthInfoCanvas(false);
			setEventItem(null);
            resetForm({ values: ''});
        }
    });

    const handleUpdate = async (newData) => {
        const updatedHealthRecord = horse.health_record.map( item => {
            if(item.id == newData.id)
                return newData
            return {
                id: item.id,
            };
        })
        const dataToSend = {
            health_record: updatedHealthRecord,
        }
        try {
            const res = await axios.put(`${API_URL}${HORSES_ROUTE}/${horse?.id}?populate=owner&populate=avatar&populate=health_record.employee.avatar&populate=appointments&populate=activities`, { data: dataToSend });
            const resData = res.data.data;
            setHorse({id: resData.id, ...resData.attributes}); // Update horse
            showNotification(
                'Mise à jour', // title
				`Le carnet de santé de ${horse?.name} a été modifié.`, // message
                'success' // type
			);
        } catch(err) {
            console.log(`UPDATE | Health Record | Le carnet de santé du cheval “${horse?.name}” n'a pas pu être modifié dans la base de données. | ` + err);
            showNotification(
                'Mise à jour.', // title
				"Oops ! Une erreur s'est produite. Le carnet de santé n'a pas pu être modifié.", // message
                'danger' // type
			);
        }
    }

    const handlePost = async (newData) => {
        let updatedHealthRecord = [newData];

        horse.health_record.map( item => {
            updatedHealthRecord.push({ id: item.id })
        })
        const dataToSend = {
            health_record: updatedHealthRecord,
        }
        try {
            const res = await axios.put(`${API_URL}${HORSES_ROUTE}/${horse?.id}?populate=owner&populate=avatar&populate=health_record.employee.avatar&populate=appointments&populate=activities`, { data: dataToSend });
            const resData = res.data.data;
            setHorse({id: resData.id, ...resData.attributes}); // Update horse
            showNotification(
                'Mise à jour', // title
				`Une nouvelle entrée a été ajoutée au carnet de santé de ${horse?.name}.`, // message
                'success' // type
			);
        } catch(err) {
            console.log(`UPDATE | Health Record | Le carnet de santé du cheval “${horse?.name}” n'a pas pu être modifié dans la base de données. | ` + err);
            showNotification(
                'Mise à jour.', // title
				"Oops ! Une erreur s'est produite. Le carnet de santé n'a pas pu être modifié.", // message
                'danger' // type
			);
        }
    }

    useLayoutEffect(() => {
		setRightPanel(false);
	});

    useEffect(() => {
        if(!toggleHealthInfoCanvas) {
            formikHealth.setValues({});
            setEventItem(null);
            setIsHealthRecordAuthor(false);
        }

        if(horse && eventItem) {
            formikHealth.setValues({
                ...formikHealth.values,
                id: eventItem?.id,
                message: eventItem?.message,
                field: eventItem?.field,
                date: eventItem?.date,
                color: eventItem?.color,
                employee: {
                    id: eventItem?.employee?.data?.id
                }
            });
            setIsHealthRecordAuthor(Number(auth.user.id) === Number(eventItem?.employee?.data?.id))
        }
        return () => {};
    }, [horse, eventItem, toggleHealthInfoCanvas]);

    
    // Chargement :
    if(loadingHorse)
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
                        {`Nous n'avons pas pu charger les données du cheval\n(${error}).`}
                    </Alert>
                </div>
            </PageWrapper>
        );

    // Accès interdit :
    if(horse.owner && isClient && Number(horse.owner.data.id) !== Number(auth.user.id))
        return <Navigate to="/"/>

	return (
		<PageWrapper title={horse.name}>
			<Page container='fluid'>

				<div className="row d-flex justify-content-center">

                    <div className="col-xl-9">
                        <div className='pt-3 pb-5 d-flex align-items-center'>
                            <span className='display-4 fw-bold me-3 text-capitalize font-family-playfair'>{horse.name}</span>
                            <span className={`border border-${horse.color} border-2 text-${horse.color} fw-bold px-3 py-2 mx-3 rounded`}>
                                {horse.breed || 'Un noble cheval'}
                            </span>
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
                                        </DropdownMenu>
                                    </Dropdown>
                                </CardActions>
                            </CardHeader>
							<CardBody>
								<div className='row g-5'>
									<div className='col-12 d-flex justify-content-center'>
										<Avatar
                                            src={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.url}` : `${defaultHorseAvatar}`}
                                            srcSet={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.url}` : `${defaultHorseAvatar}`}
											color={horse?.color}
                                            size={160}
										/>
									</div>

									<div className='col-12'>
										<div className='row g-2'>
                                            {horse?.breed &&
                                            <div className='col-12'>
                                                <div className='d-flex align-items-end mb-2'>
                                                    <div className='flex-shrink-0'>
                                                        <Icon icon='HorseVariant' size='2x' color='info' />
                                                    </div>
                                                    <div className='flex-grow-1 ms-3'>
                                                        <div className='text-muted'>
                                                            Race
                                                        </div>
                                                        <div className='fs-5 mb-0 text-capitalize'>
                                                            {horse.breed}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>}

                                            {horse?.sex &&
                                            <div className='col-12'>
												<div className='d-flex align-items-end mb-2'>
													<div className='flex-shrink-0'>
														<Icon icon={horse.sex === 'male' ? 'Male' : 'Female'} size='2x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='text-muted'>
															Sexe
														</div>
														<div className='fs-5 mb-0 text-capitalize'>
                                                            {horse.sex === 'male' ? 'Mâle' : 'Femelle'}
														</div>
													</div>
												</div>
											</div>}

                                            {horse?.age != null &&
                                            <div className='col-12'>
												<div className='d-flex align-items-end mb-2'>
													<div className='flex-shrink-0'>
														<Icon icon='Today' size='2x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='text-muted'>
															Âge
														</div>
														<div className='fs-5 mb-0'>
                                                            {horse.age === 0 ? "Moins d'un an" : `${horse.age} ans`}
														</div>
													</div>
												</div>
											</div>}

                                            <div className='col-12'>
												<div className='d-flex align-items-end mb-2'>
													<div className='flex-shrink-0'>
														<Icon icon='PersonHeart' size='2x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='text-muted'>
															Propriétaire
														</div>

                                                        <Link 
                                                            to={`/${queryPages.users.path}/${horse?.owner?.data?.id}`}
                                                            className='text-decoration-none' 
                                                            style={(isAdmin || isPro) ? {color: 'inherit', cursor: 'pointer'} : {color: 'inherit', pointerEvents: 'none'}}
                                                        >
                                                            <div className='fw-bold fs-5 mb-0 text-capitalize font-family-playfair link-hover'>
                                                                {horse?.owner?.data?.attributes.name} {horse?.owner?.data?.attributes.surname}
                                                            </div>
                                                        </Link>
													</div>
												</div>
											</div>

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
                                                                href={`mailto:${horse.owner.data.attributes.email}`}
                                                                className='text-decoration-none'
                                                                style={{color: 'inherit'}}
                                                            >
                                                                {horse.owner.data.attributes.email}
                                                            </a>
														</div>
													</div>
												</div>
											</div>

										</div>
									</div>
								</div>
							</CardBody>
						</Card>

                        {horse?.image?.data &&
                        <Card>
							<CardHeader>
								<CardLabel icon='AutoAwesome' iconColor='warning'>
									<CardTitle>Robe</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody className='mx-auto'>
								<img 
                                    src={`${API_URL}${horse.image?.data?.attributes?.url}`}
                                />
							</CardBody>
						</Card>}
					</div>

					<div className='col-xl-7'>
						<Card className='shadow-3d-primary'>
							<CardHeader borderSize={1}>
								<CardLabel icon='AutoStories' iconColor='success'>
									<CardTitle tag='h4' className='h5 mx-2'>
										Carnet de santé
									</CardTitle>
								</CardLabel>
                                <CardActions>
                                    {(isAdmin || isPro) &&
                                    <Button
                                        color='info'
                                        icon='Add'
                                        isLight
                                        onClick={() => { setInfoRecord() }}
                                    >
                                        Nouveau
                                    </Button>}
                                </CardActions>
                            </CardHeader>
                            <CardBody>
							{horse.health_record.length === 0
                                ?
                                <Alert color='warning' isLight icon='Report'>
                                    La carnet de santé ne contient aucune entrée.
                                </Alert>
                                :
                                <div className='table-responsive'>
									<table className='table table-modern mb-0'>
										<thead>
											<tr>
												<th></th>
                                                <th>Auteur</th>
												<th>Observations</th>
												<th
                                                    onClick={() => requestSort('date')}
                                                    className='cursor-pointer text-decoration-underline'>
                                                    Date{' '}
                                                    <Icon
                                                        size='lg'
                                                        className={getClassNamesFor('date')}
                                                        icon='KeyboardArrowDown'
                                                    />
                                                </th>
												<th>Urgence</th>
											</tr>
										</thead>

										<tbody>
										{dataPagination(health_items, healthCurrentPage, healthPerPage).map((item) => (
											<tr key={`health_record-${item.id}`}>
                                                <td className='align-top'>
                                                    <Button
                                                        isOutline={!darkModeStatus}
                                                        color='dark'
                                                        isLight={darkModeStatus}
                                                        className={classNames({
                                                            'border-light': !darkModeStatus,
                                                        }, 'mt-3')}
                                                        icon='Info'
                                                        onClick={() => {
                                                            setInfoRecord();
                                                            setEventItem(item);
                                                        }}
                                                        aria-label='Detailed information'
                                                    />
                                                </td>
                                                <td className='align-top'>
                                                <Popovers
                                                    trigger='hover'
                                                    placement='bottom'
                                                    animation={true}
                                                    desc={
                                                        <>
                                                            <div className='h6 text-center text-capitalize'><b>{`${item.employee.data.attributes.name} ${item.employee.data.attributes.surname}`}</b></div>
                                                            <div className='text-muted text-center text-capitalize'>{item.employee.data.attributes.occupation}</div>
                                                        </>
                                                    }>
                                                    <div className="position-relative">
                                                        <Avatar
                                                            srcSet={item.employee.data.attributes.avatar ? `${API_URL}${item.employee.data.attributes.avatar.data.attributes.url}` : `${defaultAvatar}`}
                                                            src={item.employee.data.attributes.avatar ? `${API_URL}${item.employee.data.attributes.avatar.data.attributes.url}` : `${defaultAvatar}`}
                                                            size={64}
                                                            border={4}
                                                            borderColor={themeStatus}
                                                            color={item.employee.data.attributes.color}
                                                            className='cursor-pointer'
                                                        />
                                                    </div>
                                                    </Popovers>
												</td>
                                    
                                                {/* <td>
                                                    <Icon icon={item.icon} size='lg' color='dark' />
                                                </td> */}
                                                <td className='align-top'>
                                                    {item?.field ? <b>{`${item.field} : `}</b> : ''}
                                                    {item.message}
                                                </td>

                                                <td className='align-top'>
                                                    <div className='text-nowrap mt-2'>
                                                        {moment(
                                                            `${item?.date}`,
                                                        ).format('L')}
                                                    </div>
                                                </td>

                                                <td className='align-top'>
                                                    <Button
                                                        isLink
                                                        color={item.color}
                                                        icon='Circle'
                                                        className='text-nowrap'
                                                        style={{cursor: 'default'}}
                                                        >
                                                            {item.color === 'success' && 'Faible'}
                                                            {item.color === 'warning' && 'Modérée'}
                                                            {item.color === 'danger' && 'Élevée'}
                                                            {item.color !== 'success' && item.color !== 'warning' && item.color !== 'danger' && 'Inconnue'}
                                                    </Button> 
                                                </td>
                                            </tr>
										))}
										</tbody>
									</table>
								</div>
                            }
							</CardBody>
                            <PaginationButtons
                                data={health_items}
                                label='du carnet de santé'
                                setCurrentPage={setHealthCurrentPage}
                                currentPage={healthCurrentPage}
                                perPage={healthPerPage}
                                setPerPage={setHealthPerPage}
                            />
						</Card>

                        <Card className='shadow-3d-primary'>
                            <CardHeader borderSize={1}>
                                <CardLabel icon='Today' iconColor='danger'>
                                    <CardTitle tag='h4' className='h5 mx-2'>
                                        Rendez-vous
                                    </CardTitle>
                                </CardLabel>
                            </CardHeader>
                            <CardBody>
                            {horse.appointments.data.length === 0
                                ?
                                <Alert color='warning' isLight icon='Report'>
                                    Aucun rendez-vous à venir.
                                </Alert>
                                :
                                <div className='table-responsive'>
                                    <table className='table table-modern mb-0'>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Intitulé</th>
                                                <th>Professionnel(le)</th>

                                                <th
                                                    onClick={() => requestSortAppointment('start')}
                                                    className='cursor-pointer text-decoration-underline'>
                                                    Début{' '}
                                                    <Icon
                                                        size='lg'
                                                        className={getClassNamesForAppointment('start')}
                                                        icon='KeyboardArrowDown'
                                                    />
                                                </th>

                                                <th>Fin</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                        {dataPagination(appointment_items, appointmentCurrentPage, appointmentPerPage).map((item) => (
                                            <tr key={`appointment-${item.id}`}>
                                                <td>
                                                    <Button
                                                        isOutline={!darkModeStatus}
                                                        color='dark'
                                                        isLight={darkModeStatus}
                                                        className={classNames({
                                                            'border-light': !darkModeStatus,
                                                        })}
                                                        icon='Info'
                                                        onClick={() => console.log(item)}
                                                        aria-label='Detailed information'
                                                    />
                                                </td>

                                                <td>
                                                    <b>{item.attributes.name}</b>
                                                </td>

                                                <td>
                                                    <div className='d-flex'>
                                                        <div className='flex-shrink-0'>
                                                            <Avatar
                                                                srcSet={item.attributes.employee.data.attributes.avatar ? `${API_URL}${item.attributes.employee.data.attributes.avatar.data.attributes.url}` : `${defaultAvatar}`}
                                                                src={item.attributes.employee.data.attributes.avatar ? `${API_URL}${item.attributes.employee.data.attributes.avatar.data.attributes.url}` : `${defaultAvatar}`}
                                                                size={64}
                                                                border={4}
                                                                borderColor={themeStatus}
                                                                color={item.attributes.employee.data.attributes.color}
                                                                className='cursor-pointer'
                                                            />
                                                        </div>
                                                        <div className='flex-grow-1 ms-3 d-flex align-items-center text-nowrap'>
                                                            <div>
                                                                <div>{item.attributes.employee.data.attributes.name} {item.attributes.employee.data.attributes.surname}</div>
                                                                <div className='small text-muted'>{item.attributes.employee.data.attributes.email}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>{moment(item.attributes.start).calendar()}</td>

                                                <td>
                                                    {moment(item.attributes.end).calendar()}
                                                </td>

                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            }
                            </CardBody>
                            <PaginationButtons
                                data={appointment_items}
                                label="de l'agenda de rendez-vous"
                                setCurrentPage={setAppointmentCurrentPage}
                                currentPage={appointmentCurrentPage}
                                perPage={appointmentPerPage}
                                setPerPage={setAppointmentPerPage}
                            />
                        </Card>
					</div>
				</div>


                {/* Détails d'une entrée du carnet de santé */}
                <OffCanvas
					setOpen={(status) => {
						setToggleHealthInfoCanvas(status);
                        //setEventAdding(status);
					}}
					isOpen={toggleHealthInfoCanvas}
					titleId='canvas-title'>
					<OffCanvasHeader
						setOpen={(status) => {
							setToggleHealthInfoCanvas(status);
							//setEventAdding(status);
						}}
						className='p-4'>
						<OffCanvasTitle id='canvas-title' tag='h3'>
							Carnet de santé
						</OffCanvasTitle>
					</OffCanvasHeader>
					<OffCanvasBody 
                        tag='form' 
                        onSubmit={formikHealth.handleSubmit} 
                        className='p-4'>

                        {eventItem ?
                        <>
                            <div className='d-flex justify-content-center mb-3'>
                                <Avatar
                                    srcSet={eventItem?.employee?.data?.attributes?.avatar ? `${API_URL}${eventItem?.employee?.data?.attributes?.avatar?.data?.attributes?.url}` : `${defaultAvatar}`}
                                    src={eventItem?.employee?.data?.attributes?.avatar ? `${API_URL}${eventItem?.employee?.data?.attributes?.avatar?.data?.attributes?.url}` : `${defaultAvatar}`}
                                    color={eventItem?.employee?.data?.attributes?.color}
                                    shadow='default'
                                />
                            </div>
                            <div className='d-flex flex-column align-items-center mb-5'>
                                <div className='h2 fw-bold text-capitalize'>{eventItem?.employee?.data?.attributes?.name} {eventItem?.employee?.data?.attributes?.surname}</div>
                                <div className='h5 text-muted opacity-75 mb-4'>{eventItem?.employee?.data?.attributes?.occupation || 'Professionel(le)'}</div>
                                <div className='h6 text-muted opacity-50'>{eventItem?.employee?.data?.attributes?.email}</div>
                                <div className='h6 text-muted opacity-50'>{eventItem?.employee?.data?.attributes?.phone}</div>
                            </div>
                        </>
                        :
                        <>
                            <div className='d-flex justify-content-center mb-3'>
                                <Avatar
                                    srcSet={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.url}` : `${defaultAvatar}`}
                                    src={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.url}` : `${defaultAvatar}`}
                                    color={auth.user?.color}
                                    shadow='default'
                                />
                            </div>
                            <div className='d-flex flex-column align-items-center mb-5'>
                                <div className='h2 fw-bold text-capitalize'>{auth.user.name} {auth.user.surname}</div>
                                <div className='h5 text-muted opacity-75 mb-4'>{auth.user.occupation || 'Professionel(le)'}</div>
                                <div className='h6 text-muted opacity-50'>{auth.user.email}</div>
                                <div className='h6 text-muted opacity-50'>{auth.user?.phone}</div>
                            </div>
                        </>
                        }

						<div className='row g-4'> 
                            {/* Urgence */}
                            <div className="col-12">
                                <Dropdown 
                                    id='color'
                                    className='mb-2' 
                                    >
                                    <DropdownToggle hasIcon={false}>
                                        <Button
                                            isLight
                                            color={formikHealth.values.color || 'success'}
                                            icon='Circle'
                                            className='text-nowrap'
                                            size='lg'
                                            disabled={eventItem && !isAdmin && !isHealthRecordAuthor}
                                        >
                                            {(formikHealth.values.color === 'success' || !formikHealth.values.color) && 'Urgence faible'}
                                            {formikHealth.values.color === 'warning' && 'Urgence modérée'}
                                            {formikHealth.values.color === 'danger' && 'Urgence élevée'}
                                        </Button>
                                    </DropdownToggle>
                                
                                    <DropdownMenu >
                                        <DropdownItem
                                            name='color'
                                            value='success'
                                            onClick={() => formikHealth.setFieldValue("color", 'success')}
                                            >
                                            <div>
                                                <Icon
                                                    icon='Circle'
                                                    color='success'
                                                />
                                                Faible
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            name='color'
                                            value='warning'
                                            onClick={() => formikHealth.setFieldValue("color", 'warning')}
                                            >
                                            <div>
                                                <Icon
                                                    icon='Circle'
                                                    color='warning'
                                                />
                                                Modérée
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem
                                            name='color'
                                            value='danger'
                                            onClick={() => formikHealth.setFieldValue("color", 'danger')}
                                            >
                                            <div>
                                                <Icon
                                                    icon='Circle'
                                                    color='danger'
                                                />
                                                Élevée
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

							{/* Field */}
							<div className='col-12'>
                                <InputGroup className='mb-2'>
                                    <InputGroupText>
                                        <Icon 
                                            icon='Edit' 
                                            //size='2x' 
                                        /> 
                                    </InputGroupText>

                                    <Input
                                        aria-label='field'
                                        id='field'
                                        //size='lg'
                                        placeholder="Intitulé de l'observation..."
                                        value={formikHealth.values.field}
                                        onChange={formikHealth.handleChange}
                                        disabled={eventItem && !isAdmin && !isHealthRecordAuthor}
                                    />
                                </InputGroup>
							</div>

                            {/* Message */}
                            <div className='col-12'>
                                <Textarea
                                    id="message"
                                    placeholder="Contenu de l'observation..."
                                    value={formikHealth.values.message}
                                    onChange={formikHealth.handleChange}
                                    className='py-3 px-4 mb-2'
                                    style={{minHeight: '150px'}}
                                    disabled={eventItem && !isAdmin && !isHealthRecordAuthor}
                                />
                            </div>

                            {/* Date */}
                            <div className="col-12">
                                <InputGroup className='mb-2'>
                                    <InputGroupText>
                                        <Icon icon='AccessTime' />
                                    </InputGroupText>
                                    <Input
                                        id='date'
                                        type='date'
                                        value={moment(formikHealth.values.date).format(moment.HTML5_FMT.DATE)}
                                        onChange={formikHealth.handleChange}
                                        disabled={eventItem && !isAdmin && !isHealthRecordAuthor}
                                    />
                                </InputGroup>
                            </div>

                            {/* Employee */}
                            <div className="col-12">
                                <InputGroup className='mb-2'>
                                    <InputGroupText>
                                        <Icon icon='PersonAdd' /> 
                                    </InputGroupText>
                                    <Select
                                        id='employee.id'
                                        placeholder='Écrit par...'
                                        value={formikHealth.values?.employee?.id || auth.user.id}
                                        onChange={formikHealth.handleChange}
                                        ariaLabel='Employee select'
                                        disabled={!isAdmin}
                                    >
                                        {employees.map( employee => (
                                            <Option
                                                key={employee.username}
                                                value={employee.id}>
                                                {`${employee.name} ${employee.surname}`}
                                            </Option>
                                        ))}
                                    </Select>
                                </InputGroup>
                            </div>
			  
                            <div className='d-flex align-items-center justify-content-between py-4 mb-4'>
                                {/* Bouton 'Confirmer' : uniquement pour les nouvelles entrées (!eventItem),
                                OU les entrées existantes si le user est Admin ou l'auteur de l'entrée  */}
                                {(!eventItem || (isAdmin || isHealthRecordAuthor)) && 
                                <div>
                                    <Button 
                                        color='info' 
                                        icon='Save'
                                        type='submit'
                                        disabled={!formikHealth.values.message}
                                    >
                                        Confirmer
                                    </Button>
                                </div>}

                                {/* Bouton 'Supprimer' : uniquement pour les entrées existantes (eventItem),
                                ET si le user est Admin ou l'auteur de l'entrée  */}
                                {(eventItem && (isAdmin || isHealthRecordAuthor)) && 
                                <div>
                                    <Button 
                                        color='danger' 
                                        icon='Delete'
                                        isOutline
                                        onClick={ () => setTriggerModal(true)}
                                    >
                                        Supprimer
                                    </Button>
                                </div>}
                            </div>
						</div>
					</OffCanvasBody>
				</OffCanvas>

                <Modal
                    isOpen={triggerModal}
                    setIsOpen={setTriggerModal}
                    titleId='confirmationModal'
                    isCentered isAnimation >
                        <ModalHeader setIsOpen={setTriggerModal}>
                            <ModalTitle id='confirmationModal'>Supprimer une observation</ModalTitle>
                        </ModalHeader>
                        <ModalBody className='text-center new-line'>{`Voulez-vous supprimer cette observation ?\nCette observation sera définitivement supprimée du carnet de santé.`}</ModalBody>
                        <ModalFooter>
                            <Button
                                color='light'
                                className='border-0'
                                isOutline
                                onClick={() => setTriggerModal(false)} >
                                Annuler
                            </Button>
                            <Button 
                                color='danger' 
                                icon='Delete'
                                onClick={ () => {
                                    //handleDelete();
                                    setTriggerModal(false);
                                } }>
                                Confirmer
                            </Button>
                        </ModalFooter>
                </Modal>

			</Page>
		</PageWrapper>
	);
}

export default HorsePage