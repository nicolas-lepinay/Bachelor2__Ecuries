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
import defaultHorseAvatar from '../../assets/img/horse-avatars/defaultHorseAvatar.webp';

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
import CommonRightHorsePanel from '../common/BookingComponents/CommonRightHorsePanel';
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
const APPOINTMENTS_ROUTE = process.env.REACT_APP_APPOINTMENTS_ROUTE;
const ACTIVITIES_ROUTE = process.env.REACT_APP_ACTIVITIES_ROUTE;

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
                        <AvatarGroup className='me-3' size={18}>
                            {event?.horses?.data.map( horse => (
                                <Avatar
                                    key={horse.id}
                                    srcSet={horse?.attributes?.avatar ? `${API_URL}${horse?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
                                    src={horse?.attributes?.avatar ? `${API_URL}${horse?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
                                    userName={horse?.attributes?.name}
                                    color={horse?.attributes?.color}
                                />
                            ))}
						</AvatarGroup>
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

    // RDV confirmé (undefined pour les activités) :
    const isConfirmedEvent = event?.confirmed;

    // Event actif (en cours) :
    const isActiveEvent = event.start <= now && event.end >= now;

    // Event passé :
    const isPastEvent = event.end < now;

	return (
		<div className='row g-2'>
			<div className='col-12 text-truncate'>
                {isActiveEvent && <Circle color='success' />}
                {isConfirmedEvent === false && !isPastEvent && <Circle color='danger' />}
				{(isConfirmedEvent === true || isConfirmedEvent === undefined || isPastEvent) && !isActiveEvent && event?.icon && <Icon icon={event?.icon} size='lg' className='me-2' />}

				{event?.name || event?.employee?.data?.attributes?.occupation}
			</div>
			{event?.employee?.data && (
				<div className='col-12'>
					<div className='row g-1 align-items-baseline'>
                        <div className='col-auto'>
                            <AvatarGroup className='me-3' size={18}>
                                {event?.horses?.data.map( horse => (
                                    <Avatar
                                        key={horse.id}
                                        srcSet={horse?.attributes?.avatar ? `${API_URL}${horse?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
                                        src={horse?.attributes?.avatar ? `${API_URL}${horse?.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
                                        userName={horse?.attributes?.name}
                                        color={horse?.attributes?.color}
                                    />
                                ))}
                            </AvatarGroup>
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
        setData: setEmployees } = useFetchEmployees();

    // Activities + Appointments merged :
    const [events, setEvents] = useState([]);

    useEffect( () => {
        // Je merge les activités des chevaux et les rendez-vous (uniquements ceux qui ont des chevaux d'inscrits) dans la variable events: 
        setEvents([ ...activities, ...appointments.filter( appointment => appointment.horses?.data.length > 0) ]);
        // console.log(events)
    }, [activities, appointments])

    const icons_appointments = [
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

    const icons_activities = [
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
            icon: 'Psychology',
            description: 'Psychologie',
        }, 
        {
            icon: 'FrontHand',
            description: 'Dressage',
        },
        {
            icon: 'VolunteerActivism',
            description: 'Relation cheval/cavalier',
        }, 
        {
            icon: 'Healing',
            description: 'Rééducation',
        }, 
        {
            icon: 'FitnessCenter',
            description: 'Exercice',
        },
        {
            icon: 'BoomGateUp',
            description: "Saut d'obstacles",
        }, 
        {
            icon: 'GolfCourse',
            description: 'Parcours',
        },
        {
            icon: 'Gymnastics',
            description: 'Voltige',
        },
        {
            icon: 'Gesture',
            description: 'Gestuel',
        },
        {
            icon: 'SportsSoccer',
            description: 'Ballon',
        }, 
        {
            icon: 'Hiking',
            description: 'Randonnée',
        }, 
        {
            icon: 'Park',
            description: 'Promenade',
        },

        {
            icon: 'CleaningServices',
            description: 'Brossage',
        }, 
        {
            icon: 'Games',
            description: 'Jeux',
        },
        {
            icon: 'CameraAlt',
            description: 'Photographie',
        },    
    ]

	// BEGIN :: Calendar
    const [horseList, setHorseList] = useState({}); // List of horses to display on the planning
    const [selectedHorse, setSelectedHorse] = useState({}) // One horse to send to <CommonRightHorsePanel />

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

    const [toggleHorseList, setToggleHorseList] = useState(false);
    
    const fillHorseList = () => {
        const list = {};
        horses.map( horse => list[horse.id] = true)
        setHorseList(list);
    }

    const emptyHorseList = () => {
        const list = {};
        horses.map( horse => list[horse.id] = false)
        setHorseList(list);
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

		// const color = event?.horses?.data[0]?.attributes?.color;

        const selectedHorses = event?.horses?.data.filter( horse => horseList[horse.id] === true); // Uniquement les chevaux dont on affiche le planning
        const color = selectedHorses[0]?.attributes?.color; // La couleur du premier cheval parmi ceux dont on affiche le planning
        
		return {
			className: classNames({
				[`bg-l${darkModeStatus ? 'o25' : '10'}-${color} text-${color}`]: color,
				[`border border-success`]: isActiveEvent,
				'opacity-50': isPastEvent,
			}),
		};
	};

    // Horses selected when creating/modifying an event :
    const [selectedHorses, setSelectedHorses] = useState([]); // [ { id: '', name: '' }, { id: '', name: '' } ]

    // Formulaire pour ajout/modification d'activité :
	const formikActivity = useFormik({
		initialValues: {
            id: '',
			name: '',
            description: '',
            icon: '',
			start: '',
			end: '',
            horses: selectedHorses,
            employee: {
                id: auth.user.id,
            }
		},
		onSubmit: (values, { resetForm  }) => {
            console.log("selectedHorses : ")
            console.log(selectedHorses)
            // Validation :
            if(values.name === '' 
                || !values?.name 
                || values?.start === '' 
                || !values?.start 
                || values?.end === '' 
                || !values?.end 
                || values?.horses.some( horse => horse?.id === '' || !horse?.id) 
                || values?.horses?.length === 0
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

            // ✨ AJOUT D'UN NOUVEL EVENEMENT ✨
			if (eventAdding) {
                !values.icon && delete values["icon"];
                handlePost(values)
            // ✨ MODIFICATION D'UN EVENEMENT EXISTANT ✨
			} else {
                console.log("MODIFICATION D'UNE ACTIVITE : ")
                console.log(values)
                handleUpdate(values, ACTIVITIES_ROUTE);
            }
			setToggleInfoActivityCanvas(false);
			setEventAdding(false);
			setEventItem(null);
            resetForm({ values: ''});
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
		onSubmit: (values, { resetForm  }) => {
            // Validation :
            if(values.name === '' 
            || !values?.name 
            || values?.start === '' 
            || !values?.start 
            || values?.end === '' 
            || !values?.end 
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
            handleUpdate(values, APPOINTMENTS_ROUTE);
            
			setToggleInfoAppointmentCanvas(false);
			setEventAdding(false);
			setEventItem(null);
            resetForm({ values });
            formikActivity.setValues({})
		},
	});

    const handlePost = async (newData) => {
        try {
            const res = await axios.post(`${API_URL}${ACTIVITIES_ROUTE}?populate=employee.avatar&populate=employee.role&populate=horses.owner&populate=horses.avatar`, { data: newData });
            const resData = res.data.data;

            let formattedData = {}
            formattedData = { id: resData.id, ...resData.attributes }

            if(formattedData?.start)
                formattedData.start = new Date(formattedData.start)
            if(formattedData?.end)
                formattedData.end = new Date(formattedData.end)
        
            setActivities( prev => [...prev, formattedData] );
            showNotification(
                'Calendrier.', // title
				"L'activité a été ajoutée au calendrier.", // message
                'success' // type
			);
        } catch(err) {
            console.log("POST | Activities | L'activité n'a pas pu être ajoutée à la base de données. | " + err);
            showNotification(
                'Calendrier.', // title
				"Oops ! Une erreur s'est produite. L'activité n'a pas pu être ajoutée.", // message
                'danger' // type
			);
        }
    }

    const handleUpdate = async (newData, ROUTE) => {
        try {
            const res = await axios.put(`${API_URL}${ROUTE}/${newData.id}?populate=employee.avatar&populate=employee.role&populate=horses.owner&populate=horses.avatar`, { data: newData });
            const resData = res.data.data;

            let formattedData = {}
            formattedData = { id: resData.id, ...resData.attributes }

            if(formattedData?.start)
                formattedData.start = new Date(formattedData.start)
            if(formattedData?.end)
                formattedData.end = new Date(formattedData.end)

            // Loop over the appointments or activities list, find the id of the updated one and replace it :
            if(ROUTE === APPOINTMENTS_ROUTE) {
                const updatedAppointments = appointments.map(item => {
                    if (item.id == formattedData.id)
                        return formattedData; // Returns updated appointment
                    
                    return item; // else returns unmodified appointment 
                });
                setAppointments(updatedAppointments);

            } else if(ROUTE === ACTIVITIES_ROUTE) {
                const updatedActivities = activities.map(item => {
                    if (item.id == formattedData.id)
                        return formattedData; // Returns updated appointment
                    
                    return item; // else returns unmodified appointment 
                });
                setActivities(updatedActivities);
            }
        
            showNotification(
                'Mise à jour.', // title
				"L'évènement a été modifié.", // message
                'success' // type
			);
        } catch(err) {
            ROUTE === APPOINTMENTS_ROUTE && console.log(`UPDATE | Appointment | Le rendez-vous n'a pas pu être modifié dans la base de données. | ` + err);
            ROUTE === ACTIVITIES_ROUTE && console.log(`UPDATE | Activities | L'activité n'a pas pu être modifiée dans la base de données. | ` + err);
            showNotification(
                'Mise à jour.', // title
			    "Oops ! Une erreur s'est produite. L'évènement' n'a pas pu être modifié dans la base de données.", // message
                'danger' // type
			);
        }  
    }

    const handleDelete = async () => {
        if(eventItem?.id) {
            // Si l'event a une propriété 'confirmed', c'est un RDV. Sinon, une activité.
            const ROUTE = eventItem.hasOwnProperty('confirmed') ? APPOINTMENTS_ROUTE : ACTIVITIES_ROUTE;
            try {
                await axios.delete(`${API_URL}${ROUTE}/${eventItem.id}`);

                if(ROUTE === APPOINTMENTS_ROUTE) {
                    setAppointments( appointments => appointments.filter( item => item.id !== eventItem.id))
                    showNotification('Mise à jour.', "Le rendez-vous a été supprimé.", 'success');
                } else if(ROUTE === ACTIVITIES_ROUTE) {
                    setActivities( activity => activity.filter( item => item.id !== eventItem.id))
                    showNotification('Mise à jour.', "L'activité a été supprimée.", 'success');
                }
            } catch (err) {
                console.log("DELETE | Event | L'évènement n'a pas pu être supprimé de la base de données. | " + err);
                showNotification(
                    'Calendrier.', // title
                    "Oops ! Une erreur s'est produite. L'évènement n'a pas pu être supprimé.", // message
                    'danger' // type
                );
            }
        }
    }

	useEffect(() => {
        formikAppointment.setValues({});
        formikActivity.setValues({});

		if (eventItem) {
            // Si l'event est un rendez-vous...
            if(eventItem.hasOwnProperty('confirmed')) {
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
            // ...sinon, l'event est une activité...
            } else {
                const formattedData = [];
                
                eventItem?.horses && 
                eventItem?.horses?.data &&
                eventItem.horses.data.map( item => {
                    formattedData.push({
                        id: item.id, 
                        name: item.attributes.name,
                    })
                })
                setSelectedHorses(formattedData);
                formikActivity.setValues({
                    ...formikActivity.values,
                    id: eventItem.id,
                    name: eventItem?.name,
                    start: moment(eventItem.start).format(),
                    end: moment(eventItem.end).format(),
                    horses: eventItem?.horses?.data || [],
                    employee: {
                        id: eventItem?.employee?.data?.id || auth.user.id,
                    },
                    description: eventItem?.description,
                    icon: eventItem?.icon ? eventItem.icon : 'Block',
                });
            }
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
						icon='Workspaces'
						onClick={() => {
                            setToggleHorseList(!toggleHorseList);
                            toggleHorseList ? fillHorseList() : emptyHorseList();
                        } }
						color={toggleHorseList ? 'light' : 'primary'}
						aria-label='Select or unselect all horses'
                        size='lg'
                        title="Sélectionner / Déselectionner tous les chevaux"
					/>
					<Button
						icon='HorseVariant'
						onClick={() => setToggleRightPanel(!toggleRightPanel)}
						color={toggleRightPanel ? 'primary' : 'light'}
						aria-label='Toggle right panel'
                        size='lg'
                        title="Afficher / Masquer l'aperçu du cheval"
					/>
					<Button
						icon='Today'
						onClick={() => setToggleCalendar(!toggleCalendar)}
						color={toggleCalendar ? 'primary' : 'light'}
						aria-label='Toggle calendar & charts'ù                        
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
												srcSet={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
												src={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
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
                                        icon='Description'>
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
                                        icon='EmojiEvents'>
                                        {icons_activities.map( item => (
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

							{/* Horses */}
							<div className='col-12'>
								<Card className='mb-2 bg-l10-primary' shadow='sm'>
									<CardHeader className='bg-l25-primary'>
										<CardLabel icon='Horse' iconColor='primary'>
											<CardTitle className='text-primary'>Pensionnaires</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody> 
                                        <div className='col-12'>
                                        {selectedHorses.map( horse => (
                                            <Button
                                                value={horse.id}
                                                icon='Close'
                                                color='info'
                                                className='mr-3 mb-4'
                                                onClick={() => setSelectedHorses(selectedHorses.filter(h=>h.id !== horse.id))}
                                            >
                                                {horse.name}
                                            </Button>
                                        ))}
                                        </div>

										{horses.filter( horse => !selectedHorses.some(h => h.id == horse.id)).length > 0 &&
										<FormGroup id='horses' >
                                            <Select
												placeholder='Veuillez choisir...'
												value={selectedHorses}
                                                id='horses'
                                                name='horses'
                                                onChange={ (e) => {
                                                    const newData = [...selectedHorses, { 
                                                        id: e.target.value.split(';')[0], 
                                                        name: e.target.value.split(';')[1], 
                                                    }];
                                                    setSelectedHorses(newData)
                                                    formikActivity.setFieldValue("horses", newData)
                                                }}
												ariaLabel='Horse select'>
												{horses.filter( horse => !selectedHorses.some(h => h.id == horse.id)).map( horse => (
                                                    <Option
                                                        key={horse.name}
                                                        value={`${horse.id};${horse.name}`}>
                                                        {horse.name}
                                                    </Option>
												))
                                                }
											</Select>
										</FormGroup>
                                        }
									</CardBody>
								</Card>
							</div>

                            {/* Employee */}
							<div className='col-12'>
								<Card className='mb-2 bg-l10-info' shadow='sm'>
									<CardHeader className='bg-l25-info'>
										<CardLabel icon='Person Add' iconColor='info'>
											<CardTitle className='text-info'>Professionnel(le)</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<FormGroup id='employee.id'>
											<Select
												placeholder='Veuillez choisir...'
												value={formikActivity.values?.employee?.id}
												onChange={formikActivity.handleChange}
												ariaLabel='Employee select'>
												{employees.map( employee => (
													<Option
														key={employee.id}
														value={employee.id}>
														{employee.name} {employee.surname}
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
                                        || !formikActivity.values?.name 
                                        || formikActivity.values?.start === '' 
                                        || !formikActivity.values?.start
                                        || formikActivity.values?.employee?.id === '' 
                                        || !formikActivity.values?.employee?.id 
                                        || selectedHorses.length === 0
                                        }
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
                                        icon='Description'>
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
                                        icon='EmojiEvents'>
                                        {icons_appointments.map( item => (
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

				<CommonRightHorsePanel
                    setOpen={setToggleRightPanel} 
                    isOpen={toggleRightPanel} 
                    horse={selectedHorse}
                    horses={horses}
                    events={events}
                />

                <Modal
                    isOpen={triggerModal}
                    setIsOpen={setTriggerModal}
                    titleId='confirmationModal'
                    isCentered isAnimation >
                        <ModalHeader setIsOpen={setTriggerModal}>
                            <ModalTitle id='confirmationModal'>Voulez-vous supprimer cet évènement ?</ModalTitle>
                        </ModalHeader>
                        <ModalBody className='text-center new-line'>Cet évènement sera définitivement supprimé du calendrier.</ModalBody>
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

export default DashboardActivityPage;
