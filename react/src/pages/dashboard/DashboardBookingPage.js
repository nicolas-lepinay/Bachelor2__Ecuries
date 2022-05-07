import React, { useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'moment/locale/fr';
import { useFormik } from 'formik';
import { Calendar as DatePicker } from 'react-date-range';

import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../layout/SubHeader/SubHeader';

import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Icon from '../../components/icon/Icon';
import Button from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../components/bootstrap/Card';
import CommonUpcomingEvents from '../common/CommonUpcomingEvents';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../components/bootstrap/OffCanvas';


import Accordion, { AccordionItem } from '../../components/bootstrap/Accordion';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import Select from '../../components/bootstrap/forms/Select';
import Textarea from '../../components/bootstrap/forms/Textarea';
import InputGroup, { InputGroupText } from '../../components/bootstrap/forms/InputGroup';

import Avatar, { AvatarGroup } from '../../components/Avatar';
// Default Avatar :
import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';

import Popovers from '../../components/bootstrap/Popovers';
import {
    CalendarTodayButton,
	CalendarViewModeButtons,
	getLabel,
	getUnitType,
	getViews,
} from '../../components/extras/calendarHelper';
import { demoPages } from '../../menu';
import Option from '../../components/bootstrap/Option';
import CommonApprovedAppointmentChart from '../common/CommonApprovedAppointmentChart';
import CommonPercentageOfLoadChart from '../common/CommonPercentageOfLoadChart';
import CommonDashboardBookingLists from '../common/BookingComponents/CommonDashboardBookingLists';
import CommonRightPanel from '../common/BookingComponents/CommonRightPanel';
import showNotification from '../../components/extras/showNotification';

// 🛠️ Hooks :
import useMinimizeAside from '../../hooks/useMinimizeAside';
import useDarkMode from '../../hooks/useDarkMode';
import useFetch from '../../hooks/useFetch'
import useFetchAppointments from '../../hooks/useFetchAppointments'
import useFetchEmployees from '../../hooks/useFetchEmployees'
import usePost from '../../hooks/usePost';
import useAuth from '../../hooks/useAuth';

// 🖥️ Modal :
import CustomModal from '../../components/CustomModal'
import { confirmation } from '../../modals'

// 🅰️ Axios :
import axios from 'axios';

// ⚙️ Strapi's API URL :
const API_URL = process.env.REACT_APP_API_URL;

const localizer = momentLocalizer(moment);

const now = new Date();

const Circle = () => {

    return(
        <Icon
            icon='Circle'
            className={classNames(
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
                {isActiveEvent && <Circle/>}
                {!isConfirmedEvent && !isPastEvent && <Circle/>}
				{(isConfirmedEvent || isPastEvent) && !isActiveEvent && event?.icon && <Icon icon={event?.icon} size='lg' className='me-2' />}

				{event?.name || event?.employees?.data[0]?.attributes?.occupation}
			</div>

            <div className='col-auto'>
                <div className='row g-1 align-items-baseline'>
                    <div className='col-auto'>
                        <Avatar 
                            src={event?.employees?.data && event?.employees?.data[0]?.attributes?.avatar ? `${API_URL}${event?.employees?.data[0]?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                            srcSet={event?.employees?.data && event?.employees?.data[0]?.attributes?.avatar ? `${API_URL}${event?.employees?.data[0]?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                            size={18} 
                        />
                    </div>
                    <small
                        className={classNames('col-auto text-truncate', {
                            'text-dark': !darkModeStatus,
                            'text-white': darkModeStatus,
                        })}>
                        {event?.employees?.data[0]?.attributes?.name}
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

				{event?.name || event?.employees?.data[0]?.attributes?.occupation}
			</div>
			{event?.employees && (
				<div className='col-12'>
					<div className='row g-1 align-items-baseline'>
						<div className='col-auto'>
                            <Avatar 
                                src={event?.employees?.data && event?.employees?.data[0]?.attributes?.avatar ? `${API_URL}${event?.employees?.data[0]?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                                srcSet={event?.employees?.data && event?.employees?.data[0]?.attributes?.avatar ? `${API_URL}${event?.employees?.data[0]?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                                size={18} 
                            />
						</div>
						<small
							className={classNames('col-auto text-truncate', {
								'text-dark': !darkModeStatus,
								'text-white': darkModeStatus,
							})}>
							{event?.employees?.data[0]?.attributes?.name}
						</small>
					</div>
				</div>
			)}
		</div>
	);
};

const DashboardBookingPage = () => {

    
    // 🛠️ Hooks :
    const fetch = useFetch();
    const post = usePost();
    const auth = useAuth(); // 🦸
	const { darkModeStatus, themeStatus } = useDarkMode();
	useMinimizeAside();

	const [toggleRightPanel, setToggleRightPanel] = useState(true);

    // Id du rôle 'Admin' :
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; 

    // Boolean isAdmin :
    const isAdmin = Number(auth.user.role.id) === Number(ADMIN_ID);

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
            description: 'Aucune icône.'
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
        employees.map( employee => {
            list[employee.id] = true;
        })
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
		setEventAdding(true);
		setEventItem({ start, end });
	};

    const handleEmployeeListChange = (employee) => {
        setEmployeeList( {...employeeList, [employee.id]: !employeeList[employee.id] })
    }

    const handleSelectedEmployee = (employee) => {
        setSelectedEmployee(employee)
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

		const color = isActiveEvent ? 'success' : !isConfirmedEvent ? 'danger' : event?.employees?.data[0]?.attributes?.color;

		return {
			className: classNames({
				[`bg-l${darkModeStatus ? 'o25' : '10'}-${color} text-${color}`]: color,
				'border border-success': isActiveEvent,
                'border border-danger': !isConfirmedEvent,
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
            employees: {
                id: '',
            },
            random: '',
		},
		onSubmit: (values) => {
            // Validation :
            if(values.name === '' 
                || !values?.name 
                || values?.start === '' 
                || !values?.start 
                || values?.end === '' 
                || !values?.end === '' 
                || values?.employees?.id === '' 
                || !values?.employees?.id)
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
            values.employees.id = Number(values.employees.id);

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
			formik.setValues({});
		},
	});

    const handlePost = async (newData) => {
        // ⚙️ Strapi's URL :
        const API_URL = process.env.REACT_APP_API_URL;
        const APPOINTMENTS_ROUTE = process.env.REACT_APP_APPOINTMENTS_ROUTE;

        try {
            const res = await axios.post(`${API_URL}${APPOINTMENTS_ROUTE}?populate=employees.avatar&populate=employees.role&populate=horses.owner`, { data: newData });
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
            console.log("USE POST | Appointment | Le rendez-vous n'a pas pu être ajouté à la base de données. | " + err);
            showNotification(
                'Calendrier.', // title
				"Oops ! Une erreur s'est produite. Le rendez-vous n'a pas pu être ajouté.", // message
                'danger' // type
			);
        }
    }

    const handleUpdate = async (newData) => {
        // ⚙️ Strapi's URL :
        const API_URL = process.env.REACT_APP_API_URL;
        const APPOINTMENTS_ROUTE = process.env.REACT_APP_APPOINTMENTS_ROUTE;

        try {
            const res = await axios.put(`${API_URL}${APPOINTMENTS_ROUTE}/${newData.id}?populate=employees.avatar&populate=employees.role&populate=horses.owner`, { data: newData });
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
            console.log("USE POST | Appointment | Le rendez-vous n'a pas pu être ajouté à la base de données. | " + err);
            showNotification(
                'Mise à jour.', // title
				"Oops ! Une erreur s'est produite. Le rendez-vous n'a pas pu être modifié.", // message
                'danger' // type
			);
        }
    }

    const modalAction = () => {
        console.log("MODAL CLICKED !")
    }

	useEffect(() => {
		if (eventItem) {
			formik.setValues({
				...formik.values,
				id: eventItem.id,
				name: eventItem?.name,
				start: moment(eventItem.start).format(),
				end: moment(eventItem.end).format(),
                employees: {
                    id: eventItem?.employees?.data[0]?.id,
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
		<PageWrapper title={demoPages.appointment.subMenu.dashboard.text}>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						icon='Groups'
						onClick={() => setToggleRightPanel(!toggleRightPanel)}
						color={toggleRightPanel ? 'dark' : 'light'}
						aria-label='Toggle right panel'
					/>
					<Button
						icon='AreaChart'
						onClick={() => setToggleCalendar(!toggleCalendar)}
						color={toggleCalendar ? 'dark' : 'light'}
						aria-label='Toggle calendar & charts'
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
										desc={
											<>
												<div className='h6'><b>{`${employee.name} ${employee.surname}`}</b></div>
												<div>
													<span>Rendez-vous : </span>
                                                    <b>
													{
														appointments.filter(
															(appointment) =>
																appointment?.employees?.data[0].id ===
																employee.id,
														).length
													}
                                                    </b>
												</div>
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
												(appointment) => employeeList[appointment.employees.data[0].id],
											)}
											defaultView={Views.WEEK}
											views={views}
											view={viewMode}
											date={date}
											onNavigate={(_date) => setDate(_date)}
											scrollToTime={new Date(1970, 1, 1, 6)}
											defaultDate={new Date()}
											onSelectEvent={(event) => {
												setInfoEvent();
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
                                        icon='DocumentScanner'>
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
                                        icon='HorseVariant'>
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
										<FormGroup id='employees.id'>
											<Select
												placeholder='Veuillez choisir...'
												value={formik.values?.employees?.id}
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
                            {isAdmin && !eventAdding &&
                            <div className='col-12'>
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
							</div>
                            }

                            <div className='d-flex justify-content-between py-3'>
                                <div className=''>
                                    <Button 
                                        color='info' 
                                        icon='Save'
                                        type='submit'
                                        disabled={formik?.values?.name === '' 
                                            || formik.values?.employees?.id === '' 
                                            || formik.values?.start === '' 
                                            || !formik.values?.name 
                                            || !formik.values?.employees?.id 
                                            || !formik.values?.start }
                                        >
                                        Publier
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

                <CustomModal 
                    state={triggerModal} 
                    setState={setTriggerModal} 
                    src={confirmation.appointment.delete}
                    action={modalAction}
                />

			</Page>
		</PageWrapper>
	);
};

export default DashboardBookingPage;
