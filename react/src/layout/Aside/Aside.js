import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// 🛠️ Hooks :
import useAuth from '../../hooks/useAuth';
import useDarkMode from '../../hooks/useDarkMode';
import useAsideTouch from '../../hooks/useAsideTouch';

import Brand from '../Brand/Brand';
import Navigation, { NavigationLine } from '../Navigation/Navigation';
import User from '../User/User';
import { landingPage, profilePage, adminMenu, professionalMenu, clientMenu } from '../../menu';
import ThemeContext from '../../contexts/themeContext';
import Card, { CardBody } from '../../components/bootstrap/Card';

import Hand from '../../assets/img/hand.png';
import HandWebp from '../../assets/img/hand.webp';
// import Icon from '../../components/icon/Icon';
import Button from '../../components/bootstrap/Button';
import Tooltips from '../../components/bootstrap/Tooltips';

const Aside = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);

	const { asideStyle, touchStatus, hasTouchButton, asideWidthWithSpace, x } = useAsideTouch();

	const isModernDesign = process.env.REACT_APP_MODERN_DESGIN === 'true';

	const constraintsRef = useRef(null);

	const [doc, setDoc] = useState(false);
    
    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'
    
    // 🦸 Logged-in user
    const user = useAuth().user;

    const isAdmin = user && Number(user.role.id) === Number(ADMIN_ID);
    const isPro = user && Number(user.role.id) === Number(PRO_ID);
    const isClient = user && Number(user.role.id) === Number(CLIENT_ID);

	const { darkModeStatus } = useDarkMode();

	const { t } = useTranslation(['translation', 'menu']);

    if(!user)
        return null;

	return (
		<>
			<motion.aside
				style={asideStyle}
				className={classNames(
					'aside',
					{ open: asideStatus },
					{
						'aside-touch-bar': hasTouchButton && isModernDesign,
						'aside-touch-bar-close': !touchStatus && hasTouchButton && isModernDesign,
						'aside-touch-bar-open': touchStatus && hasTouchButton && isModernDesign,
					},
				)}>

				<div className='aside-head'>
					<Brand asideStatus={asideStatus} setAsideStatus={setAsideStatus} />
				</div>

				<div className='aside-body'>
                    <Navigation menu={landingPage} id='aside-landing' />

                    <Navigation menu={profilePage} id='aside-landing' />

                    <NavigationLine />

                    <Navigation 
                        id='aside-dashboards' 
                        menu={isAdmin ? adminMenu.dashboards : isPro ? professionalMenu.dashboards : clientMenu.dashboards} 
                    />

                    <NavigationLine />

                    <Navigation 
                        id='aside-accounts' 
                        menu={isAdmin ? adminMenu.accounts : isPro ? professionalMenu.accounts : clientMenu.accounts} 
                    />

                    <NavigationLine />

                    <Navigation 
                        id='aside-chats' 
                        menu={isAdmin ? adminMenu.chat : isPro ? professionalMenu.chat : clientMenu.chat} 
                    />

					{/* <Navigation menu={dashboardMenu} id='aside-dashboard' /> */}
                    {/* <NavigationLine />
                    <Navigation menu={logoutPage} id='aside-demo-pages' /> */}

					{/* {!doc && (
						<>
							<NavigationLine />
							<Navigation menu={demoPages} id='aside-demo-pages' />
							<NavigationLine />
							<Navigation menu={layoutMenu} id='aside-menu' />
						</>
					)}

					{doc && (
						<>
							<NavigationLine />
							<Navigation menu={componentsMenu} id='aside-menu-two' />
							<NavigationLine />
						</>
					)} */}

					{asideStatus && doc && (
						<Card className='m-3 '>
							<CardBody className='pt-0'>
								<img
									srcSet={HandWebp}
									src={Hand}
									alt='Hand'
									width={130}
									height={130}
								/>
								<p
									className={classNames('h4', {
										'text-dark': !darkModeStatus,
										'text-light': darkModeStatus,
									})}>
									{t('Everything is ready!')}
								</p>
								<Button
									color='info'
									isLight
									className='w-100'
									onClick={() => setDoc(false)}>
									{t('Demo Pages')}
								</Button>
							</CardBody>
						</Card>
					)}
				</div>
				<div className='aside-foot'>
					{/* <nav aria-label='aside-bottom-menu'>
						<div className='navigation'>
							<div
								role='presentation'
								className='navigation-item cursor-pointer'
								onClick={() => {
									setDoc(!doc);
								}}
								data-tour='documentation'>
								<span className='navigation-link navigation-link-pill'>
									<span className='navigation-link-info'>
										<Icon
											icon={doc ? 'ToggleOn' : 'ToggleOff'}
											color={doc ? 'success' : null}
											className='navigation-icon'
										/>
										<span className='navigation-text'>
											{t('menu:Documentation')}
										</span>
									</span>
									<span className='navigation-link-extra'>
										<Icon
											icon='Circle'
											className={classNames(
												'navigation-notification',
												'text-success',
												'animate__animated animate__heartBeat animate__infinite animate__slower',
											)}
										/>
									</span>
								</span>
							</div>
						</div>
					</nav> */}
					<User />
				</div>
			</motion.aside>
			{asideStatus && hasTouchButton && isModernDesign && (
				<>
					<motion.div className='aside-drag-area' ref={constraintsRef} />
					<Tooltips title='Tirer / Pousser' flip={['top', 'right']}>
						<motion.div
							className='aside-touch'
							drag='x'
							whileDrag={{ scale: 1.2 }}
							whileHover={{ scale: 1.1 }}
							dragConstraints={constraintsRef}
							// onDrag={(event, info) => console.log(info.point.x, info.point.y)}
							dragElastic={0.1}
							style={{ x, zIndex: 1039 }}
							onClick={() => x.set(x.get() === 0 ? asideWidthWithSpace : 0)}
						/>
					</Tooltips>
				</>
			)}
		</>
	);
};

export default Aside;
