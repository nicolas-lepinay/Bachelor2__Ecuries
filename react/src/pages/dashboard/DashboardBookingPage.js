// 📚 Librairies :
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import classNames from 'classnames';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import { useFormik } from 'formik';
import { Calendar as DatePicker } from 'react-date-range';
import CircularProgress from '@mui/material/CircularProgress';

import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Icon from '../../components/icon/Icon';

// 🅱️ Bootstrap components :
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle } from '../../components/bootstrap/Card';

import OffCanvas, {
    OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle } from '../../components/bootstrap/OffCanvas';

import Dropdown, {
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
} from '../../components/bootstrap/Dropdown';


import Alert from '../../components/bootstrap/Alert';
import Button from '../../components/bootstrap/Button';
import Accordion, { AccordionItem } from '../../components/bootstrap/Accordion';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import Select from '../../components/bootstrap/forms/Select';
import Option from '../../components/bootstrap/Option';
import Textarea from '../../components/bootstrap/forms/Textarea';
import InputGroup, { InputGroupText } from '../../components/bootstrap/forms/InputGroup';
import Popovers from '../../components/bootstrap/Popovers';

import Modal, {
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalTitle } from '../../components/bootstrap/Modal'

import CommonUpcomingEvents from '../common/CommonUpcomingEvents';
import Avatar, { AvatarGroup } from '../../components/Avatar';
import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';

import {
    CalendarTodayButton,
	CalendarViewModeButtons,
	getLabel,
	getUnitType,
	getViews,
} from '../../components/extras/calendarHelper';
import { clientMenu, demoPages } from '../../menu';
import CommonApprovedAppointmentChart from '../common/CommonApprovedAppointmentChart';
import CommonPercentageOfLoadChart from '../common/CommonPercentageOfLoadChart';
import CommonDashboardBookingLists from '../common/BookingComponents/CommonDashboardBookingLists';
import CommonRightPanel from '../common/BookingComponents/CommonRightPanel';
import showNotification from '../../components/extras/showNotification';

// 🛠️ Hooks :
import useMinimizeAside from '../../hooks/useMinimizeAside';
import useDarkMode from '../../hooks/useDarkMode';
import useFetchAppointments from '../../hooks/useFetchAppointments'
import useFetchEmployees from '../../hooks/useFetchEmployees'
import useAuth from '../../hooks/useAuth';

// 🅰️ Axios :
import axios from 'axios';

// ⚙️ Strapi's API URL :
const API_URL = process.env.REACT_APP_API_URL;
const APPOINTMENTS_ROUTE = process.env.REACT_APP_APPOINTMENTS_ROUTE;

const localizer = momentLocalizer(moment);
const now = new Date();

const Circle = ({ color }) => {
    return(
        <Icon
            icon='Circle'
            className={classNames(
                `text-${color}`,
                'mr-2',
                'animate__animated animate__heartBeat animate__infinite animate__slower',
            )}
        />
    )};

const MyEvent = (data) => {
	const { darkModeStatus } = useDarkMode();

	const { event } = data;

    // RDV confirmé :
    const isConfirmedEvent = event?.confirmed;

    // RDV actif (confirmé + en cours) :
    const isActiveEvent = isConfirmedEvent && event.start <= now && event.end >= now;

    // RDV passé :
    const isPastEvent = event.end < now;

	return (
		<div className='row g-2'>
			<div className='col text-truncate'>
                {isActiveEvent && <Circle color='success' />}
                {!isConfirmedEvent && !isPastEvent && <Circle color='danger' />}
				{(isConfirmedEvent || isPastEvent) && !isActiveEvent && event?.icon && <Icon icon={event?.icon} size='lg' className='me-2' />}

				{event?.name || event?.employee?.data?.attributes?.occupation}
			</div>

            <div className='col-auto'>
                <div className='row g-1 align-items-baseline'>
                    <div className='col-auto'>
                        <Avatar 
                            src={event?.employee?.data && event?.employee?.data?.attributes?.avatar ? `${API_URL}${event?.employee?.data?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                            srcSet={event?.employee?.data && event?.employee?.data?.attributes?.avatar ? `${API_URL}${event?.employee?.data?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                            size={18} 
                        />
                    </div>
                    <small
                        className={classNames('col-auto text-truncate', {
                            'text-dark': !darkModeStatus,
                            'text-white': darkModeStatus,
                        })}>
                        {event?.employee?.data?.attributes?.name}
                    </small>
                </div>
            </div>
		</div>
	);
};


const MyWeekEvent = (data) => {
	const { darkModeStatus } = useDarkMode();

	const { event } = data;

    // RDV confirmé :
    const isConfirmedEvent = event?.confirmed;

    // RDV actif (confirmé + en cours) :
    const isActiveEvent = isConfirmedEvent && event.start <= now && event.end >= now;

    // RDV passé :
    const isPastEvent = event.end < now;

	return (
		<div className='row g-2'>
			<div className='col-12 text-truncate'>
                {isActiveEvent && <Circle color='success' />}
                {!isConfirmedEvent && !isPastEvent && <Circle color='danger' />}
				{(isConfirmedEvent || isPastEvent) && !isActiveEvent && event?.icon && <Icon icon={event?.icon} size='lg' className='me-2' />}

				{event?.name || event?.employee?.data?.attributes?.occupation}
			</div>
			{event?.employee?.data && (
				<div className='col-12'>
					<div className='row g-1 align-items-baseline'>
						<div className='col-auto'>
                            <Avatar 
                                src={event?.employee?.data?.attributes?.avatar ? `${API_URL}${event?.employee?.data?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                                srcSet={event?.employee?.data?.attributes?.avatar ? `${API_URL}${event?.employee?.data?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                                size={18} 
                            />
						</div>
						<small
							className={classNames('col-auto text-truncate', {
								'text-dark': !darkModeStatus,
								'text-white': darkModeStatus,
							})}>
							{event?.employee?.data?.attributes?.name}
						</small>
					</div>
				</div>
			)}
		</div>
	);
};

const DashboardBookingPage = () => {
    
    // 🛠️ Hooks :
    const auth = useAuth(); // 🦸
	const { darkModeStatus, themeStatus } = useDarkMode();
	useMinimizeAside();

	const [toggleRightPanel, setToggleRightPanel] = useState(true);

    // Id du rôle 'Admin' :
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    // Booleans :
    const isAdmin = Number(auth.user.role.id) === Number(ADMIN_ID);
    const isPro = Number(auth.user.role.id) === Number(PRO_ID);
    const isClient = Number(auth.user.role.id) === Number(CLIENT_ID);
    const [isAuthor, setIsAuthor] = useState(false); // Is the user a professional in charge of an appointment

    // 👩‍🚀 Fetch all employees :
    const { 
        data: employees, 
        setData: setEmployees, 
        loading: employeesLoading, 
        error: employeesError } = useFetchEmployees();

    // 📅 Fetch all appointments :
    const { 
        data: appointments, 
        setData: setAppointments, 
        loading: appointmentsLoading, 
        error: appointmentsError } = useFetchAppointments();

    const icons = [
        {
            icon: 'Block',
            description: 'Aucune icône'
        },
        {
            icon: 'HorseVariant',
            description: 'Cheval (tête)',
        },
        {
            icon: 'Horse',
            description: 'Cheval (corps)',
        },
        {
            icon: 'HorseHuman',
            description: 'Cavalière',
        },
        {
            icon: 'Horseshoe',
            description: 'Fer à cheval',
        }, 
        {
            icon: 'Tooth',
            description: 'Dentisterie',
        }, 
        {
            icon: 'Bone',
            description: 'Osthéopathie',
        }, 
        {
            icon: 'FootPrint',
            description: 'Podologie',
        }, 
        {
            icon: 'Leaf',
            description: 'Phytothérapie',
        }, 
        {
            icon: 'CleaningServices',
            description: 'Brossage',
        }, 
        {
            icon: 'HealthAndSafety',
            description: 'Soins',
        }, 
        {
            icon: 'Park',
            description: 'Promenade',
        },
        {
            icon: 'FitnessCenter',
            description: 'Exercice',
        },
        {
            icon: 'CameraAlt',
            description: 'Photographie',
        },
        {
            icon: 'HandWave',
            description: 'Main',
        }, 
    ]

	// BEGIN :: Calendar
    const [employeeList, setEmployeeList] = useState({});
    const [selectedEmployee, setSelectedEmployee] = useState({})

    useEffect(() => {
        const list = {};
        employees.map( employee => list[employee.id] = true)
        setEmployeeList(list);
        employees.length > 0 && setSelectedEmployee(employees[0])
    }, [employees])

	// Selected Event
	const [eventItem, setEventItem] = useState(null);
	// Calendar View Mode
	const [viewMode, setViewMode] = useState(Views.MONTH);
	// Calendar Date
	const [date, setDate] = useState(new Date());
	// Item edit panel status
	const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
	const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);

    const [toggleClientCanvas, setToggleClientCanvas] = useState(false);
	const setClientEvent = () => setToggleClientCanvas(!toggleClientCanvas);
    
	const [eventAdding, setEventAdding] = useState(false);

	// Calendar Unit Type
	const unitType = getUnitType(viewMode);
	// Calendar Date Label
	const calendarDateLabel = getLabel(date, viewMode);

	// Change view mode
	const handleViewMode = (e) => {
		setDate(moment(e)._d);
		setViewMode(Views.DAY);
	};
	// View modes; Month, Week, Work Week, Day and Agenda
	const views = getViews();

	// New Event
	const handleSelect = ({ start, end }) => {
        if(isAdmin || isPro) {
            setEventAdding(true);
            setEventItem({ start, end });
        }
	};

    const handleEmployeeListChange = (employee) => {
        setEmployeeList( {...employeeList, [employee.id]: !employeeList[employee.id] })
    }

    const handleSelectedEmployee = (employee) => {
        setSelectedEmployee(employee)
    }

    const [toggleEmployeeList, setToggleEmployeeList] = useState(false);
    
    const fillEmployeeList = () => {
        const list = {};
        employees.map( employee => list[employee.id] = true)
        setEmployeeList(list);
    }

    const emptyEmployeeList = () => {
        const list = {};
        employees.map( employee => list[employee.id] = false)
        setEmployeeList(list);
    }

    const [eventIsFull, setEventIsFull] = useState(false)

    // All horses registered to an appointment :
    const [registeredHorses, setRegisteredHorses] = useState([]);

	useEffect(() => {
		if (eventAdding) {
			setInfoEvent();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventAdding]);

	/**
	 * Calendar Item Container Style
	 * @param event
	 * @param start
	 * @param end
	 * @param isSelected
	 * @returns {{className: string}}
	 */
	// eslint-disable-next-line no-unused-vars
	const eventStyleGetter = (event, start, end, isSelected) => {

        // RDV confirmé :
        const isConfirmedEvent = event?.confirmed;

        // RDV actif (confirmé + en cours) :
		const isActiveEvent = isConfirmedEvent && start <= now && end >= now;

        // RDV passé :
		const isPastEvent = end < now;

		const color = event?.employee?.data?.attributes?.color;

		return {
			className: classNames({
				[`bg-l${darkModeStatus ? 'o25' : '10'}-${color} text-${color}`]: color,
				[`border border-success`]: isActiveEvent,
                [`border border-danger`]: !isConfirmedEvent && !isPastEvent,
				'opacity-50': isPastEvent,
			}),
		};
	};

    // ADMIN :
	const formik = useFormik({
		initialValues: {
            id: '',
			name: '',
			start: '',
			end: '',
            confirmed: '',
            description: '',
            icon: '',
            maximum_horses: '',
            employee: {
                id: '',
            },
            horses: [],
		},
		onSubmit: (values, { resetForm }) => {
            values.horses = registeredHorses; // !important

            console.log(values)

            // Validation :
            if(values.name === '' 
                || !values?.name 
                || values?.start === '' 
                || !values?.start 
                || values?.end === '' 
                || !values?.end === '' 
                || values?.employee?.id === '' 
                || !values?.employee?.id)
                    return

            // Je supprime tous les champs vide ou null/undefined (mais pas false!) :
            for (const key in values) {
                if (values[key] === '' || values[key] === null || values[key] === undefined) {
                    delete values[key];
                }
            }
            // Supprime le champ 'eventAllDay' :
            delete values["eventAllDay"];

            // Si le bouton 'Aucune icône' est cochée, je set l'icône à null pour la supprimer de la base de données :
            if(values.icon === 'Block')
                values.icon = null;

            // Cast de l'employeeId en int :
            values.employee.id = Number(values.employee.id);

            // ✨ AJOUT D'UN NOUVEL EVENEMENT ✨
			if (eventAdding) {
                !values.icon && delete values["icon"];
                isAdmin ? values.confirmed = true : values.confirmed = false;
                handlePost(values)
            // ✨ MODIFICATION D'UN EVENEMENT EXISTANT ✨
			} else {
                handleUpdate(values);
            }
			setToggleInfoEventCanvas(false);
			setEventAdding(false);
			setEventItem(null);
            resetForm({ values: ''});
		},
	});

    // CLIENT :
    const clientFormik = useFormik({
		initialValues: {
            id: '',
            horses: [],
		},
		onSubmit: (values, { resetForm }) => {
            values.horses = registeredHorses; // !important

            handleUpdate(values);
            
			setToggleInfoEventCanvas(false);
			setEventAdding(false);
			setEventItem(null);
            resetForm({ values: ''});
		},
	});

    const handlePost = async (newData) => {

        try {
            const res = await axios.post(`${API_URL}${APPOINTMENTS_ROUTE}?populate=employee.avatar&populate=employee.role&populate=horses.owner`, { data: newData });
            const resData = res.data.data;

            let formattedData = {}
            formattedData = { id: resData.id, ...resData.attributes }

            if(formattedData?.start)
                formattedData.start = new Date(formattedData.start)
            if(formattedData?.end)
                formattedData.end = new Date(formattedData.end)
        
            setAppointments( prev => [...prev, formattedData] );
            showNotification(
                'Calendrier.', // title
				"Le rendez-vous a été ajouté au calendrier.", // message
                'success' // type
			);
        } catch(err) {
            console.log("POST | Appointment | Le rendez-vous n'a pas pu être ajouté à la base de données. | " + err);
            showNotification(
                'Calendrier.', // title
				"Oops ! Une erreur s'est produite. Le rendez-vous n'a pas pu être ajouté.", // message
                'danger' // type
			);
        }
    }

    const handleUpdate = async (newData) => {

        try {
            const res = await axios.put(`${API_URL}${APPOINTMENTS_ROUTE}/${newData.id}?populate=employee.avatar&populate=employee.role&populate=horses.owner`, { data: newData });
            const resData = res.data.data;

            let formattedData = {}
            formattedData = { id: resData.id, ...resData.attributes }

            if(formattedData?.start)
                formattedData.start = new Date(formattedData.start)
            if(formattedData?.end)
                formattedData.end = new Date(formattedData.end)

            // Loop over the appointments list and find the id of the updated one:
            const updatedAppointments = appointments.map(item => {
                if (item.id == formattedData.id)
                    return formattedData; // Returns updated appointment
                
                return item; // else returns unmodified appointment 
            });
        
            setAppointments(updatedAppointments);

            isClient ?
            showNotification( // Prise d'un rendez-vous
                'Confirmation de votre rendez-vous', // title
				"Votre demande de rendez-vous a été enregistré.", // message
                'success' // type
			)
            :
            showNotification( // Modification d'un rendez-vous
                'Mise à jour.', // title
				"Le rendez-vous a été modifié.", // message
                'success' // type
			);
            
            ;
        } catch(err) {
            console.log("UPDATE | Appointment | Le rendez-vous n'a pas pu être modifié dans la base de données. | " + err);
            showNotification(
                'Mise à jour.', // title
				"Oops ! Une erreur s'est produite. Le rendez-vous n'a pas pu être modifié.", // message
                'danger' // type
			);
        }
    }

    const handleDelete = async () => {
        if(eventItem?.id) {
            try {
                await axios.delete(`${API_URL}${APPOINTMENTS_ROUTE}/${eventItem.id}`);
                setAppointments( appointments => appointments.filter( item => item.id !== eventItem.id))
                showNotification(
                    'Mise à jour.', // title
                    "Le rendez-vous a été supprimé.", // message
                    'success' // type
                );
            } catch (err) {
                console.log("DELETE | Appointment | Le rendez-vous n'a pas pu être supprimé de la base de données. | " + err);
                showNotification(
                    'Calendrier.', // title
                    "Oops ! Une erreur s'est produite. Le rendez-vous n'a pas pu être supprimé.", // message
                    'danger' // type
                );
            }
        }
    }

    
	useEffect(() => {
        formik.setValues({})
        setRegisteredHorses([])
        setEventIsFull(false)
        setIsAuthor(false)
                
        // Je détruis l'event quand je ferme le panel de droite, pour que les nouveaux events générés après soient bien vides :
        if(!toggleInfoEventCanvas && !toggleClientCanvas)
            setEventItem(null)

		if (eventItem) {
            // ADMIN :
			formik.setValues({
				...formik.values,
				id: eventItem.id,
				name: eventItem?.name,
				start: moment(eventItem.start).format(),
				end: moment(eventItem.end).format(),
                employee: {
                    id: eventItem?.employee?.data?.id,
                },
                confirmed: eventItem.confirmed,
                description: eventItem?.description,
                icon: eventItem?.icon ? eventItem.icon : 'Block',
                maximum_horses: eventItem?.maximum_horses,
			});
            // CLIENT :                
            eventItem?.horses?.data &&
            eventItem?.horses?.data.map( horse => {
                setRegisteredHorses( old => [...old, { 
                    id: horse?.id,
                    name: horse?.attributes?.name,
                    ownerId: horse?.attributes?.owner?.data?.id
                }]) // User's horses registered to the appointment 
            })
            
            clientFormik.setValues({
				...formik.values,
				id: eventItem.id,
				horses: [],
			});
            eventItem?.maximum_horses && setEventIsFull(parseInt(eventItem?.maximum_horses) - eventItem.horses.data.length < 1) // Le rendez-vous est-il complet ?
            setIsAuthor(Number(auth.user.id) === Number(eventItem?.employee?.data?.id)); // Le user loggé est-il le professionel responsable du rendez-vous ?
        }
		return () => {};
	}, [eventItem, toggleClientCanvas, toggleInfoEventCanvas]);
	// END:: Calendar

	const [toggleCalendar, setToggleCalendar] = useState(true);

    // Open '🗑️ Delete' modal :
    const [triggerModal, setTriggerModal] = useState(false);

    return (
		<PageWrapper title={`${clientMenu.dashboards.dashboards.text} ${clientMenu.dashboards.dashboards.subMenu.dashboardBooking.text}`}>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						icon='Groups'
						onClick={() => {
                            setToggleEmployeeList(!toggleEmployeeList);
                            toggleEmployeeList ? fillEmployeeList() : emptyEmployeeList();
                        } }
						color={toggleEmployeeList ? darkModeStatus ? 'dark' : 'light' : 'primary'}
						aria-label='Select or unselect all employees'
                        size='lg'
                        title="Sélectionner / Déselectionner tous les professionnels"
					/>
                    <Button
						icon='FaceRetouchingNatural'
						onClick={() => setToggleRightPanel(!toggleRightPanel)}
						color={toggleRightPanel ? 'primary' : darkModeStatus ? 'dark' : 'light'}
						aria-label='Toggle right panel'
                        size='lg'
                        title="Afficher l'aperçu du professionel"
					/>
					<Button
						icon='Today'
						onClick={() => setToggleCalendar(!toggleCalendar)}
						color={toggleCalendar ? 'primary' : darkModeStatus ? 'dark' : 'light'}
						aria-label='Toggle calendar'
                        size='lg'
                        title="Afficher / Masquer le calendrier"
					/>
					<Popovers
						desc={
							<DatePicker
								onChange={(item) => setDate(item)}
								date={date}
								color={process.env.REACT_APP_PRIMARY_COLOR}
							/>
						}
						placement='bottom-start'
						className='mw-100'
						trigger='click'>
						<Button color={darkModeStatus ? 'light' : 'dark'} isLight>
							{calendarDateLabel}
						</Button>
					</Popovers>
				</SubHeaderLeft>
			</SubHeader>
			<Page container='fluid'>
				{toggleCalendar && (
					<>            
                        <div className='row mb-4 g-3 justify-content-center '>
							{employees && employees.map( (employee) => (
								<div key={employee.username} className='col-auto'>
									<Popovers
										trigger='hover'
                                        placement='bottom'
                                        animation={true}
										desc={
											<>
												<div className='h6'><b>{`${employee.name} ${employee.surname}`}</b></div>
											</>
										}>
										<div className='position-relative'>
											<Avatar
												srcSet={employee?.avatar ? `${API_URL}${employee?.avatar?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
												src={employee?.avatar ? `${API_URL}${employee?.avatar?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
												color={employee?.color}
												size={64}
												border={4}
												className='cursor-pointer'
												borderColor={
													employeeList[employee.id]
														? 'info'
														: themeStatus
												}

                                                onClick={ () => {
                                                    handleEmployeeListChange(employee);
                                                    handleSelectedEmployee(employee);
                                                } }
                                                onMouseEnter={ () => {
                                                    handleSelectedEmployee(employee);
                                                } }
											/>
										</div>
									</Popovers>
								</div>
							))}

                            {employeesLoading && (
                                <CircularProgress color="info" size='46px' />
                            )}
						</div>
                        
						<div className='row h-100'>
							<div
								className={classNames({
									'col-xxl-11': !toggleRightPanel,
									'col-12': toggleRightPanel,
								})}>
								<Card stretch style={{ minHeight: 680 }}>
									<CardHeader>
										<CardActions>
											<CalendarTodayButton
												unitType={unitType}
												date={date}
												setDate={setDate}
												viewMode={viewMode}
											/>
										</CardActions>
										<CardActions>
											<CalendarViewModeButtons
												setViewMode={setViewMode}
												viewMode={viewMode}
											/>
										</CardActions>
									</CardHeader>
									<CardBody isScrollable>
										<Calendar
											selectable
											toolbar={false}
											localizer={localizer}
                                            events={isClient ? appointments.filter(
												(appointment) => employeeList[appointment.employee.data.id] && appointment.end > now && appointment.confirmed,
											) : appointments.filter(
												(appointment) => employeeList[appointment.employee.data.id],
											)}
											defaultView={Views.WEEK}
											views={views}
											view={viewMode}
											date={date}
											onNavigate={(_date) => setDate(_date)}
											scrollToTime={new Date(1970, 1, 1, 6)}
											defaultDate={new Date()}
											onSelectEvent={(event) => {
												(isAdmin || isPro) && setInfoEvent();
                                                (isClient) && setClientEvent();
												setEventItem(event);
											}}
											onSelectSlot={handleSelect}
											onView={handleViewMode}
											onDrillDown={handleViewMode}
											components={{
												event: MyEvent, // used by each view (Month, Day, Week)
												week: {
													event: MyWeekEvent,
												},
												work_week: {
													event: MyWeekEvent,
												},
											}}
											eventPropGetter={eventStyleGetter}
										/>
									</CardBody>
								</Card>
							</div>
						</div>
					</>
				)}

                {/* ADMIN : Modifier ou Ajouter un RDV */}
				{eventItem && 
                    <OffCanvas
					setOpen={(status) => {
						setToggleInfoEventCanvas(status);
						setEventAdding(status);
					}}
					isOpen={toggleInfoEventCanvas}
					titleId='canvas-title'>
					<OffCanvasHeader
						setOpen={(status) => {
							setToggleInfoEventCanvas(status);
							setEventAdding(status);
						}}
						className='p-4'>
						<OffCanvasTitle id='canvas-title' tag='h3'>
							{eventAdding ? 'Ajouter un évènement' : isAdmin || isAuthor ? "Modifier l'évènement" : "Détails de l'évènement"}
						</OffCanvasTitle>
					</OffCanvasHeader>
					<OffCanvasBody tag='form' onSubmit={formik.handleSubmit} className='p-4'>
						<div className='row g-4'>

                            {/* Confirm event */}
                            {/* (Uniquement Admin + Uniquement pour la modification d'un évènement existant) */}
                            {isAdmin && !eventAdding &&
                                <div className='col-12'>
                                    <Dropdown>
                                        <DropdownToggle hasIcon={false}>
                                            <Button
                                                isLight
                                                color={formik.values?.confirmed ? 'success' : 'danger'}
                                                icon='Circle'
                                                className='text-nowrap'>
                                                {formik.values?.confirmed ? 'Confirmé' : 'En attente de confirmation'}
                                            </Button>
                                        </DropdownToggle>
                                        
                                        <DropdownMenu >
                                            <DropdownItem 
                                                name='confirmed'
                                                value={true}
                                                onClick={() => formik.setFieldValue("confirmed", true)}
                                                >
                                                <div>
                                                    <Icon
                                                        icon='Circle'
                                                        color='success'
                                                    />
                                                    Confirmé
                                                </div>
                                            </DropdownItem>

                                            <DropdownItem 
                                                name='confirmed'
                                                value={false}
                                                onClick={() => formik.setFieldValue("confirmed", false)}
                                                >
                                                <div>
                                                    <Icon
                                                        icon='Circle'
                                                        color='danger'
                                                    />
                                                    En attente de confirmation
                                                </div>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </div>
                            }   


							{/* Name */}
							<div className='col-12'>
                                <InputGroup className='mb-2'>
                                    <InputGroupText>Nom</InputGroupText>
                                    <Input
                                        id='name'
                                        placeholder="Nom de l'évènement"
                                        aria-label='name'
                                        size='lg'
                                        onChange={formik.handleChange}
                                        value={formik.values?.name}
                                    />
                                </InputGroup>
							</div>

                            {/* Description, Icône & Participants */}
                            <div className='col-12'>
                                <Accordion id='desc-and-ico' color='primary' className='mb-2' isFlush={false} >
                                    <AccordionItem
                                        id='desc'
                                        title='Description'
                                        icon='Description'>
                                        <Textarea
                                            id='description'
                                            placeholder='Écrire une description...'
                                            className='py-3 px-4'
                                            onChange={formik.handleChange}
                                            value={formik.values?.description}
                                        />
                                    </AccordionItem>
                                    <AccordionItem
                                        id='ico'
                                        title='Icône'
                                        icon='EmojiEvents'>
                                        <>
                                            {icons.map( item => (
                                                <Popovers
                                                    trigger='hover'
                                                    placement='top'
                                                    desc={
                                                        <>
                                                            <small className='text-muted'>{item.description}</small>
                                                        </>
                                                    }>
                                                    <Button
                                                        className='mx-2-5 my-2'
                                                        color={formik.values.icon === item.icon ? `success` : 'info'}
                                                        forceFamily='material'
                                                        icon={item.icon}
                                                        name='icon'
                                                        isLink isActive
                                                        key={item.icon}
                                                        size='lg'
                                                        value={item.icon}
                                                        onClick={() => formik.setFieldValue("icon", `${item.icon}`)}
                                                    />
                                                </Popovers>
                                            ))}
                                        </>
                                        
                                    </AccordionItem>
                                    <AccordionItem
                                        id='maximum_horses'
                                        title='Participants'
                                        icon='Groups'>
                                        <InputGroup className='mb-4'>
                                            <InputGroupText>Maximum</InputGroupText>
                                            <Input
                                                id='maximum_horses'
                                                name='maximum_horses'
                                                placeholder='Nombre maximal'
                                                type='Number'
                                                min={registeredHorses.length > 0 ? registeredHorses.length : 1}
                                                max={999}
                                                size='lg'
                                                onChange={formik.handleChange}
                                                value={formik.values.maximum_horses}
                                            />
                                        </InputGroup>


                                        <div className='col-12'>
                                        {/* All horses registered to the event */}
                                        {registeredHorses.map( horse => (
                                            <Button
                                                value={horse?.id}
                                                icon={isAdmin ? 'Close' : ''}
                                                color='info'
                                                size='sm'
                                                className='mr-3 mb-3'
                                                disabled={!isAdmin}
                                                onClick={() => {
                                                    isAdmin && setRegisteredHorses(registeredHorses.filter(h=>h?.id != horse?.id))
                                                }}
                                            >
                                                {horse?.name}
                                            </Button>
                                        ))}
                                        </div>

                                    </AccordionItem>
                                </Accordion>
                            </div>

							{/* Date */}
							<div className='col-12'>
								<Card className='mb-2 bg-l10-info' shadow='sm'>
									<CardHeader className='bg-l25-info'>
										<CardLabel icon='DateRange' iconColor='info'>
											<CardTitle className='text-info'>
												Date et horaires
											</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-3'>
											{eventAdding &&
                                                <div className='col-12'>
												<FormGroup id='eventAllDay'>
													<Checks
														type='switch'
														value='true'
														label='Journée complète'
														checked={formik.values.eventAllDay}
														onChange={formik.handleChange}
													/>
												</FormGroup>
											</div>
                                            }
											<div className='col-12'>
												<FormGroup
													id='start'
													label={
														formik.values.eventAllDay
															? 'Date'
															: 'Date de début'
													}>
													<Input
														type={
															formik.values.eventAllDay
																? 'date'
																: 'datetime-local'
														}
														value={
															formik.values.eventAllDay
																? moment(
																		formik.values.start,
																  ).format(moment.HTML5_FMT.DATE)
																: moment(
																		formik.values.start,
																  ).format(
																		moment.HTML5_FMT
																			.DATETIME_LOCAL,
																  )
														}
														onChange={formik.handleChange}
													/>
												</FormGroup>
											</div>

											{!formik.values.eventAllDay && (
												<div className='col-12'>
													<FormGroup id='end' label='Date de fin'>
														<Input
															type='datetime-local'
															value={moment(
																formik.values.end,
															).format(
																moment.HTML5_FMT.DATETIME_LOCAL,
															)}
															onChange={formik.handleChange}
														/>
													</FormGroup>
												</div>
											)}
										</div>
									</CardBody>
								</Card>
							</div>

							{/* Employee */}
							<div className='col-12'>
								<Card className='mb-2 bg-l10-primary' shadow='sm'>
									<CardHeader className='bg-l25-primary'>
										<CardLabel icon='Person Add' iconColor='primary'>
											<CardTitle className='text-primary'>Professionnel(le)</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<FormGroup id='employee.id'>
											<Select
												placeholder='Veuillez choisir...'
												value={eventAdding && !isAdmin ? auth.user.id : formik.values?.employee?.id} // Les nouveaux RDV (eventAdding) créés par un pro. (!isAdmin) ont forcément l'id du pro.
												onChange={formik.handleChange}
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
										</FormGroup>
									</CardBody>
								</Card>
							</div>

                            {/* Tout le monde peut ajouter un nouveau RDV (eventAdding est true), 
                            mais si eventAdding est false, seuls l'auteur du RVD et l'admin peuvent sauvegarder */}
                            <div className='d-flex align-items-center justify-content-between py-3 mb-4'>
                                {(eventAdding || (!eventAdding && (isAdmin || isAuthor))) &&
                                <div>
                                    <Button 
                                        color='info' 
                                        icon='Save'
                                        type='submit'
                                        disabled={formik?.values?.name === '' 
                                            || formik.values?.employee?.id === '' 
                                            || formik.values?.start === '' 
                                            || !formik.values?.name 
                                            || !formik.values?.employee?.id 
                                            || !formik.values?.start }
                                        >
                                        Sauvegarder
                                    </Button>
                                </div>
                                }

                                {/* Pour supprimer un RDV : eventAdding doit être faux (RDV existant only) 
                                et le user doit être admin (isAdmin) ou le pro. responsable du RDV (isAuthor) */}
                                { !eventAdding && (isAdmin || isAuthor) &&
                                <div>
                                    <Button 
                                        color='danger' 
                                        icon='Delete'
                                        isOutline
                                        onClick={ () => setTriggerModal(true)}
                                        >
                                        Supprimer
                                    </Button>
                                </div>
                                }
                            </div>
						</div>
					</OffCanvasBody>
				</OffCanvas>}


                {/* CLIENT : S'inscrire à un RDV */}
                {eventItem && 
                <OffCanvas
					setOpen={(status) => {
						setToggleClientCanvas(status);
						setEventAdding(status);
					}}
					isOpen={toggleClientCanvas}
					titleId='canvas-title'>
					<OffCanvasHeader
						setOpen={(status) => {
							setToggleClientCanvas(status);
							setEventAdding(status);
						}}
						className='p-4'>
						<OffCanvasTitle id='canvas-title' tag='h3'>
							S'inscrire au rendez-vous
						</OffCanvasTitle>
					</OffCanvasHeader>
					<OffCanvasBody tag='form' onSubmit={clientFormik.handleSubmit} className='p-4'>

                        <div className='d-flex justify-content-center mb-3'>
                            <Avatar
                                srcSet={eventItem?.employee?.data?.attributes?.avatar ? `${API_URL}${eventItem?.employee?.data?.attributes?.avatar?.data?.attributes?.url}` : `${defaultAvatar}`}
                                src={eventItem?.employee?.data?.attributes?.avatar ? `${API_URL}${eventItem?.employee?.data?.attributes?.avatar?.data?.attributes?.url}` : `${defaultAvatar}`}
                                color={eventItem?.employee?.data?.attributes?.color}
                                shadow='default'
                            />
                        </div>
                        <div className='d-flex flex-column align-items-center mb-5'>
                            <div className='h2 fw-bold text-capitalize'>{`${eventItem?.employee?.data?.attributes?.name} ${eventItem?.employee?.data?.attributes?.surname}`}</div>
                            <div className='h5 text-muted opacity-75 mb-4'>{eventItem?.employee?.data?.attributes?.occupation || 'Professionel(le)'}</div>
                            <div className='h6 text-muted opacity-50'>{eventItem?.employee?.data?.attributes?.email}</div>
                            <div className='h6 text-muted opacity-50'>{eventItem?.employee?.data?.attributes?.phone}</div>
                        </div> 

						<div className='row g-4'> 
							{/* Name */}
							<div className='col-12'>
                                <InputGroup className='mb-2'>
                                    <InputGroupText>
                                        {eventItem?.icon ? <Icon icon={eventItem?.icon} size='2x' color='primary' /> : 'Intitulé' }
                                    </InputGroupText>

                                    <Input
                                        aria-label='name'
                                        size='lg'
                                        value={eventItem?.name}
                                        readOnly
                                    />
                                </InputGroup>
							</div>

                            {/* Description */}
                            {formik.values.description && 
                            <div className='col-12'>
                                <Textarea
                                    value={eventItem?.description}
                                    className='py-3 px-4'
                                    readOnly
                                />
                            </div>}

                            <InputGroup className='mb-2'>
                                <InputGroupText>Début</InputGroupText>
                                <Input
                                    id='debut'
                                    aria-label='début'
                                    size='lg'
                                    value={moment(eventItem?.start).format('ddd Do MMMM YYYY, à LT')}
                                    readOnly
                                />
                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <InputGroupText>Fin</InputGroupText>
                                <Input
                                    id='fin'
                                    aria-label='fin'
                                    size='lg'
                                    value={moment(eventItem?.end).format('ddd Do MMMM YYYY, à LT')}
                                    readOnly
                                />
                            </InputGroup>

                            {eventIsFull
                            ?
                            <div className="col-12">
                                <Alert
                                    color='danger'
                                    isLight
                                    icon='Info'
                                    className='mb-1'
                                >
                                    Ce rendez-vous est complet.
                                </Alert>
                            </div>
                            :
                            <InputGroup className='mb-2'>
                                <InputGroupText>Places restantes</InputGroupText>
                                <Input
                                    id='places-restantes'
                                    aria-label='places restantes'
                                    size='lg'
                                    value={parseInt(eventItem?.maximum_horses) - eventItem?.horses?.data.length}
                                    readOnly
                                />
                            </InputGroup>
                            }   

                            {/* Horses */}
							{!eventIsFull &&
                            <div className='col-12'>
								{auth.user.horses.length > 0
                                ?
                                <Card className='mb-2 bg-l10-primary' shadow='sm'>
									<CardHeader className='bg-l25-primary'>
										<CardLabel icon='Horse' iconColor='primary'>
											<CardTitle className='text-primary'>Inscription</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody> 
                                        <div className='col-12'>
                                        {/* Only registered horses owned by the auth user */}
                                        {registeredHorses.filter(h => h?.ownerId == auth.user.id).map( horse => (
                                            <Button
                                                value={horse?.id}
                                                icon='Close'
                                                color='info'
                                                className='mr-3 mb-4'
                                                onClick={() => {
                                                    setRegisteredHorses(registeredHorses.filter(h=>h?.id != horse?.id))
                                                }}
                                            >
                                                {horse?.name}
                                            </Button>
                                        ))}
                                        </div>

										{auth.user.horses.filter( horse => !registeredHorses.some(h => h?.id == horse?.id)).length > 0 &&
										<FormGroup id='horses' >
                                            <Select
												placeholder='Veuillez choisir un cheval...'
												//value={registeredHorses}
                                                id='horses'
                                                name='horses'
                                                disabled={registeredHorses.length >= eventItem?.maximum_horses}
                                                onChange={ (e) => {
                                                    const newHorse = { 
                                                        id: e.target.value.split(';')[0], 
                                                        name: e.target.value.split(';')[1], 
                                                        ownerId: e.target.value.split(';')[2]
                                                    };
                                                    setRegisteredHorses(old => [...old, newHorse])
                                                }}
												ariaLabel='Horse select'>
												{auth.user.horses.filter( horse => !registeredHorses.some(h => h.id == horse.id)).map( horse => (
                                                    <Option
                                                        key={horse?.name}
                                                        value={`${horse.id};${horse?.name};${auth.user.id}`}>
                                                        {horse?.name}
                                                    </Option>
												))
                                                }
											</Select>
										</FormGroup>                        
                                        }
									</CardBody>
								</Card>
                                :
                                <Alert
                                    color='warning'
                                    isLight
                                    icon='Info'
                                >
                                    Vous n'avez aucun cheval enregistré.
                                </Alert>}
							</div>
                            }  

                            {!eventIsFull && auth.user.horses.length > 0 &&
                            <div className='d-flex justify-content-between py-3 mb-4'>
                                <div>
                                    <Button 
                                        color='info' 
                                        icon='Save'
                                        type='submit'
                                        // disabled={
                                        //     clientFormik.values.horses?.length === 0
                                        //     || clientFormik.values.horses.some( horse => horse?.id === '' || !horse?.id) }
                                        >
                                        Confirmer
                                    </Button>
                                </div>
                            </div>}
						</div>
					</OffCanvasBody>
				</OffCanvas>}

				<CommonRightPanel
                    setOpen={setToggleRightPanel} 
                    isOpen={toggleRightPanel} 
                    employee={selectedEmployee}
                    employees={employees}
                    appointments={appointments}
                />

                <Modal
                    isOpen={triggerModal}
                    setIsOpen={setTriggerModal}
                    titleId='confirmationModal'
                    isCentered isAnimation >
                        <ModalHeader setIsOpen={setTriggerModal}>
                            <ModalTitle id='confirmationModal'>Supprimer un rendez-vous</ModalTitle>
                        </ModalHeader>
                        <ModalBody className='text-center new-line'>{`Voulez-vous supprimer ce rendez-vous ?\nCe rendez-vous sera définitivement supprimé du calendrier.`}</ModalBody>
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
                                    handleDelete();
                                    setTriggerModal(false);
                                } }>
                                Confirmer
                            </Button>
                        </ModalFooter>
                </Modal>

			</Page>
		</PageWrapper>
	);
};

export default DashboardBookingPage;
