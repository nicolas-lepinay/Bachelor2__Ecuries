import { useState, useEffect } from 'react';
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
import useFetchHorseAvatars from '../../hooks/useFetchHorseAvatars';
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
import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';
import defaultHorseAvatar from '../../assets/img/horse-avatars/defaultHorseAvatar.webp';

// 🅰️ Axios :
import axios from 'axios';

const PreviewItem = ({ title, value }) => {
	return (
		<div className='row'>
			<div className='col-4 text-end'>{title}</div>
			<div className='col-8 text-start fw-bold'>{value || '-'}</div>
		</div>
	);
};

const PreviewImageItem = ({ title, src }) => {
	return (
		<div className='row d-flex align-items-center my-3'>
			<div className='col-4 text-end'>
                {title}
            </div>

			<div className='col-8 text-start'>
                <img src={src} width={50} />
            </div>
		</div>
	);
};

const PreviewAvatarItem = ({ title, src, color }) => {
    const { themeStatus } = useDarkMode();

	return (
		<div className='row d-flex align-items-center my-3'>
			<div className='col-4 text-end'>
                {title}
            </div>

			<div className='col-8 text-start'>
                <Avatar
                    src={src}
                    color={color}
                    size={54}
                    border={3}
                />
            </div>
		</div>
	);
};

const CommonHorseCreation = ({ isAdmin, setIsOpen, setHorses }) => {

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

    // 🧑‍🤝‍🧑 Fetch clients :
    const { data: clients } = useFetchClients();

    // 🐎 Fetch list of breeds and images :
    const { data: breeds } = useFetchBreeds();

    // 🐴 Fetch horse avatars :
    const { data: horseAvatars } = useFetchHorseAvatars();

    // Horse's owner (on last WizardItem) :
    const [selectedOwner, setSelectedOwner] = useState(null);

    // Horse's coat image :
    const [imageURL, setImageURL] = useState('');

    // Horse's avatar :
    const [avatarURL, setAvatarURL] = useState('');

    const [carouselIndex, setCarouselIndex] = useState(0);

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

    const formik = useFormik({
		initialValues: {
			name: ``,
            owner: isAdmin ? null : auth.user,
			sex: '',
            age: '',
			breed: '',
            image: {
                id: '',
            },
            avatar: {
                id: '',
            },
            color: 'info',
            breedId: '', // To delete on submission
		},
		onSubmit: (values) => {
            // Delete empty fields :
            for (const key in values) {
                if (values[key] === '') {
                  delete values[key];
                }
            }
            values.image.id === '' && delete values.image
            values.avatar.id === '' && delete values.avatar

            // Delete breedId:
            delete values.breedId;

            // Return if no owner:
            if(values?.owner?.id === '' || values?.owner?.id == null)
                return

            // Only keep user's id :
            values.owner = { id: values.owner.id }

            // Create horse :
            handlePost(values);
		}
	});

    const handlePost = async (newData) => {
        try {
            const filters = '?populate=owner.avatar&populate=owner.role&populate=avatar&populate=image&populate=health_record.employee.avatar&populate=appointments.employee.avatar&populate=activities';
            const res = await axios.post(`${API_URL}${HORSES_ROUTE}${filters}`, { data: newData });
            const resData = res.data.data;

            // Close modal :
            setIsOpen(false);

            // Callback (add new horse to horses list) :
            setHorses && setHorses(old => [ ...old, { id: resData.id, ...resData.attributes } ])

            // Success :
            showNotification(
                'Nouveau cheval', // title
				`Le profil ${resData?.attributes?.name} a été créé.`, // message
                'success' // type
			);
        } catch(err) {
            console.log("POST | Horse | Le cheval n'a pas pu être créé dans la base de données. | " + err);
            showNotification(
                'Nouveau cheval', // title
				"Oops ! Une erreur s'est produite. Le cheval n'a pas pu être ajouté à la base de données.", // message
                'danger' // type
			);
        }
    }

    useEffect(() => {
        if(horseAvatars) {
            formik.setValues({
                ...formik.values,
                avatar: {
                    id: horseAvatars[carouselIndex]?.id,
                },
            });
        }
    
    return () => {};
    }, [horseAvatars, carouselIndex]);


    useEffect( () => {
        setAvatarURL('');
        horseAvatars.filter(avatar => (avatar.id === formik.values.avatar.id) && setAvatarURL(avatar.attributes.url))

        return () => {};
    }, [formik.values.avatar.id])

    return (
        <Wizard
            //isHeader
            stretch
            color='primary'
            noValidate
            disabled={formik.values.name === '' || !formik.values.owner}
            onSubmit={formik.handleSubmit}
            className='shadow-none'>
            <WizardItem id='step1' title={isAdmin ? 'Nom et propriétaire' : 'Nom'}>
                <div className='row g-4'>
                    <div className='h1 mx-auto my-5 py-5'>
                        {isAdmin ? 'Quel est le nom et le propriétaire du cheval ?' : 'Quel est le nom de votre cheval ?'}
                    </div>
                    <div className='col-xl-3 col-lg-5 col-md-7 col-12 mx-auto my-5'>
                        <FormGroup
                            id='name'
                            label='Nom du cheval'
                            isFloating
                        >
                            <Input
                                size='lg'
                                value={capitalize(formik.values.name)}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </FormGroup>

                        {isAdmin &&
                        <FormGroup id='owner' className='my-5'>
                            <Select
                                id='owner'
                                name='owner'
                                placeholder='Choisissez un(e) propriétaire...'
                                onChange={ (e) => {
                                    const owner = { 
                                        id: e.target.value.split(';')[0], 
                                        name: e.target.value.split(';')[1], 
                                        surname: e.target.value.split(';')[2], 
                                    };
                                    setSelectedOwner(owner)
                                    formik.setFieldValue("owner", owner)
                                }}
                            >
                                {clients.map( user => (
                                    <Option
                                        key={user.username}
                                        //value={user.id}
                                        value={`${user.id};${user.name};${user.surname}`}
                                    >
                                        {`${user.name} ${user.surname} ${!user.confirmed ? '(en attente de confirmation)' : ''}`}
                                    </Option>
                                ))}
                            </Select>
                        </FormGroup>}
                    </div>
                </div>
            </WizardItem>

            <WizardItem id='step2' title='Sexe'>
                <div className='row g-4'>
                    <div className='h1 mx-auto my-5 py-5'>Quel est le sexe de <span className='font-family-playfair fw-bold'>{formik.values.name}</span> ?</div>
                    <div className='d-flex align-items-center justify-content-center my-5'>
                        <Button 
                            color='info' 
                            icon='Male' 
                            size='lg'
                            className='mx-5 px-4'
                            isLight
                            isActive={formik.values.sex === 'male'}
                            onClick={() => formik.setFieldValue('sex', 'male')}
                        >
                            Mâle
                        </Button>

                        <Button 
                            color='secondary' 
                            icon='Female' 
                            size='lg'
                            className='mx-5'
                            isLight
                            isActive={formik.values.sex === 'female'}
                            onClick={() => formik.setFieldValue('sex', 'female')}
                        >
                            Femelle
                        </Button>
                    </div>
                    <div className='d-flex align-items-center justify-content-center my-3'>
                        <Button 
                            color='light' 
                            icon='Help' 
                            size='md'
                            className='mx-5'
                            isLight
                            onClick={() => formik.setFieldValue('sex', '')}
                        >
                            Ne pas ajouter cette information
                        </Button>
                    </div>
                </div>
            </WizardItem>

            <WizardItem id='step3' title='Âge'>
                <div className='row g-4'>
                    <div className='h1 mx-auto my-5 py-5'>
                        Quel âge <span className='font-family-playfair fw-bold'>{formik.values.name}</span> a-t-{formik.values.sex === 'female' ? 'elle' : 'il'} ?
                    </div>
                    <div className='col-xl-3 col-lg-5 col-md-7 col-12 mx-auto my-5'>
                        <InputGroup>
                            <InputGroupText>Âge</InputGroupText>
                            <Input
                                id='age'
                                //placeholder='Âge (en années)'
                                type='Number'
                                min={0}
                                max={50}
                                size='md'
                                onChange={formik.handleChange}
                                //value={formik.values.age}
                                value={formik.values.age === 0 ? '' : formik.values.age}
                                placeholder={formik.values.age === 0 ? "Moins d'un an" : 'Âge en années'}
                            />
                        </InputGroup>
                    </div>
                    <div className='d-flex align-items-center justify-content-center my-3'>
                        <Button 
                            color='light' 
                            icon='Help' 
                            size='md'
                            className='mx-5'
                            isLight
                            onClick={() => formik.setFieldValue('age', '')}
                        >
                            Ne pas ajouter cette information
                        </Button>
                    </div>
                </div>
            </WizardItem>

            <WizardItem id='step4' title='Race'>
                <div className='row g-4'>
                    <div className='h1 mx-auto my-5 py-5'>
                        Quelle est la race de <span className='font-family-playfair fw-bold'>{formik.values.name}</span> ?
                    </div>
                    <div className="col-xl-3 col-lg-5 col-md-7 col-12 mx-auto my-5">
                        <InputGroup>
                            <InputGroupText>Race</InputGroupText>
                            <Input
                                id='breed'
                                size='lg'
                                placeholder='Race du cheval'
                                value={capitalize(formik.values.breed)}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                        </InputGroup>
                    </div>
                    <div className='d-flex align-items-center justify-content-center my-3'>
                        <Button 
                            color='light' 
                            icon='Help' 
                            size='md'
                            className='mx-5'
                            isLight
                            onClick={() => formik.setFieldValue('breed', '')}
                        >
                            Ne pas ajouter cette information
                        </Button>
                    </div>
                </div>
            </WizardItem>

            <WizardItem id='step5' title='Robe'>
            <div className='row g-4'>
                    <div className='h1 mx-auto my-5 pt-5'>
                        Choisir une robe pour <span className='font-family-playfair fw-bold'>{formik.values.name}</span>
                    </div>

                    <div className="col-12 mx-auto mb-5 d-flex flex-md-row flex-column align-items-center justify-content-center">
                        <FormGroup id='breedId' className='my-3'>
                            <Select
                                placeholder='Choisissez une race...'
                                value={formik.values.breedId}
                                onChange={formik.handleChange}
                                ariaLabel='Image select'
                            >
                                {breeds.map( breed => (
                                    <Option
                                        key={breed.name}
                                        value={breed.id}
                                    >
                                        {breed.name}
                                    </Option>
                                ))}
                            </Select>
                        </FormGroup>

                        <FormGroup id='image.id' className='my-3'>
                            <Button 
                                color='light' 
                                icon='Help' 
                                size='md'
                                className='mx-5'
                                isLight
                                //isActive={formik.values.image.id === ''}
                                onClick={() => {
                                    formik.setFieldValue('image.id', '');
                                    setImageURL('');
                                }}
                            >
                                Ne pas ajouter de robe
                            </Button>
                        </FormGroup>
                    </div>

                    <div className="row d-flex align-items-center justify-content-center">
                        <div className='row col-lg-9 col-11 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 my-5 gy-5'>
                            {breeds.filter(breed => Number(breed.id) === Number(formik.values.breedId)).map(breed => (
                                breed?.images?.data &&
                                breed.images.data.map(image => (
                                    <div className='col mx-auto d-flex flex-column align-items-center justify-content-center'>
                                        <img
                                            src={`${API_URL}${image?.attributes?.url}`}
                                            width={180}
                                        />

                                        <FormGroup id='image.id'>
                                            <Button 
                                                color='success' 
                                                icon='Check' 
                                                size='md'
                                                rounded='pill'
                                                className='my-3'
                                                isLight
                                                isActive={Number(formik.values.image.id) === Number(image.id)}
                                                onClick={() => {
                                                    formik.setFieldValue('image.id', image.id);
                                                    setImageURL(image?.attributes?.url);
                                                }}
                                            >
                                            </Button>
                                        </FormGroup>                                    
                                    </div>
                                ))
                            ))}
                        </div>
                    </div>

                </div>
            </WizardItem>

            <WizardItem id='step6' title='Avatar'>
                <div className='row g-4'>
                    <div className='h1 mx-auto my-5 pt-5'>
                        Choisir un avatar pour <span className='font-family-playfair fw-bold'>{formik.values.name}</span>
                    </div>

                    <div className='position-relative mx-auto' style={{margin: '60px 0', width: '250px'}} >

                        {/* SLIDER DES AVATARS */}
                        <Carousel
                            isKeyboardControl
                            isEnableTouch
                            isIndicators={false}
                            interval={false}
                            rounded={0}
                            height={250}
                            width={250}
                            isDark={!darkModeStatus}
                            customActiveIndex={carouselIndex}
                            setCustomActiveIndex={setCarouselIndex}
                            className={classNames(
                                `bg-l${darkModeStatus ? 'o' : ''}25-${formik.values.color}`,
                            )}
                        >
                            {horseAvatars.map(image => (
                                <CarouselSlide
                                    background={`${API_URL}${image?.attributes?.url}`}>
                                </CarouselSlide>
                            ))}
                        </Carousel>

                        {/* BOUTON DE NAVIGATION DU SLIDER */}
                        <div className='position-absolute top-0 end-0' style={{marginRight: '-50px', marginTop: '-15px'}}>
                            <Dropdown>
                                <DropdownToggle hasIcon={false}>
                                    <Button 
                                        color='light' 
                                        size='sm' 
                                    >
                                        {`${carouselIndex < 9 ? '0' : ''}${carouselIndex + 1} / ${horseAvatars.length}`}
                                    </Button>
                                </DropdownToggle>
                                <DropdownMenu>
                                <DropdownItem isHeader>Aller à...</DropdownItem>
                                    <DropdownItem>
                                        <Input
                                            placeholder='Numéro...'
                                            type='Number'
                                            min={1}
                                            max={horseAvatars.length}
                                            size='sm'
                                            onChange={(e) => (e.target.value >= 1 && e.target.value < horseAvatars.length + 1) && setCarouselIndex(e.target.value - 1)}
                                            defaultValue={carouselIndex + 1}
                                        />
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        {/* BOUTON DE CHOIX DE LA COULEUR */}
                        <div className='position-absolute bottom-0 start-0' style={{marginBottom: '-13px'}}>
                            <FormGroup 
                                id='color'
                            >
                                <Dropdown>
                                    <DropdownToggle hasIcon={false}>
                                        <Button color={formik.values.color} icon='Palette' size='sm'>Couleur</Button>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                    <DropdownItem isHeader>Couleur du profil</DropdownItem>
                                    {colorList.map(
                                        (color) => (
                                            <DropdownItem key={color.value} onClick={() => formik.setFieldValue('color', color.value)}>
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
                            </FormGroup>
                        </div>
                    </div>

                    <div className='d-flex align-items-center justify-content-center my-5'>
                        <Button 
                            color='light' 
                            icon='Help' 
                            size='md'
                            isLight
                            isActive={formik.values.avatar.id === ''}
                            onClick={() => formik.setFieldValue('avatar.id', '')}
                        >
                            Ne pas ajouter d'avatar
                        </Button>
                    </div>
                        
                </div>
            </WizardItem>

            <WizardItem id='step7' title='Résumé'>
                <div className='row g-3 my-4'>
                    <div className='col-xl-3 col-lg-5 col-md-7 col-11 mx-auto'>
                        <div className='col-8 offset-3'>
                            <h3 className='mb-5'>Résumé</h3>
                            <h4 className='mt-5 mb-4'>Propriétaire</h4>
                        </div>
                        <PreviewItem
                            title='Prénom'
                            value={formik.values?.owner?.name}
                        />
                        <PreviewItem
                            title='Nom'
                            value={formik.values?.owner?.surname}
                        />

                        <div className='col-8 offset-3'>
                            <h4 className='mt-5 mb-4'>Informations</h4>
                        </div>
                        <PreviewItem
                            title='Nom du cheval'
                            value={formik.values.name}
                        />
                        <PreviewItem
                            title='Sexe'
                            value={formik.values.sex === 'male' ? 'Mâle' : formik.values.sex === 'female' ? 'Femelle' : null}
                        />
                        <PreviewItem
                            title='Âge'
                            value={formik.values.age === 0 ? "Moins d'un an" : formik.values.age > 0 ? `${formik.values.age} ans` : null}
                        />
                        <PreviewItem
                            title='Race'
                            value={formik.values.breed}
                        />

                        <div className='col-8 offset-3'>
                            <h4 className='mt-5 mb-4'>Personnalisation</h4>
                        </div>

                        {formik.values.image.id === '' ?
                        <PreviewItem
                            title='Robe'
                            value={null}
                        />
                        :
                        <PreviewImageItem
                            title='Robe'
                            src={`${API_URL}${imageURL}`}
                        />
                        }

                        {formik.values.avatar.id === '' ?
                        <PreviewAvatarItem
                            title='Avatar (par défaut)'
                            src={defaultHorseAvatar}
                            color={formik.values.color}
                        />
                        :
                        <PreviewAvatarItem
                            title='Avatar'
                            src={`${API_URL}${avatarURL}`}
                            color={formik.values.color}
                        />
                        }
                        <PreviewItem
                            title='Couleur du profil'
                            value={colorList.filter(color => color.value === formik.values.color)[0].description}
                        />
                    </div>
                </div>
            </WizardItem>

        </Wizard>
    );
}

CommonHorseCreation.propTypes = {
	isAdmin: PropTypes.bool,
    setIsOpen: PropTypes.func.isRequired,
    setIsOpen: PropTypes.func,
};
CommonHorseCreation.defaultProps = {
	isAdmin: false,
    setIsOpen: null,
};

export default CommonHorseCreation;