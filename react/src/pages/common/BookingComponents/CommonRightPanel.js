import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';

import OffCanvas, { OffCanvasBody } from '../../../components/bootstrap/OffCanvas';
import Avatar, { AvatarGroup } from '../../../components/Avatar';

// Default Avatar :
import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';

import USERS from '../../../common/data/userDummyData';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Icon from '../../../components/icon/Icon';
import Chart from '../../../components/extras/Chart';
import { sales } from '../../../common/data/chartDummyData';
import SERVICES from '../../../common/data/serviceDummyData';
import useDarkMode from '../../../hooks/useDarkMode';
import { irBlack } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

const CommonRightPanel = ({ setOpen, isOpen, employee, employees, appointments }) => {

    // ⚙️ Strapi's API URL :
    const API_URL = process.env.REACT_APP_API_URL;

    const now = new Date();

	const { themeStatus, darkModeStatus } = useDarkMode();

	const APPOINTMENT_STATUS = {
		CONFIRMED: 'Confirmés',
		PENDING: 'En attente',
		PAST: 'Passés',
	};
	const [activeUserAppointmentTab, setActiveUserAppointmentTab] = useState(
		APPOINTMENT_STATUS.CONFIRMED,
	);
	const handleActiveUserAppointmentTab = (tabName) => {
		setActiveUserAppointmentTab(tabName);
	};

    // Filter only this employee's appointments :
    appointments = appointments.filter(
        (appointment) =>
            appointment?.employee?.data.id ===
            employee.id,
    )

    if(!employee.id)
        return (
            <OffCanvas setOpen={setOpen} isOpen={isOpen} isRightPanel>
                <OffCanvasBody className='p-4'>
                    <div className='position-absolute top-50 start-50 translate-middle'>
                        <CircularProgress color="info" />
                    </div>
                </OffCanvasBody>
            </OffCanvas>
    );

	return (
		<OffCanvas setOpen={setOpen} isOpen={isOpen} isRightPanel>
			<OffCanvasBody className='p-4'>
				<div className='row mb-5'>
					<div className='col'>
						<div className='d-flex align-items-center'>
							<AvatarGroup className='me-3'>
								{employees.map( employee => (
									<Avatar
										key={employee.id}
										srcSet={employee?.avatar ? `${API_URL}${employee?.avatar?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
										src={employee?.avatar ? `${API_URL}${employee?.avatar?.formats?.thumbnail?.url}` : `${defaultAvatar}`}
										userName={`${employee?.name} ${employee?.surname}`}
										color={employee?.color}
									/>
								))}
							</AvatarGroup>
							<div className='h5 mb-0 text-muted'>
								<strong>Écuries</strong> de Persévère
							</div>
						</div>
					</div>
					<div className='col-auto'>
						{/* <Dropdown>
							<DropdownToggle hasIcon={false}>
								<Button
									icon='MoreHoriz'
									color={themeStatus}
									hoverShadow='default'
									isLight={darkModeStatus}
								/>
							</DropdownToggle>
							<DropdownMenu isAlignmentEnd>
								<DropdownItem>
									<Button
										color='link'
										icon='Close'
										onClick={() => {
											setOpen(false);
										}}>
										Fermer
									</Button>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown> */}
                        <Button
                            color='light'
                            icon='Close'
                            size='lg'
                            onClick={() => { setOpen(false) }}>
                        </Button>
					</div>
				</div>
				<div className='d-flex justify-content-center mb-3'>
					<Avatar
						srcSet={employee?.avatar ? `${API_URL}${employee?.avatar?.url}` : `${defaultAvatar}`}
                        src={employee?.avatar ? `${API_URL}${employee?.avatar?.url}` : `${defaultAvatar}`}
						color={employee?.color}
						shadow='default'
					/>
				</div>
				<div className='d-flex flex-column align-items-center mb-5'>
					{/* <div className='h2 fw-bold'>{`${USERS.JOHN.name} ${USERS.JOHN.surname}`}</div> */}
                    <div className='h2 fw-bold text-capitalize'>{`${employee?.name} ${employee?.surname}`}</div>
					<div className='h5 text-muted opacity-50'>{employee?.occupation || 'Professionel(le)'}</div>
				</div>
				<div
					className={classNames('rounded-3', {
						'shadow-3d-dark': !darkModeStatus,
						'shadow-3d-light': darkModeStatus,
						'bg-l10-dark': !darkModeStatus,
						'bg-lo50-info': darkModeStatus,
					})}>
					<div className='row row-cols-3 g-3 pb-3 px-3 mt-0'>
						{Object.keys(APPOINTMENT_STATUS).map((key) => (
							<div
								key={APPOINTMENT_STATUS[key]}
								className='col d-flex flex-column align-items-center'>
								<Button
									color={
										(darkModeStatus &&
											activeUserAppointmentTab === APPOINTMENT_STATUS[key]) ||
										!darkModeStatus
											? 'dark'
											: null
									}
									className='w-100 text-uppercase'
									rounded={1}
									onClick={() =>
										handleActiveUserAppointmentTab(APPOINTMENT_STATUS[key])
									}
									isLight={activeUserAppointmentTab !== APPOINTMENT_STATUS[key]}>
									<div className='h6 mb-3 text-muted opacity-80'>
										{APPOINTMENT_STATUS[key]}
									</div>
									<div
										className={classNames('h2', {
											'text-light': darkModeStatus,
										})}>
										{
											appointments.filter(
												(appointment) => {
                                                    if(APPOINTMENT_STATUS[key] === APPOINTMENT_STATUS.CONFIRMED)
                                                        return appointment?.confirmed === true && appointment?.end > now; // Confirmé + à venir

                                                    else if(APPOINTMENT_STATUS[key] === APPOINTMENT_STATUS.PENDING)
                                                        return !appointment?.confirmed && appointment?.end > now; // En attente + à venir

                                                    else if(APPOINTMENT_STATUS[key] === APPOINTMENT_STATUS.PAST)
                                                        return appointment?.confirmed && appointment?.end < now; // Confirmé + Passé
                                                }
											).length
										}
									</div>
								</Button>
							</div>
						))}
					</div>
				</div>
				{appointments
					.filter( appointment => {
                        if(activeUserAppointmentTab === APPOINTMENT_STATUS.CONFIRMED)
                            return appointment?.confirmed === true && appointment?.end > now;
                        else if(activeUserAppointmentTab === APPOINTMENT_STATUS.PENDING)
                            return !appointment?.confirmed;
                        else if(activeUserAppointmentTab === APPOINTMENT_STATUS.PAST)
                            return appointment?.end < now;
                    })
					.map( appointment => (
						<Card key={appointment.id}>
							<CardBody>
								<div className='row g-3 align-items-center'>
									<div className='col d-flex align-items-center'>
										<div className='flex-shrink-0'>
											<div className='ratio ratio-1x1' style={{ width: 72 }}>
												<div
													className={classNames(
														'rounded-2 d-flex align-items-center justify-content-center',
														{
															'bg-l10-info': !darkModeStatus,
															'bg-lo25-info': darkModeStatus,
														},
													)}>
													<span className='text-info fs-1 fw-bold'>
														<Icon icon={appointment?.icon ? appointment.icon : 'HelpBasic'} />
													</span>
												</div>
											</div>
										</div>
										<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
											<div>
												<div className='fw-bold fs-6 mb-0'>{appointment.name}</div>
												<div className='text-muted'>
													<small>
														Date :{' '}
														{/* <span className='text-info fw-bold'>
															{convert((appointment.end - appointment.start)/1000).hours}
                                                            h
                                                            {convert((appointment.end - appointment.start)/1000).minutes}
														</span> */}

                                                        <span className='text-info fw-bold'>
															{appointment?.start.toLocaleDateString('fr', {year:'2-digit', month:'2-digit', day:'2-digit'})}
														</span>
													</small>
												</div>
											</div>
										</div>
									</div>
									<div className='col-auto'>
										<div
											className={classNames(
												`text-info fw-bold px-3 py-2 rounded-pill`,
												{
													'bg-l10-info': !darkModeStatus,
													'bg-lo25-info': darkModeStatus,
												},
											)}>
											{`${appointment?.horses?.data?.length || '0'} ${
												appointment?.horses?.data?.length > 1 ? 'chevaux' : 'cheval'
											}`}
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					))}
				
                {/* <Card
					className={classNames('mb-0', {
						'text-dark': darkModeStatus,
						'bg-l25-info': !darkModeStatus,
						'bg-lo50-info': darkModeStatus,
					})}
					isCompact>
					<CardHeader className='bg-transparent'>
						<CardLabel>
							<CardTitle tag='h4' className='h5'>
								Occupancy
							</CardTitle>
						</CardLabel>

					</CardHeader>
					<CardBody>
						<Chart
							className='mx-n4'
							series={sales.series}
							options={sales.options}
							type={sales.options.chart.type}
							height={sales.options.chart.height}
							width={sales.options.chart.width}
						/>
						<div className='d-flex align-items-center pb-3'>
							<div className='flex-shrink-0'>
								<Icon icon='Speed' size='4x' color='info' />
							</div>
							<div className='flex-grow-1 ms-3'>
								<div className='fw-bold fs-3 mb-0'>
									50%
									<span className='text-success fs-5 fw-bold ms-3'>
										+12%
										<Icon icon='ArrowUpward' />
									</span>
								</div>
								<div
									className={classNames({
										'text-muted': !darkModeStatus,
										'text-light': darkModeStatus,
									})}>
									Compared to (45% last week)
								</div>
							</div>
						</div>
					</CardBody>
				</Card> */}
			</OffCanvasBody>
		</OffCanvas>
	);
};
CommonRightPanel.propTypes = {
	setOpen: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
};

export default CommonRightPanel;
