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


import Button from '../../components/bootstrap/Button';
import Accordion, { AccordionItem } from '../../components/bootstrap/Accordion';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import Select from '../../components/bootstrap/forms/Select';
import Textarea from '../../components/bootstrap/forms/Textarea';
import InputGroup, { InputGroupText } from '../../components/bootstrap/forms/InputGroup';
import Popovers from '../../components/bootstrap/Popovers';
import Option from '../../components/bootstrap/Option';

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
    )
}

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

	const formik = useFormik({
		initialValues: {
            id: '',
			name: '',
			start: '',
			end: '',
            confirmed: '',
            description: '',
            icon: '',
            employee: {
                id: '',
            },
		},
		onSubmit: (values, { resetForm }) => {
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
            showNotification(
                'Mise à jour.', // title
				"Le rendez-vous a été modifié.", // message
                'success' // type
			);
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
		if (eventItem) {
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
			});
        }
		return () => {};
	}, [eventItem]);
	// END:: Calendar

	const [toggleCalendar, setToggleCalendar] = useState(true);
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
												{/* <div>
													<span>Rendez-vous : </span>
                                                    <b>
													{
														appointments.filter(
															(appointment) =>
																appointment?.employee?.data.id ===
																employee.id,
														).length
													}
                                                    </b>
												</div> */}
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
                                            events={appointments.filter(
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
							{/* <div
								className={classNames({
									'col-xxl-4': !toggleRightPanel,
									'col-12': toggleRightPanel,
								})}>
								<div className='row'>
									<div
										className={classNames(
											{
												'col-xxl-12': !toggleRightPanel,
											},
											'col-md-6',
										)}>
										<CommonApprovedAppointmentChart />
									</div>
									<div
										className={classNames(
											{
												'col-xxl-12': !toggleRightPanel,
											},
											'col-md-6',
										)}>
										<CommonPercentageOfLoadChart />
									</div>
								</div>
							</div> */}
						</div>
					</>
				)}
				{/* <div className='row'>
					<div className='col-12'>
						<CommonDashboardBookingLists />
					</div>
					<div className='col-12'>
						<CommonUpcomingEvents />
					</div>
				</div> */}

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
							{eventAdding ? 'Ajouter un évènement' : "Modifier l'évènement"}
						</OffCanvasTitle>
					</OffCanvasHeader>
					<OffCanvasBody tag='form' onSubmit={formik.handleSubmit} className='p-4'>
						<div className='row g-4'>


                        {/* ICONES */}
							{/* <div className='col-12'>
                                <div>
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
                                                className='mx-3 my-2'
                                                color='info'
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
                                </div>
                            </div> */}

                            {/* Confirm event */}
                            {/* (Uniquement Admin + Uniquement pour la modification d'un évènement existant) */}
                            {isAdmin && !eventAdding &&
                                <div className='col-12'>
                                    <Dropdown>
                                        <DropdownToggle hasIcon={false}>
                                            <Button
                                                isLight
                                                color={formik.values.confirmed ? 'success' : 'danger'}
                                                icon='Circle'
                                                className='text-nowrap'>
                                                {formik.values.confirmed ? 'Confirmé' : 'En attente de confirmation'}
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
                                        value={formik.values.name}
                                    />
                                </InputGroup>
							</div>

                            {/* Description & Icône */}
                            <div className='col-12'>
                                <Accordion id='desc-and-ico' color='primary' className='mb-2' isFlush={false} >
                                    <AccordionItem
                                        id='desc'
                                        title='Description'
                                        icon='Description'>
                                        <Textarea
                                            id='description'
                                            placeholder='Écrire une description...'
                                            onChange={formik.handleChange}
                                            value={formik.values.description}
                                        />
                                    </AccordionItem>
                                    <AccordionItem
                                        id='ico'
                                        title='Icône'
                                        icon='EmojiEvents'>
                                        {!formik.values.noIcon &&
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
                                        }
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
												value={formik.values?.employee?.id}
												onChange={formik.handleChange}
												ariaLabel='Employee select'>
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

                            {/* Confirm event */}
                            {/* (Uniquement Admin + Uniquement pour la modification d'un évènement existant) */}
                                {/* <div className='col-12'>
                                    <Card className={`mt-2 mb-2 bg-l10-${formik.values.confirmed ? 'success' : 'danger'}`} shadow='sm'>
                                        <CardBody>
                                            <FormGroup id='confirmed'>
                                                <ChecksGroup isInline>
                                                    <Checks
                                                        type='switch'
                                                        value='true'
                                                        name='confirmed'
                                                        checked={formik.values.confirmed}
                                                        onChange={formik.handleChange}
                                                        label={formik.values.confirmed ? 'Le rendez-vous est confirmé.' : "Le rendez-vous n'est pas confirmé."}
                                                    />
                                                    <Icon
                                                        icon='Circle'
                                                        className={classNames(
                                                            formik.values.confirmed ? 'text-success' : 'text-danger',
                                                            'animate__animated animate__heartBeat animate__infinite animate__slower',
                                                        )}
                                                    />
                                                </ChecksGroup>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>
                                </div> */}

                            <div className='d-flex justify-content-between py-3 mb-4'>
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

                                { !eventAdding &&
                                    <div className=''>
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
				</OffCanvas>

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
							S'inscrire à un rendez-vous
						</OffCanvasTitle>
					</OffCanvasHeader>
					<OffCanvasBody tag='form' onSubmit={formik.handleSubmit} className='p-4'>
						<div className='row g-4'> 

							{/* Name */}
							<div className='col-12'>
                                <InputGroup className='mb-2'>
                                    <InputGroupText>Intitulé</InputGroupText>
                                    <Input
                                        id='name'
                                        placeholder="Nom de l'évènement"
                                        aria-label='name'
                                        size='lg'
                                        value={formik.values.name}
                                        readOnly
                                    />
                                </InputGroup>
							</div>

                            {/* Description & Icône */}

                            {formik.values.description && 
                            <div className='col-12'>
                                <Textarea
                                    id='description'
                                    placeholder='Écrire une description...'
                                    value={formik.values.description}
                                    readOnly
                                />
                            </div>}

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

											{!formik.values.eventAllDay && (
												<div className='col-12'>
													<FormGroup label='Date de fin'>
														<Input
															type='datetime-local'
                                                            min="2022-05-15T08:30"
                                                            max="2022-05-17T08:30"
                                                            //max={new Date().toISOString().split("T")[0]}
														/>
													</FormGroup>
												</div>
											)}
										</div>
									</CardBody>
								</Card>
							</div>

                            <InputGroup className='mb-2'>
                                <InputGroupText>Début</InputGroupText>
                                <Input
                                    id='name'
                                    placeholder="Nom de l'évènement"
                                    aria-label='name'
                                    size='lg'
                                    value={moment(formik.values.start).format('ddd Do MMMM YYYY, à LT')}
                                    readOnly
                                />
                            </InputGroup>

                            <InputGroup className='mb-2'>
                                <InputGroupText>Fin</InputGroupText>
                                <Input
                                    id='name'
                                    placeholder="Nom de l'évènement"
                                    aria-label='name'
                                    size='lg'
                                    value={moment(formik.values.end).format('ddd Do MMMM YYYY, à LT')}
                                    readOnly
                                />
                            </InputGroup>

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
												value={formik.values?.employee?.id}
												onChange={formik.handleChange}
												ariaLabel='Employee select'>
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

                            {/* Confirm event */}
                            {/* (Uniquement Admin + Uniquement pour la modification d'un évènement existant) */}
                                {/* <div className='col-12'>
                                    <Card className={`mt-2 mb-2 bg-l10-${formik.values.confirmed ? 'success' : 'danger'}`} shadow='sm'>
                                        <CardBody>
                                            <FormGroup id='confirmed'>
                                                <ChecksGroup isInline>
                                                    <Checks
                                                        type='switch'
                                                        value='true'
                                                        name='confirmed'
                                                        checked={formik.values.confirmed}
                                                        onChange={formik.handleChange}
                                                        label={formik.values.confirmed ? 'Le rendez-vous est confirmé.' : "Le rendez-vous n'est pas confirmé."}
                                                    />
                                                    <Icon
                                                        icon='Circle'
                                                        className={classNames(
                                                            formik.values.confirmed ? 'text-success' : 'text-danger',
                                                            'animate__animated animate__heartBeat animate__infinite animate__slower',
                                                        )}
                                                    />
                                                </ChecksGroup>
                                            </FormGroup>
                                        </CardBody>
                                    </Card>
                                </div> */}

                            <div className='d-flex justify-content-between py-3 mb-4'>
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

                                { !eventAdding &&
                                    <div className=''>
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
				</OffCanvas>

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
