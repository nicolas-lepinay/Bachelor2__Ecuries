// 📚 Librairies :
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
import { adminMenu, clientMenu, demoPages } from '../../menu';
import CommonApprovedAppointmentChart from '../common/CommonApprovedAppointmentChart';
import CommonPercentageOfLoadChart from '../common/CommonPercentageOfLoadChart';
import CommonDashboardBookingLists from '../common/BookingComponents/CommonDashboardBookingLists';
import CommonRightPanel from '../common/BookingComponents/CommonRightPanel';
import showNotification from '../../components/extras/showNotification';

// 🛠️ Hooks :
import useMinimizeAside from '../../hooks/useMinimizeAside';
import useDarkMode from '../../hooks/useDarkMode';
import useAuth from '../../hooks/useAuth';
import useFetchHorses from '../../hooks/useFetchHorses';
import useFetchActivities from '../../hooks/useFetchActivities';
import useFetchAppointments from '../../hooks/useFetchAppointments';
import useFetchEmployees from '../../hooks/useFetchEmployees'

// 🅰️ Axios :
import axios from 'axios';
import data from '../../common/data/dummyEventsData';

// ⚙️ Strapi's API URL :
const API_URL = process.env.REACT_APP_API_URL;

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

    // Activité active (en cours) :
    const isActiveEvent = event.start <= now && event.end >= now;

    // Activité passée :
    const isPastEvent = event.end < now;

	return (
		<div className='row g-2'>
			<div className='col text-truncate'>
                {isActiveEvent && <Circle color='success' />}
				{!isActiveEvent && event?.icon && <Icon icon={event?.icon} size='lg' className='me-2' />}

				{event?.name || '?'}
			</div>

            <div className='col-auto'>
                <div className='row g-1 align-items-baseline'>
                    <div className='col-auto'>
                        <Avatar 
                            src={event?.horses?.data[0]?.attributes?.avatar ? `${API_URL}${event?.horses?.data[0]?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                            srcSet={event?.horses?.data[0]?.attributes?.avatar ? `${API_URL}${event?.horses?.data[0]?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
                            size={18} 
                        />
                    </div>
                    <small
                        className={classNames('col-auto text-truncate', {
                            'text-dark': !darkModeStatus,
                            'text-white': darkModeStatus,
                        })}>
                        {event?.horses?.data[0]?.attributes?.name}
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

const DashboardActivityPage = () => {
    
    // 🛠️ Hooks :
    const auth = useAuth(); // 🦸
	const { darkModeStatus, themeStatus } = useDarkMode();
	useMinimizeAside();

	const [toggleRightPanel, setToggleRightPanel] = useState(true);

    // Id du rôle 'Admin' :
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; 

    // Boolean isAdmin :
    const isAdmin = Number(auth.user.role.id) === Number(ADMIN_ID);

    // 🐎 Fetch all horses :
    const { 
        data: horses, 
        setData: setHorses } = useFetchHorses();

    // 📅 Fetch all activities :
    const { 
        data: activities, 
        setData: setActivities } = useFetchActivities();

    // 📅 Fetch all appointments :
    const { 
        data: appointments, 
        setData: setAppointments } = useFetchAppointments();

    // 👩‍🚀 Fetch all employees :
    const { 
        data: employees, 
        setData: setEmployees, 
        loading: employeesLoading, 
        error: employeesError } = useFetchEmployees();

    // Activities + Appointments merged :
    const [events, setEvents] = useState([]);

    // console.log(activities)
    // console.log(appointments)
    // console.log(horses)
    // console.log([...activities, ...appointments])

    useEffect( () => {
        // Je merge les activités des chevaux et les rendez-vous (uniquements ceux qui ont des chevaux d'inscrits) dans la variable events: 
        setEvents([ ...activities, ...appointments.filter( appointment => appointment.horses?.data.length > 0) ]);
        // console.log(events)
    }, [activities, appointments])

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
    const [horseList, setHorseList] = useState({});
    const [selectedHorse, setSelectedHorse] = useState({})

    useEffect(() => {
        const list = {};
        horses.map( horse => {
            list[horse.id] = true;
        })
        setHorseList(list);
        horses.length > 0 && setSelectedHorse(horses[0])
    }, [horses])

	// Selected Event
	const [eventItem, setEventItem] = useState(null);
	// Calendar View Mode
	const [viewMode, setViewMode] = useState(Views.MONTH);
	// Calendar Date
	const [date, setDate] = useState(new Date());

	// Activity edit panel status :
	const [toggleInfoActivityCanvas, setToggleInfoActivityCanvas] = useState(false);
	const setInfoActivity = () => setToggleInfoActivityCanvas(!toggleInfoActivityCanvas);

    // Appointment edit panel status :
    const [toggleInfoAppointmentCanvas, setToggleInfoAppointmentCanvas] = useState(false);
	const setInfoAppointment = () => setToggleInfoAppointmentCanvas(!toggleInfoAppointmentCanvas);

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

    const handleHorseListChange = (horse) => {
        setHorseList( {...horseList, [horse.id]: !horseList[horse.id] })
    }

    const handleSelectedHorse = (horse) => {
        setSelectedHorse(horse)
    }

	useEffect(() => {
		if (eventAdding) {
			setInfoActivity();
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

        // Activité active (en cours) :
		const isActiveEvent = start <= now && end >= now;

        // Activité passée :
		const isPastEvent = end < now;

		const color = event?.horses?.data[0]?.attributes?.color;

		return {
			className: classNames({
				[`bg-l${darkModeStatus ? 'o25' : '10'}-${color} text-${color}`]: color,
				[`border border-success`]: isActiveEvent,
				'opacity-50': isPastEvent,
			}),
		};
	};

    // Formulaire pour ajout/modification d'activité :
	const formikActivity = useFormik({
		initialValues: {
            id: '',
			name: '',
			start: '',
			end: '',
            description: '',
            icon: '',
            horses: {
                id: '',
            },
		},
		onSubmit: (values) => {
            // Validation :
            if(values.name === '' 
                || !values?.name 
                || values?.start === '' 
                || !values?.start 
                || values?.end === '' 
                || !values?.end === '' 
                || values?.horses?.id === '' 
                || !values?.horses?.id)
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

            // Cast du horseId en int :
            values.horses.id = Number(values.horses.id);

            // ✨ AJOUT D'UN NOUVEL EVENEMENT ✨
			if (eventAdding) {
                !values.icon && delete values["icon"];
                //handlePost(values)
            // ✨ MODIFICATION D'UN EVENEMENT EXISTANT ✨
			} else {
                //handleUpdate(values);
            }
			setToggleInfoActivityCanvas(false);
			setEventAdding(false);
			setEventItem(null);
			formikActivity.setValues({});
            formikAppointment.setValues({});
		},
	});

    //Formulaire pour modification de rendez-vous :
    const formikAppointment = useFormik({
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
		onSubmit: (values) => {
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

            // ✨ MODIFICATION DU RENDEZ-VOUS : ✨
            //handleUpdate(values);
            
			setToggleInfoAppointmentCanvas(false);
			setEventAdding(false);
			setEventItem(null);
			formikAppointment.setValues({});
            formikActivity.setValues({})
		},
	});

	useEffect(() => {
		if (eventItem) {
            eventItem.hasOwnProperty('confirmed') // L'event est un rendez-vous...
            ?
            formikAppointment.setValues({
				...formikAppointment.values,
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
			})
            :
			formikActivity.setValues({
				...formikActivity.values,
				id: eventItem.id,
				name: eventItem?.name,
				start: moment(eventItem.start).format(),
				end: moment(eventItem.end).format(),
                horses: {
                    id: eventItem?.horses?.data[0]?.id,
                },
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
		<PageWrapper title={`${clientMenu.dashboards.dashboards.text} ${clientMenu.dashboards.dashboards.subMenu.dashboardActivity.text}`}>
			<SubHeader>
				<SubHeaderLeft>
					<Button
						icon='HorseVariant'
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
							{horses && horses.map( (horse) => (
								<div key={horse.name} className='col-auto'>
									<Popovers
										trigger='hover'
                                        placement='bottom'
										desc={
											<>
												<div className='h6'><b>{horse.name}</b></div>
												<div>
													<span>Activités : </span>
                                                    {/* <b>
													{
														activities.filter(
															(activity) =>
																activity?.horses?.data[0].id ===
																horse.id,
														).length
													}
                                                    </b> */}
												</div>
											</>
										}>
										<div className='position-relative'>
											<Avatar
												srcSet={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
												src={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
												color={horse?.color}
												size={64}
												border={4}
												className='cursor-pointer'
												borderColor={
													horseList[horse.id]
														? 'info'
														: themeStatus
												}

                                                onClick={ () => {
                                                    handleHorseListChange(horse);
                                                    handleSelectedHorse(horse);
                                                } }
                                                onMouseEnter={ () => {
                                                    handleSelectedHorse(horse);
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
                                            events={events.filter(
												(event) => event.horses.data.some(horse => horseList[horse.id] === true)
											)}
											defaultView={Views.WEEK}
											views={views}
											view={viewMode}
											date={date}
											onNavigate={(_date) => setDate(_date)}
											scrollToTime={new Date(1970, 1, 1, 6)}
											defaultDate={new Date()}
											onSelectEvent={(event) => {
												setEventItem(event);
												event.hasOwnProperty('confirmed') ? setInfoAppointment() : setInfoActivity();
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

                {/* PANNEAUX DE DROITE - POUR LES ACTIVITIES */}
				<OffCanvas
					setOpen={(status) => {
						setToggleInfoActivityCanvas(status);
						setEventAdding(status);
					}}
					isOpen={toggleInfoActivityCanvas}
					titleId='canvas-title'>
					<OffCanvasHeader
						setOpen={(status) => {
							setToggleInfoActivityCanvas(status);
							setEventAdding(status);
						}}
						className='p-4'>
						<OffCanvasTitle id='canvas-title' tag='h3'>
							{eventAdding ? 'Ajouter une activité' : "Modifier l'activité"}
						</OffCanvasTitle>
					</OffCanvasHeader>
					<OffCanvasBody tag='form' onSubmit={formikActivity.handleSubmit} className='p-4'>
						<div className='row g-4'>

							{/* Name */}
							<div className='col-12'>
                                <InputGroup className='mb-2'>
                                    <InputGroupText>Nom</InputGroupText>
                                    <Input
                                        id='name'
                                        placeholder="Nom de l'activité"
                                        aria-label='name'
                                        size='lg'
                                        onChange={formikActivity.handleChange}
                                        value={formikActivity.values.name}
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
                                            onChange={formikActivity.handleChange}
                                            value={formikActivity.values.description}
                                        />
                                    </AccordionItem>
                                    <AccordionItem
                                        id='ico'
                                        title='Icône'
                                        icon='HorseVariant'>
                                        {!formikActivity.values.noIcon &&
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
                                                        color={formikActivity.values.icon === item.icon ? `success` : 'info'}
                                                        forceFamily='material'
                                                        icon={item.icon}
                                                        name='icon'
                                                        isLink isActive
                                                        key={item.icon}
                                                        size='lg'
                                                        value={item.icon}
                                                        onClick={() => formikActivity.setFieldValue("icon", `${item.icon}`)}
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
														checked={formikActivity.values.eventAllDay}
														onChange={formikActivity.handleChange}
													/>
												</FormGroup>
											</div>
                                            }
											<div className='col-12'>
												<FormGroup
													id='start'
													label={
														formikActivity.values.eventAllDay
															? 'Date'
															: 'Date de début'
													}>
													<Input
														type={
															formikActivity.values.eventAllDay
																? 'date'
																: 'datetime-local'
														}
														value={
															formikActivity.values.eventAllDay
																? moment(
																		formikActivity.values.start,
																  ).format(moment.HTML5_FMT.DATE)
																: moment(
																		formikActivity.values.start,
																  ).format(
																		moment.HTML5_FMT
																			.DATETIME_LOCAL,
																  )
														}
														onChange={formikActivity.handleChange}
													/>
												</FormGroup>
											</div>

											{!formikActivity.values.eventAllDay && (
												<div className='col-12'>
													<FormGroup id='end' label='Date de fin'>
														<Input
															type='datetime-local'
															value={moment(
																formikActivity.values.end,
															).format(
																moment.HTML5_FMT.DATETIME_LOCAL,
															)}
															onChange={formikActivity.handleChange}
														/>
													</FormGroup>
												</div>
											)}
										</div>
									</CardBody>
								</Card>
							</div>

							{/* Horse */}
							<div className='col-12'>
								<Card className='mb-2 bg-l10-primary' shadow='sm'>
									<CardHeader className='bg-l25-primary'>
										<CardLabel icon='Person Add' iconColor='primary'>
											<CardTitle className='text-primary'>Pensionnaire</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<FormGroup id='horses.id'>
											<Select
												placeholder='Veuillez choisir...'
												value={formikActivity.values?.horses?.id}
												onChange={formikActivity.handleChange}
												ariaLabel='Horse select'>
												{horses.map( horse => (
													<Option
														key={horse.name}
														value={horse.id}>
														{horse.name}
													</Option>
												))}
											</Select>
										</FormGroup>
									</CardBody>
								</Card>
							</div>

                            <div className='d-flex justify-content-between py-3 mb-4'>
                                <div>
                                    <Button 
                                        color='info' 
                                        icon='Save'
                                        type='submit'
                                        disabled={formikActivity?.values?.name === '' 
                                            || formikActivity.values?.employee?.id === '' 
                                            || formikActivity.values?.start === '' 
                                            || !formikActivity.values?.name 
                                            || !formikActivity.values?.employee?.id 
                                            || !formikActivity.values?.start }
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

                {/* PANNEAUX DE DROITE - POUR LES APPOINTMENTS */}
				<OffCanvas
					setOpen={(status) => {
						setToggleInfoAppointmentCanvas(status);
						setEventAdding(status);
					}}
					isOpen={toggleInfoAppointmentCanvas}
					titleId='canvas-title'>
					<OffCanvasHeader
						setOpen={(status) => {
							setToggleInfoAppointmentCanvas(status);
							setEventAdding(status);
						}}
						className='p-4'>
						<OffCanvasTitle id='canvas-title' tag='h3'>
							Modifier l'évènement
						</OffCanvasTitle>
					</OffCanvasHeader>

					<OffCanvasBody tag='form' onSubmit={formikAppointment.handleSubmit} className='p-4'>
						<div className='row g-4'>
                            {/* Confirm event */}
                            {/* (Uniquement Admin */}
                            {isAdmin &&
                                <div className='col-12'>
                                    <Dropdown>
                                        <DropdownToggle hasIcon={false}>
                                            <Button
                                                isLight
                                                color={formikAppointment.values.confirmed ? 'success' : 'danger'}
                                                icon='Circle'
                                                className='text-nowrap'>
                                                {formikAppointment.values.confirmed ? 'Confirmé' : 'En attente de confirmation'}
                                            </Button>
                                        </DropdownToggle>
                                        
                                        <DropdownMenu >
                                            <DropdownItem 
                                                name='confirmed'
                                                value={true}
                                                onClick={() => formikAppointment.setFieldValue("confirmed", true)}
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
                                                onClick={() => formikAppointment.setFieldValue("confirmed", false)}
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
                                        onChange={formikAppointment.handleChange}
                                        value={formikAppointment.values.name}
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
                                            onChange={formikAppointment.handleChange}
                                            value={formikAppointment.values.description}
                                        />
                                    </AccordionItem>
                                    <AccordionItem
                                        id='ico'
                                        title='Icône'
                                        icon='HorseVariant'>
                                        {!formikAppointment.values.noIcon &&
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
                                                        color={formikAppointment.values.icon === item.icon ? `success` : 'info'}
                                                        forceFamily='material'
                                                        icon={item.icon}
                                                        name='icon'
                                                        isLink isActive
                                                        key={item.icon}
                                                        size='lg'
                                                        value={item.icon}
                                                        onClick={() => formikAppointment.setFieldValue("icon", `${item.icon}`)}
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
														checked={formikAppointment.values.eventAllDay}
														onChange={formikAppointment.handleChange}
													/>
												</FormGroup>
											</div>
                                            }
											<div className='col-12'>
												<FormGroup
													id='start'
													label={
														formikAppointment.values.eventAllDay
															? 'Date'
															: 'Date de début'
													}>
													<Input
														type={
															formikAppointment.values.eventAllDay
																? 'date'
																: 'datetime-local'
														}
														value={
															formikAppointment.values.eventAllDay
																? moment(
																		formikAppointment.values.start,
																  ).format(moment.HTML5_FMT.DATE)
																: moment(
																		formikAppointment.values.start,
																  ).format(
																		moment.HTML5_FMT
																			.DATETIME_LOCAL,
																  )
														}
														onChange={formikAppointment.handleChange}
													/>
												</FormGroup>
											</div>

											{!formikAppointment.values.eventAllDay && (
												<div className='col-12'>
													<FormGroup id='end' label='Date de fin'>
														<Input
															type='datetime-local'
															value={moment(
																formikAppointment.values.end,
															).format(
																moment.HTML5_FMT.DATETIME_LOCAL,
															)}
															onChange={formikAppointment.handleChange}
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
												value={formikAppointment.values?.employee?.id}
												onChange={formikAppointment.handleChange}
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

                            <div className='d-flex justify-content-between py-3 mb-4'>
                                <div>
                                    <Button 
                                        color='info' 
                                        icon='Save'
                                        type='submit'
                                        disabled={formikAppointment?.values?.name === '' 
                                            || formikAppointment.values?.employee?.id === '' 
                                            || formikAppointment.values?.start === '' 
                                            || !formikAppointment.values?.name 
                                            || !formikAppointment.values?.employee?.id 
                                            || !formikAppointment.values?.start }
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




				{/* <CommonRightPanel
                    setOpen={setToggleRightPanel} 
                    isOpen={toggleRightPanel} 
                    employee={selectedHorse}
                    employees={horses}
                    appointments={activities}
                /> */}

                <Modal
                    isOpen={triggerModal}
                    setIsOpen={setTriggerModal}
                    titleId='confirmationModal'
                    isCentered isAnimation >
                        <ModalHeader setIsOpen={setTriggerModal}>
                            <ModalTitle id='confirmationModal'>Voulez-vous supprimer cette activité ?</ModalTitle>
                        </ModalHeader>
                        <ModalBody className='text-center new-line'>Cette activité sera définitivement supprimée du calendrier.</ModalBody>
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
                                    // handleDelete();
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

export default DashboardActivityPage;
