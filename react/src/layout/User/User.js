import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// 🛠️ Hooks :
import useAuth from '../../hooks/useAuth';
import useDarkMode from '../../hooks/useDarkMode';

import USERS from '../../common/data/userDummyData';
import { demoPages, logoutPage } from '../../menu';
import { DropdownItem, DropdownMenu } from '../../components/bootstrap/Dropdown';
import Button from '../../components/bootstrap/Button';

import Collapse from '../../components/bootstrap/Collapse';
import { NavigationLine } from '../Navigation/Navigation';
import Icon from '../../components/icon/Icon';
import useNavigationItemHandle from '../../hooks/useNavigationItemHandle';

import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';

const User = () => {
    // ⚙️ Strapi's API URL :
    const API_URL = process.env.REACT_APP_API_URL;

	const navigate = useNavigate();
	const handleItem = useNavigationItemHandle();
    const auth = useAuth(); // 🦸 Auth :
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();

	const [collapseStatus, setCollapseStatus] = useState(false);
	const { t } = useTranslation(['translation', 'menu']);

	return (
		<>
			<div
				className={classNames('user', { open: collapseStatus })}
				role='presentation'
				onClick={() => setCollapseStatus(!collapseStatus)}>
				<div className='user-avatar'>
					<img
                        srcSet={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.url}` : `${defaultAvatar}`}
                        src={auth.user?.avatar ? `${API_URL}${auth.user?.avatar?.url}` : `${defaultAvatar}`}
						alt='.🦸‍♀️.'
						width={128}
						height={128}
					/>
				</div>
				<div className='user-info'>
					<div className='user-name d-flex align-items-center'>
						{`${auth?.user?.username}`}
						<Icon icon='Verified' className='ms-1' color='info' />
					</div>
					<div className='user-sub-title'>{auth?.user?.position}</div>
				</div>
			</div>
			<DropdownMenu>
				<DropdownItem>
					<Button
						icon='AccountBox'
						onClick={() =>
							navigate(
								`../${demoPages.appointment.subMenu.employeeID.path}/${USERS.JOHN.id}`,
							)
						}>
						Profile
					</Button>
				</DropdownItem>
				<DropdownItem>
					<Button
						icon={darkModeStatus ? 'LightMode' : 'DarkMode'}
						onClick={() => setDarkModeStatus(!darkModeStatus)}
						aria-label='Toggle fullscreen'>
						{darkModeStatus ? 'Mode clair' : 'Mode sombre'}
					</Button>
				</DropdownItem>
			</DropdownMenu>

			<Collapse isOpen={collapseStatus} className='user-menu'>
				<nav aria-label='aside-bottom-user-menu'>
					<div className='navigation'>
						<div
							role='presentation'
							className='navigation-item cursor-pointer'
							// onClick={() =>
							// 	navigate(
							// 		`/`,
							// 		handleItem(),
							// 	)
							// }
                            >
							<span className='navigation-link navigation-link-pill'>
								<span className='navigation-link-info'>
									<Icon icon='AccountBox' className='navigation-icon' />
									<span className='navigation-text'>Paramètres</span>
								</span>
							</span>
						</div>
						<div
							role='presentation'
							className='navigation-item cursor-pointer'
							onClick={() => {
								setDarkModeStatus(!darkModeStatus);
								handleItem();
							}}>
							<span className='navigation-link navigation-link-pill'>
								<span className='navigation-link-info'>
									<Icon
										icon={darkModeStatus ? 'LightMode' : 'DarkMode'}
										color={darkModeStatus ? 'warning' : 'info'}
										className='navigation-icon'
									/>
									<span className='navigation-text'>
										{darkModeStatus ? 'Mode clair' : 'Mode sombre'}
									</span>
								</span>
							</span>
						</div>
					</div>
				</nav>
				<NavigationLine />
				<nav aria-label='aside-bottom-user-menu-2'>
					<div className='navigation'>
						<div
							role='presentation'
							className='navigation-item cursor-pointer'
							onClick={() => navigate(`../${logoutPage.logout.path}`)}>
							<span className='navigation-link navigation-link-pill'>
								<span className='navigation-link-info'>
									<Icon icon='Logout' className='navigation-icon' />
									<span className='navigation-text'>Déconnexion</span>
								</span>
							</span>
						</div>
					</div>
				</nav>
			</Collapse>
		</>
	);
};

export default User;
