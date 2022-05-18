import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';

import { getUserDataWithId } from '../../../common/data/userDummyData';

// 🛠️ Hooks :
import useAuth from '../../../hooks/useAuth';
import useFetchHorses from '../../../hooks/useFetchHorses';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';

import Popovers from '../../../components/bootstrap/Popovers';
import Avatar from '../../../components/Avatar';
import defaultHorseAvatar from '../../../assets/img/horse-avatars/defaultHorseAvatar.webp';
import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';

import Icon from '../../../components/icon/Icon';
import { demoPages } from '../../../menu';
import Badge from '../../../components/bootstrap/Badge';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Alert from '../../../components/bootstrap/Alert';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';

import Chart from '../../../components/extras/Chart';
import dummyEventsData from '../../../common/data/dummyEventsData';
import { priceFormat } from '../../../helpers/helpers';
import EVENT_STATUS from '../../../common/data/enumEventStatus';
import CommonAvatarTeam from '../../../components/common/CommonAvatarTeam';
import COLORS from '../../../common/data/enumColors';
import useTourStep from '../../../hooks/useTourStep';

function HorsePage() {

    const { darkModeStatus, themeStatus } = useDarkMode();

    // Horse's ID :
    const { id } = useParams();

    // ⚙️ Strapi's API URL :
    const API_URL = process.env.REACT_APP_API_URL;
    
    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'
    const data = getUserDataWithId(2);

    // 🦸 User:
    const auth = useAuth();

    const isAdmin = auth.user && Number(auth.user.role.id) === Number(ADMIN_ID);
    const isPro = auth.user && Number(auth.user.role.id) === Number(PRO_ID);
    const isClient = auth.user && Number(auth.user.role.id) === Number(CLIENT_ID);

    // 🐎 Fetch horse by ID :
    const { 
        loading: loadingHorse,
        data: horse, 
        setData: setHorse } = useFetchHorses({ filters: `&filters[id]=${id}`, isUnique: true });

    // Sort health_record table by date :
    const { items: health_items, requestSort, getClassNamesFor } = useSortableData(horse.health_record ? horse.health_record : []);

    // Pagination :
    const [healthPerPage, setHealthPerPage] = useState(PER_COUNT['3']);
    const [healthCurrentPage, setHealthCurrentPage] = useState(1);

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
    
    // Chargement :
    if(loadingHorse)
        return (
            <PageWrapper title='Chargement...'>
                <div className='position-absolute top-50 start-50 translate-middle'>
                    <CircularProgress color="info" />
                </div>
            </PageWrapper>
        );

    // Accès interdit :
    if(horse.owner && isClient && Number(horse.owner.data.id) !== Number(auth.user.id))
        return <Navigate to="/"/>

	return (
		<PageWrapper title={horse.name}>

			{/* <SubHeader>
				<SubHeaderLeft>
					<Button
						color='info'
						isLink
						icon='ArrowBack'
						tag='a'
						to={`../${demoPages.appointment.subMenu.employeeList.path}`}>
						Back to List
					</Button>
					<SubheaderSeparator />
					<CommonAvatarTeam isAlignmentEnd>
						<strong>Sports</strong> Team
					</CommonAvatarTeam>
				</SubHeaderLeft>
				<SubHeaderRight>
					<span className='text-muted fst-italic me-2'>Last update:</span>
					<span className='fw-bold'>13 hours ago</span>
				</SubHeaderRight>
			</SubHeader> */}
			<Page container='fluid'>

				<div className="row d-flex justify-content-center">

                    <div className="col-xl-9">
                        <div className='pt-3 pb-5 d-flex align-items-center'>
                            <span className='display-4 fw-bold me-3 text-capitalize font-family-playfair'>{horse.name}</span>
                            <span className={`border border-${horse.color} border-2 text-${horse.color} fw-bold px-3 py-2 rounded`}>
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
                                            <div className='col-12'>
												<div className='d-flex align-items-end mb-2'>
													<div className='flex-shrink-0'>
														<Icon icon='PersonHeart' size='2x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='text-muted'>
															Propriétaire
														</div>
														<div className='fw-bold fs-5 mb-0 text-capitalize font-family-playfair'>
															{horse.owner.data.attributes.name} {horse.owner.data.attributes.surname}
														</div>
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
                                                            {horse.owner.data.attributes.email || 'Non-renseigné'}
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
                                                            {horse.owner.data.attributes.phone || 'Non-renseigné'}  
														</div>
													</div>
												</div>
											</div>

										</div>
									</div>
								</div>
							</CardBody>
						</Card>

                        <Card>
							<CardHeader>
								<CardLabel icon='AutoAwesome' iconColor='warning'>
									<CardTitle>Apprentissage</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								{data.services ? (
									<div className='row g-2'>
										{data?.services.map((service) => (
											<div key={service.name} className='col-auto'>
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
								) : (
									<div className='row'>
										<div className='col'>
											<Alert
												color='warning'
												isLight
												icon='Report'
												className='mb-0'>
												No results to show
											</Alert>
										</div>
									</div>
								)}
							</CardBody>
						</Card>

					</div>

					<div className='col-xl-7'>
						<Card className='shadow-3d-primary'>
							<CardHeader borderSize={1}>
								<CardLabel icon='AutoStories' iconColor='success'>
									<CardTitle tag='h4' className='h5 mx-2'>
										Carnet de santé
									</CardTitle>
								</CardLabel>
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
                                                        // onClick={handleUpcomingDetails}
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
                                                <td className='align-top'>{item.message}</td>

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
                                                <th>Heure</th>
                                                <th>Intitulé</th>
                                                <th>Intitulé</th>

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
                                                        // onClick={handleUpcomingDetails}
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
                                                            className='cursor-pointer'
                                                        />
                                                    </div>
                                                    </Popovers>
                                                </td>
                                    
                                                {/* <td>
                                                    <Icon icon={item.icon} size='lg' color='dark' />
                                                </td> */}
                                                <td className='align-top'>{item.message}</td>

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
					</div>

				</div>
			</Page>
		</PageWrapper>
	);
}

export default HorsePage