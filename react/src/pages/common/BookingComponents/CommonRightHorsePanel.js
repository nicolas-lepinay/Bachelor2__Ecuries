import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import CircularProgress from '@mui/material/CircularProgress';

import OffCanvas, { OffCanvasBody } from '../../../components/bootstrap/OffCanvas';
import Avatar, { AvatarGroup } from '../../../components/Avatar';

// Default Avatar :
import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';
import defaultHorseAvatar from '../../../assets/img/horse-avatars/defaultHorseAvatar.webp';

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
import { queryPages } from '../../../menu';

import useAuth from '../../../hooks/useAuth';
import useDarkMode from '../../../hooks/useDarkMode';

const convert = require('convert-seconds');

const CommonRightPanel = ({ setOpen, isOpen, horse, horses, events }) => {

    // ⚙️ Strapi's API URL :
    const API_URL = process.env.REACT_APP_API_URL;

    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    // 🦸 User:
    const auth = useAuth();

    const isAdmin = auth.user && Number(auth.user.role.id) === Number(ADMIN_ID);
    const isPro = auth.user && Number(auth.user.role.id) === Number(PRO_ID);
    const isClient = auth.user && Number(auth.user.role.id) === Number(CLIENT_ID);

    const now = new Date();
    const yesterday = moment().startOf('day').subtract(1, 'days')._d;
    const today = moment().startOf('day')._d;
    const tomorrow = moment().startOf('day').add(1, 'day')._d;
    const after_tomorrow = moment().startOf('day').add(2, 'day')._d;

	const { themeStatus, darkModeStatus } = useDarkMode();

	const EVENT_STATUS = {
		TOMORROW: 'Demain',
		TODAY: "Aujourd'hui",
		YESTERDAY: 'Hier',
	};
	const [activeHorseActivityTab, setActiveHorseActivityTab] = useState(EVENT_STATUS.TODAY);

	const handleActiveHorseActivityTab = (tabName) => {
		setActiveHorseActivityTab(tabName);
	};

    // Filter only this horse's activities :
    events = events.filter(
        (event) =>
            event?.horses?.data.some(
                each => each.id === horse.id ),
    );

    if(!horse.id)
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
								{horses.map( horse => (
									<Avatar
										key={horse.id}
                                        srcSet={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
                                        src={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.formats?.thumbnail?.url}` : `${defaultHorseAvatar}`}
                                        userName={horse?.name}
                                        color={horse?.color}
                                    />
								))}
							</AvatarGroup>
							<div className='h5 mb-0 text-muted'>
								<strong>Écuries</strong> de Persévère
							</div>
						</div>
					</div>
					<div className='col-auto'>
                        <Button
                            color='light'
                            icon='Close'
                            size='lg'
                            onClick={() => { setOpen(false) }}>
                        </Button>
					</div>
				</div>
                    <Link
                        to={`${queryPages.horses.path}/${horse.id}`}
                        className='text-decoration-none'
                        style={(isAdmin || isPro) ? {color: 'inherit', cursor: 'pointer'} : {color: 'inherit', pointerEvents: 'none'}}
                    >
                        <div className='d-flex justify-content-center mb-3'>
                            <Avatar
                                srcSet={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.url}` : `${defaultHorseAvatar}`}
                                src={horse?.avatar ? `${API_URL}${horse?.avatar?.data?.attributes?.url}` : `${defaultHorseAvatar}`}
                                color={horse?.color}
                                shadow='default'
                            />
                        </div>
                        <div className='d-flex flex-column align-items-center mb-5'>
                            <div className='h2 fw-bold'>{horse?.name}</div>
                            {horse?.breed && <div className='h5 text-muted opacity-75'>{horse?.breed}</div>}
                            <Link
                                to={`/${queryPages.users.path}/${horse?.owner?.data?.id}`}
                                className='text-decoration-none'
                                style={(isAdmin || isPro) ? {color: 'inherit', cursor: 'pointer'} : {color: 'inherit', pointerEvents: 'none'}}
                            >
                                <div className='h5 text-muted opacity-50 my-2'>{horse?.owner?.data?.attributes?.name} {horse?.owner?.data?.attributes?.surname}</div>
                            </Link>
                        </div>
                    </Link>
				<div
					className={classNames('rounded-3', {
						'shadow-3d-dark': !darkModeStatus,
						'shadow-3d-light': darkModeStatus,
						'bg-l10-dark': !darkModeStatus,
						'bg-lo50-info': darkModeStatus,
					})}>
					<div className='row row-cols-3 g-3 pb-3 px-3 mt-0'>
						{Object.keys(EVENT_STATUS).map((key) => (
							<div
								key={EVENT_STATUS[key]}
								className='col d-flex flex-column align-items-center'>
								<Button
									color={
										(darkModeStatus &&
											activeHorseActivityTab === EVENT_STATUS[key]) ||
										!darkModeStatus
											? 'dark'
											: null
									}
									className='w-100 text-uppercase'
									rounded={1}
									onClick={() =>
										handleActiveHorseActivityTab(EVENT_STATUS[key])
									}
									isLight={activeHorseActivityTab !== EVENT_STATUS[key]}>
									<div className='h6 mb-3 text-muted opacity-80'>
										{EVENT_STATUS[key]}
									</div>
									<div
										className={classNames('h2', {
											'text-light': darkModeStatus,
										})}>
										{
											events.filter(
												(event) => {
                                                    if(EVENT_STATUS[key] === EVENT_STATUS.TOMORROW)
                                                        return event?.start > tomorrow && event?.start < after_tomorrow;

                                                    else if(EVENT_STATUS[key] === EVENT_STATUS.TODAY)
                                                        return event?.start > today && event?.start < tomorrow;

                                                    else if(EVENT_STATUS[key] === EVENT_STATUS.YESTERDAY)
                                                        return event?.start > yesterday && event?.start < today;
                                                }
											).length
										}
									</div>
								</Button>
							</div>
						))}
					</div>
				</div>
				{events
					.filter( event => {
                        if(activeHorseActivityTab === EVENT_STATUS.TOMORROW)
                            return event?.start > tomorrow && event?.start < after_tomorrow;

                            else if(activeHorseActivityTab === EVENT_STATUS.TODAY)
                                return event?.start > today && event?.start < tomorrow;

                            else if(activeHorseActivityTab === EVENT_STATUS.YESTERDAY)
                                return event?.start > yesterday && event?.start < today;
                    })
					.map( event => (
						<Card key={event.id}>
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
														<Icon icon={event?.icon ? event.icon : 'HelpBasic'} />
													</span>
												</div>
											</div>
										</div>
										<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
											<div>
												<div className='fw-bold fs-6 mb-0'>{event.name}</div>
												<div className='text-muted'>
													<small>
														Date :{' '}
                                                        <span className='text-info fw-bold'>
															{event?.start.toLocaleDateString('fr', {year:'2-digit', month:'2-digit', day:'2-digit'})}
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
                                            {event?.horses?.data?.length === 1 && '1 cheval'}
											{event?.horses?.data?.length > 1 && `${event?.horses?.data?.length} chevaux`}
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					))}
			</OffCanvasBody>
		</OffCanvas>
	);
};
CommonRightPanel.propTypes = {
	setOpen: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
};

export default CommonRightPanel;
