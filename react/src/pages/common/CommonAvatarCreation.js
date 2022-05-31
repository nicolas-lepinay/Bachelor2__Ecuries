import { lazy, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 📚 Librairies :
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import moment from 'moment';
import classNames from 'classnames';
import { useMeasure } from 'react-use';

import ThemeContext from '../../contexts/themeContext';
import { capitalize } from '../../helpers/helpers';

// 🛠️ Hooks :
import useAuth from '../../hooks/useAuth';
import useFetchClients from '../../hooks/useFetchClients';
import useFetchBreeds from '../../hooks/useFetchBreeds';
import useFetchAvatars from '../../hooks/useFetchAvatars';
import useDarkMode from '../../hooks/useDarkMode';

// 🅱️ Bootstrap components :
import Button from '../../components/bootstrap/Button';
import Page from '../../layout/Page/Page';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import Wizard, { WizardItem } from '../../components/Wizard';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Select from '../../components/bootstrap/forms/Select';
import Option from '../../components/bootstrap/Option';
import Popovers from '../../components/bootstrap/Popovers';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../../components/bootstrap/forms/InputGroup';
import Icon from '../../components/icon/Icon';
import Alert from '../../components/bootstrap/Alert';
import showNotification from '../../components/extras/showNotification';
import Carousel from '../../components/bootstrap/Carousel';
import CarouselSlide from '../../components/bootstrap/CarouselSlide';
import CarouselCaption from '../../components/bootstrap/CarouselCaption';

import Avatar from '../../components/Avatar';
import defaultManBust from '../../assets/img/wanna/defaultManBust.webp';
import defaultWomanBust from '../../assets/img/wanna/defaultWomanBust.webp';

import Skin1 from '../../assets/img/avatar-creation/skin_1.png';
import Skin2 from '../../assets/img/avatar-creation/skin_2.png';
import Skin3 from '../../assets/img/avatar-creation/skin_3.png';

import Eyes1 from '../../assets/img/avatar-creation/eyes_1.png';
import Eyes2 from '../../assets/img/avatar-creation/eyes_2.png';
import Eyes3 from '../../assets/img/avatar-creation/eyes_3.png';

import Hair1 from '../../assets/img/avatar-creation/hair_1.png';
import Hair2 from '../../assets/img/avatar-creation/hair_2.png';
import Hair3 from '../../assets/img/avatar-creation/hair_3.png';
import Hair4 from '../../assets/img/avatar-creation/hair_4.png';

import Hairstyle1 from '../../assets/img/avatar-creation/hairstyle_1.png';
import Hairstyle2 from '../../assets/img/avatar-creation/hairstyle_2.png';
import Hairstyle3 from '../../assets/img/avatar-creation/hairstyle_3.png';

// 🅰️ Axios :
import axios from 'axios';


const CommonAvatarCreation = ({ setIsOpen }) => {

    const { darkModeStatus } = useDarkMode();

    // ⚙️ Strapi's API URL
    const API_URL = process.env.REACT_APP_API_URL;
    const HORSES_ROUTE = process.env.REACT_APP_HORSES_ROUTE;

    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    // 🦸 User
    const auth = useAuth();

    // Fetch all avatars :
    const { data: avatars } = useFetchAvatars();

    const options = {
        sex: [
            {
                value: '1',
                description: 'Féminin',
                asset: defaultWomanBust,
            },
            {
                value: '2',
                description: 'Masculin',
                asset: defaultManBust,
            },
        ],
        skin: [
            {
                value: '1',
                description: 'Claire',
                asset: Skin1,
            },
            {
                value: '2',
                description: 'Médium',
                asset: Skin2,
            },
            {
                value: '3',
                description: 'Foncée',
                asset: Skin3,
            },
        ],
        eyes: [
            {
                value: '1',
                description: 'Foncés',
                asset: Eyes1,
            },
            {
                value: '2',
                description: 'Noisette',
                asset: Eyes2,
            },
            {
                value: '3',
                description: 'Clairs',
                asset: Eyes3,
            },
        ],
        hair: [
            {
                value: '1',
                description: 'Noirs',
                asset: Hair1,
            },
            {
                value: '2',
                description: 'Châtains',
                asset: Hair2,
            },
            {
                value: '3',
                description: 'Blonds',
                asset: Hair3,
            },
            {
                value: '4',
                description: 'Roux',
                asset: Hair4,
            },
        ],
        hairstyle: [
            {
                value: '1',
                description: 'Courts',
                asset: Hairstyle1,
            },
            {
                value: '2',
                description: 'Mi-longs',
                asset: Hairstyle2,
            },
            {
                value: '3',
                description: 'Longs',
                asset: Hairstyle3,
            },
        ],
    }

    const formik = useFormik({
		initialValues: {
            skin: '1',
            eyes: '1',
            hair: '1',
            hairstyle: '1',
			sex: '1',
            avatar : {
                id: '',
            },

		},
		onSubmit: (values) => {

            // On ne garde que l'avatarId :
            values = { 
                avatar: { 
                    id: values.avatar.id,
                } 
            }
            // Validation check :
            if(values.avatar.id === '') {
                showNotification(
                    'Nouvel avatar', // title
                    "Veuillez choisir un avatar pour pouvoir continuer.", // message
                    'danger' // type
                );
                return;
            }
            // Update user :
            auth.updateUser(values);

            // Close modal :
            setIsOpen(false);
		}
	});

    return (
        <Wizard
            //isHeader
            stretch
            color='primary'
            noValidate
            disabledProgressBar={true}
            disabled={formik.values.sex === '' || formik.values.skin === '' || formik.values.eyes === '' || formik.values.hair === '' || formik.values.hairstyle === ''}
            onSubmit={formik.handleSubmit}
            className='shadow-none'>
            <WizardItem id='step1' title='Sexe'>
                <div className='h1 mx-auto mb-5 pb-5'>
                    Choisir un modèle
                </div>

                <div className='row g-5 pt-3'>
                    <div className="col-lg-6 col-12">
                            <Card
                                className='position-relative ms-auto me-lg-3 me-auto bg-l10-info'
                                style={{width: '450px', cursor: 'not-allowed'}}
                            >
                                <CardBody className='p-0 d-flex justify-content-center opacity-50'>
                                    <img src={defaultManBust} width={550}/>
                                </CardBody>
                            <Button 
                                className='h5 text-center position-absolute bottom-0 opacity-100'
                                style={{marginBottom: '-20px', marginLeft: '25%'}}
                                icon='AccessTime'
                                size='lg'
                                disabled={true}
                                color='info'
                            >
                                Bientôt disponible
                            </Button>
                        </Card>
                    </div>

                    <div className="col-lg-6 col-12">
                        <Card 
                            className={classNames(
                                'ms-lg-3 ms-auto me-auto ',
                                'bg-l10-info bg-l25-info-hover transition-base',
                                {
                                    'bg-l25-info': formik.values.sex === '1',
                                },
                            )}
                            style={{width: '450px'}}
                            role='button'
                            onClick={() => formik.values.sex === '1' ? formik.setFieldValue("sex", '') : formik.setFieldValue("sex", '1')}
                        >
                            <CardBody className='p-0 d-flex justify-content-center'>
                                <img src={defaultWomanBust} width={550} className=''/>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </WizardItem>

            <WizardItem id='step2' title='Couleur de peau'>
                <div className='h1 mx-auto my-5 pb-5'>
                    Choisir une couleur de peau
                </div>
                <div className='row g-5 justify-content-center my-auto'>
                    {options.skin.map(item => (
                        <div className='col-auto'>
                            <div className='d-flex flex-column align-items-center mx-2' style={{maxWidth: '130px'}}>
                                <Avatar
                                    src={item.asset}
                                    size={120}
                                    border={4}
                                    className='mb-3'
                                    borderColor={formik.values.skin === item.value ? 'primary' : 'light'}
                                    role='button'
                                    onClick={() => formik.values.skin === item.value ? formik.setFieldValue("skin", '') : formik.setFieldValue("skin", item.value)}
                                />
                                <div className='h5 text-center'>{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </WizardItem>

            <WizardItem id='step3' title='Couleur des yeux'>
                <div className='h1 mx-auto my-5 pb-5'>
                    Choisir la couleur des yeux
                </div>
                <div className='row g-5 justify-content-center my-auto'>
                    {options.eyes.map(item => (
                        <div className='col-auto'>
                            <div className='d-flex flex-column align-items-center mx-2' style={{maxWidth: '130px'}}>
                                <Avatar
                                    src={item.asset}
                                    size={120}
                                    border={4}
                                    className='mb-3'
                                    borderColor={formik.values.eyes === item.value ? 'primary' : 'light'}
                                    role='button'
                                    onClick={() => formik.values.eyes === item.value ? formik.setFieldValue("eyes", '') : formik.setFieldValue("eyes", item.value)}
                                />
                                <div className='h5 text-center'>{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </WizardItem>

            <WizardItem id='step4' title='Couleur des cheveux'>
                <div className='h1 mx-auto my-5 pb-5'>
                    Choisir la couleur des cheveux
                </div>
                <div className='row g-5 justify-content-center my-auto'>
                    {options.hair.map(item => (
                        <div className='col-auto'>
                            <div className='d-flex flex-column align-items-center mx-2' style={{maxWidth: '130px'}}>
                                <Avatar
                                    src={item.asset}
                                    size={120}
                                    border={4}
                                    className='mb-3'
                                    borderColor={formik.values.hair === item.value ? 'primary' : 'light'}
                                    role='button'
                                    onClick={() => formik.values.hair === item.value ? formik.setFieldValue("hair", '') : formik.setFieldValue("hair", item.value)}
                                />
                                <div className='h5 text-center'>{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </WizardItem>

            <WizardItem id='step5' title='Longueur des cheveux'>
                <div className='h1 mx-auto my-5 pb-5'>
                    Choisir la longueur des cheveux
                </div>
                <div className='row g-5 justify-content-center my-auto'>
                    {options.hairstyle.map(item => (
                        <div className='col-auto'>
                            <div className='d-flex flex-column align-items-center mx-2' style={{maxWidth: '130px'}}>
                                <Avatar
                                    src={item.asset}
                                    size={120}
                                    border={4}
                                    className='mb-3'
                                    color='primary'
                                    borderColor={formik.values.hairstyle === item.value ? 'primary' : 'light'}
                                    role='button'
                                    onClick={() => formik.values.hairstyle === item.value ? formik.setFieldValue("hairstyle", '') : formik.setFieldValue("hairstyle", item.value)}
                                />
                                <div className='h5 text-center'>{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </WizardItem>

            <WizardItem id='step6' title="Choix de l'avatar">
                <div className='h1 mx-auto my-5 pb-5'>
                    Choix de l'avatar
                </div>

                <div className="row d-flex align-items-center justify-content-center">
                    <div className='row col-lg-9 col-11 row-cols-xl-2 row-cols-1 my-5 gy-5'>
                        {avatars.filter(avatar => {
                            return avatar.attributes.name.includes(
                                `${formik.values.skin}-${formik.values.eyes}-${formik.values.hair}-${formik.values.hairstyle}-${formik.values.sex}`
                            )
                        }).map(avatar => (
                            <div className='col mx-auto d-flex flex-column align-items-center justify-content-center'>
                                <Card 
                                    className={classNames(
                                        'ms-lg-3 ms-auto me-auto ',
                                        'bg-l10-info bg-l25-info-hover transition-base',
                                        {
                                            'bg-l25-info': formik.values.avatar.id === avatar.id,
                                        },
                                    )}
                                    style={{width: '450px'}}
                                    role='button'
                                    onClick={() => formik.values.avatar.id === avatar.id ? formik.setFieldValue("avatar.id", '') : formik.setFieldValue("avatar.id", avatar.id)}
                                >
                                    <CardBody className='p-0 d-flex justify-content-center'>
                                        <img src={`${API_URL}${avatar?.attributes?.url}`} width={400} />
                                    </CardBody>
                                </Card>                                   
                            </div>
                        ))}
                    </div>
                </div>

            </WizardItem>
        </Wizard>
    );
}

CommonAvatarCreation.propTypes = {
    setIsOpen: PropTypes.func.isRequired,
};
CommonAvatarCreation.defaultProps = {
    setIsOpen: null,
};

export default CommonAvatarCreation;