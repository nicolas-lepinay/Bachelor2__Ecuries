import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import 'moment/locale/fr';
import { useFormik } from 'formik';

import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../layout/SubHeader/SubHeader';
import Icon from '../../components/icon/Icon';
import Button from '../../components/bootstrap/Button';
import Page from '../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import Chat, { ChatAvatar, ChatHeader, ChatGroup, ChatListItem } from '../../components/Chat';
import USERS from '../../common/data/userDummyData';
import OffCanvas, { OffCanvasBody, OffCanvasHeader } from '../../components/bootstrap/OffCanvas';
import InputGroup from '../../components/bootstrap/forms/InputGroup';
import Textarea from '../../components/bootstrap/forms/Textarea';
import showNotification from '../../components/extras/showNotification';

import ThemeContext from '../../contexts/themeContext';
import { clientMenu } from '../../menu';

// 🛠️ Hooks :
import useDarkMode from '../../hooks/useDarkMode';
import useAuth from '../../hooks/useAuth';
import useFetchEmployees from '../../hooks/useFetchEmployees'
import useFetchClients from '../../hooks/useFetchClients'
import useFetchChats from '../../hooks/useFetchChats'

import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';

import CHATS from '../../common/data/chatDummyData';
import CommonChatStatus from '../common/CommonChatStatus';

// 🅰️ Axios :
import axios from 'axios';

const ChatPage = () => {
	const navigate = useNavigate();
	const [canvasStatus, setCanvasStatus] = useState(false);
    const { mobileDesign } = useContext(ThemeContext);
	const [listShow, setListShow] = useState(true);

    // ⚙️ Strapi's API URLs :
    const API_URL = process.env.REACT_APP_API_URL;
    const CHATS_ROUTE = process.env.REACT_APP_CHATS_ROUTE;

    // 🦸 User:
    const auth = useAuth();

    // 👩‍🚀 Fetch all employees :
    const { 
        data: employees, 
        setData: setEmployees,
        loading: loadingEmployees,
        error: errorEmployees } = useFetchEmployees();

    // 🧑‍🤝‍🧑 Fetch clients :
    const { 
        data: clients, 
        setData: setClients, 
        loading: loadingClients,
        error: errorClients } = useFetchClients();

    // 💬 Fetch my conversations :
    const { 
        data: chats, 
        setData: setChats, 
        loading: loadingChats,
        error: errorChats } = useFetchChats({ filters: `&filters[users][id]=${auth.user.id}`});

    const formik = useFormik({
        initialValues: {
            text: '',
            date: '',
            sender: {
                id: auth.user.id,
            },
        },
        onSubmit: (values) => {
            // Create new date :
            values.date = new Date();

            // Update chat :
            activeChat && handleUpdateChat(values);

            // Clear textarea :
            formik.setFieldValue('text', '');
        },
    });

	const TABS = {
		CHLOE: USERS.CHLOE,
		GRACE: USERS.GRACE,
		JANE: USERS.JANE,
		RYAN: USERS.RYAN,
		ELLA: USERS.ELLA,
		SAM: USERS.SAM,
	};
	const [activeTab, setActiveTab] = useState(null);
    const [activeChat, setActiveChat] = useState(null);

	// function getMessages(ACTIVE_TAB) {
	// 	if (ACTIVE_TAB === USERS.ELLA) {
	// 		return CHATS.ELLA_VS_JOHN;
	// 	}
	// 	if (ACTIVE_TAB === USERS.GRACE) {
	// 		return CHATS.GRACE_VS_JOHN;
	// 	}
	// 	if (ACTIVE_TAB === USERS.JANE) {
	// 		return CHATS.JANE_VS_JOHN;
	// 	}
	// 	if (ACTIVE_TAB === USERS.RYAN) {
	// 		return CHATS.RYAN_VS_JOHN;
	// 	}
	// 	if (ACTIVE_TAB === USERS.CHLOE) {
	// 		return CHATS.CHLOE_VS_JOHN;
	// 	}
	// 	if (ACTIVE_TAB === USERS.SAM) {
	// 		return CHATS.SAM_VS_JOHN;
	// 	}
	// 	return null;
	// };
    const getChatMessages = (chat) => {
        return chat?.messages || [];
    }

	const getListShow = (TAB_NAME) => {
		setActiveTab(TAB_NAME);
		setCanvasStatus(true);

        if (mobileDesign) {
			setListShow(false);
		}
	};
    const showChat = (chatId) => {
        setActiveChat(chats.filter(chat => chat.id === chatId)[0]);
        setCanvasStatus(true);

        if (mobileDesign) {
			setListShow(false);
		}
    };

    const handleUpdateChat = async (newData) => {
        // Get all existing messages' IDs to keep them (otherwise they will get deleted) :
        const oldChat = activeChat.messages.map( msg => {
            return { id: msg.id }
        })
        // Add new message to old chat :
        const updatedChat = [ ...oldChat, newData ];

        // Wrap new chat in an object, inside a 'messages' field :
        const dataToSend = {
            messages: updatedChat,
        }
        try {
            const res = await axios.put(`${API_URL}${CHATS_ROUTE}/${activeChat?.id}?populate=users.avatar&populate=messages.sender.avatar`, { data: dataToSend });
            const resData = res.data.data;

            // Update activeChat :
            setActiveChat({id: resData.id, ...resData.attributes});

            // Update all chats :
            const updatedChats = chats.map(chat => {
                // 👇️ if id equals resData.id, update chat by returning resData
                if (chat.id === resData.id) {
                    return { id: resData.id, ...resData.attributes };
                }
                // 👇️ otherwise return object as is
                return chat;
              });
              setChats(updatedChats);

        } catch(err) {
            console.log(`UPDATE | CHAT | Le message n'a pas pu être envoyé. | ` + err);
            showNotification(
                'Messagerie.', // title
				"Oops ! Une erreur s'est produite. Le message n'a pas pu être envoyé.", // message
                'danger' // type
			);
        }
    }

	useEffect(() => {
		if (!canvasStatus) {
			setActiveTab(null);
            setActiveChat(null);
            // Clear textarea :
            formik.setFieldValue('text', '');
		}
		return () => {};
	}, [canvasStatus]);

	return (
		<PageWrapper title={clientMenu.chat.title.text}>
            <SubHeader>
				<SubHeaderLeft>
					<span>
						<Icon icon='Info' className='me-2' size='2x' color='danger' />
						<span className='text-muted'>
							Vous avez <Icon icon='Chat5' color='danger' className='mx-1' size='lg' />{' '}
							5 messages non-lus.
						</span>
					</span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<CommonChatStatus />
					{!listShow && (
						<Button
							color='info'
							isLight
							icon='ChevronLeft'
							onClick={() => {
								setListShow(true);
							}}>
							Revenir
						</Button>
					)}
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
                {(listShow || !mobileDesign) && (
					<div className='col-lg-4 col-md-6' >
						<Card stretch className='overflow-hidden'>
                            <CardBody isScrollable className='p-0'>
                                <Card shadow='none' className='mb-0'>
                                    <CardHeader className='sticky-top'>
                                        <CardLabel icon='AccountCircle' iconColor='success'>
                                            <CardTitle>Mes conversations</CardTitle>
                                            <CardSubTitle>{chats.length === 0 ? "Vous n'avez aucune conversation en cours." : chats.length === 1 ? 'Une seule conversation' : `${chats.length} conversations`}</CardSubTitle>
                                        </CardLabel>
                                    </CardHeader>
                                    <CardBody className='border-bottom border-light'>
                                        <div className='row'>
                                            {chats.map(chat => (
                                                <ChatListItem
                                                    onClick={() => showChat(chat.id)}
                                                    isActive={activeTab === TABS.CHLOE}
                                                    src={chat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.avatar ? `${API_URL}${chat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.avatar?.data?.attributes?.url}` : `${defaultAvatar}`}
                                                    name={chat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.name}
                                                    surname={chat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.surname}
                                                    color={chat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.color}
                                                    lastSeenTime={moment(chat.messages[chat.messages.length - 1].date).fromNow()}
                                                    latestMessage={chat.messages[chat.messages.length - 1].text}
                                                />
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card shadow='none' className='mb-0'>
                                    <CardHeader className='sticky-top'>
                                        <CardLabel icon='AccountCircle' iconColor='danger'>
                                            <CardTitle>Professionnels</CardTitle>
                                            <CardSubTitle>{employees.filter(user => user.id !== auth.user.id).length} professionnels</CardSubTitle>
                                        </CardLabel>
                                    </CardHeader>
                                    <CardBody>
                                        <div className='row'>
                                            {employees.filter(user => user.id !== auth.user.id).map( user => (
                                                <ChatListItem
                                                    onClick={() => getListShow(TABS.RYAN)}
                                                    isActive={activeTab === TABS.RYAN}
                                                    src={user?.avatar ? `${API_URL}${user?.avatar?.url}` : `${defaultAvatar}`}
                                                    srcSet={user?.avatar ? `${API_URL}${user?.avatar?.url}` : `${defaultAvatar}`}
                                                    name={user?.name}
                                                    surname={user?.surname}
                                                    //isOnline={USERS.RYAN.isOnline}
                                                    color={user?.color}
                                                    //lastSeenTime={moment().add(-3, 'day').fromNow()}
                                                    //latestMessage='Vivamus fermentum dui sit amet orci interdum pulvinar.'
                                                />
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>

                                <Card shadow='none' className='mb-0'>
                                    <CardHeader className='sticky-top'>
                                        <CardLabel icon='AccountCircle' iconColor='danger'>
                                            <CardTitle>Professionnels</CardTitle>
                                            <CardSubTitle>{employees.filter(user => user.id !== auth.user.id).length} professionnels</CardSubTitle>
                                        </CardLabel>
                                    </CardHeader>
                                    <CardBody>
                                        <div className='row'>
                                            {clients.filter(user => user.id !== auth.user.id).map( user => (
                                                <ChatListItem
                                                    onClick={() => getListShow(TABS.RYAN)}
                                                    isActive={activeTab === TABS.RYAN}
                                                    src={user?.avatar ? `${API_URL}${user?.avatar?.url}` : `${defaultAvatar}`}
                                                    srcSet={user?.avatar ? `${API_URL}${user?.avatar?.url}` : `${defaultAvatar}`}
                                                    name={user?.name}
                                                    surname={user?.surname}
                                                    //isOnline={USERS.RYAN.isOnline}
                                                    color={user?.color}
                                                    //lastSeenTime={moment().add(-3, 'day').fromNow()}
                                                    //latestMessage='Vivamus fermentum dui sit amet orci interdum pulvinar.'
                                                />
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            </CardBody>
						</Card>
					</div>
                )}

                {(!listShow || !mobileDesign) && (
                    <div className='col-lg-8 col-md-6'>
                        <Card stretch>
                            <CardHeader>
                                <CardActions>
                                    <div className='d-flex align-items-center'>
                                        <ChatAvatar
                                            {...activeTab}
                                            className='me-3'
                                        />
                                        <div className='fw-bold'>
                                        {activeChat ? `${activeChat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.name} ${activeChat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.surname}` : null}
                                        </div>
                                    </div>
                                </CardActions>
                            </CardHeader>
                            <CardBody isScrollable>
                                <Chat>
                                    {getChatMessages(activeChat).map((msg) => (
                                        <ChatGroup
                                            messages={[ { id: msg.id, message: msg.text, date: msg.date } ]}
                                            user={msg.sender.data}
                                            isReply={msg.sender.data.id === auth.user.id}
                                        />
							        ))}
                                </Chat>
                            </CardBody>
                            <CardFooter className='d-block'>
                                <InputGroup id='text'>
                                    <Textarea 
                                        id='text'
                                        name='text'
                                        placeholder='Saisir un message...'
                                        onChange={formik.handleChange}
                                        value={formik.values.text}
                                    />
                                    <Button 
                                        color='info' 
                                        icon='Send' 
                                        size='lg'
                                        disabled={formik.values.text === ''}
                                        onClick={formik.handleSubmit}
                                    >
                                        <span></span>
                                    </Button>
                                </InputGroup>
                            </CardFooter>
                        </Card>
                    </div>
				)}
				</div>

				<OffCanvas
					id='chat'
					isOpen={canvasStatus}
					setOpen={setCanvasStatus}
					placement='end'
					//isModalStyle
					isBackdrop={true}
					isBodyScroll>
					<OffCanvasHeader setOpen={setCanvasStatus} className='fs-5'>
						<ChatHeader
							//to={activeTab ? `${activeTab.name} ${activeTab.surname}` : null}
                            to={activeChat ? `${activeChat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.name} ${activeChat.users.data.filter(user => user.id !== auth.user.id)[0]?.attributes?.surname}` : null}
						/>
					</OffCanvasHeader>
					<OffCanvasBody>
						<Chat>
                            {activeChat &&
								getChatMessages(activeChat).map((msg) => (
									<ChatGroup
										messages={[ { id: msg.id, message: msg.text, date: msg.date } ]}
										user={msg.sender.data}
										isReply={msg.sender.data.id === auth.user.id}
									/>
							    ))
                            }
						</Chat>
					</OffCanvasBody>
					<div className='chat-send-message p-3'>
						<InputGroup id='text'>
							<Textarea 
                                id='text'
                                name='text'
                                placeholder='Saisir un message...'
                                onChange={formik.handleChange}
                                value={formik.values.text}
                            />
							<Button 
                                color='info' 
                                icon='Send' 
                                size='lg'
                                disabled={formik.values.text === ''}
                                onClick={formik.handleSubmit}
                            >
								<span></span>
							</Button>
						</InputGroup>
					</div>
				</OffCanvas>
			</Page>
		</PageWrapper>
	);
};

export default ChatPage;
