import { useState, useContext, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import moment from 'moment';
import classNames from 'classnames';
import { useMeasure } from 'react-use';

import ThemeContext from '../../contexts/themeContext';
import { capitalize } from '../../helpers/helpers';

// 🛠️ Hooks :
import useAuth from '../../hooks/useAuth';
import useFetchClients from '../../hooks/useFetchClients';
import useFetchBreeds from '../../hooks/useFetchBreeds';

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
import Avatar from '../../components/Avatar';
import defaultAvatar from '../../assets/img/wanna/defaultAvatar.webp';
import defaultHorseAvatar from '../../assets/img/horse-avatars/defaultHorseAvatar.webp';


const CommonHorseCreation = ({ isAdmin }) => {

    // ⚙️ Strapi's API URL
    const API_URL = process.env.REACT_APP_API_URL;

    // ⚙️ Role IDs
    const ADMIN_ID = process.env.REACT_APP_ADMIN_ID; // Id du rôle 'Admin'
    const PRO_ID = process.env.REACT_APP_PRO_ID; // Id du rôle 'Professionnel'
    const CLIENT_ID = process.env.REACT_APP_CLIENT_ID; // Id du rôle 'Client'

    // 🦸 User
    const auth = useAuth();

    // 🐎 Fetch user's horse(s) :
    const { 
        data: breeds, 
        setData: setBreeds } = useFetchBreeds();

    const formik = useFormik({
		initialValues: {
			name: ``,
			sex: '',
            age: '',
			owner: auth.user.id,
			breed: '',
            image: {
                id: '',
            },
            breedId: '',
		},
		onSubmit: (values) => {
            // Delete empty fields :
            for (const key in values) {
                if (values[key] === '' || !values[key]) {
                  delete values[key];
                }
            }
            // Update user :
            auth.updateUser(values);

            showNotification(
                'Mise à jour.', // title
				auth.error ? auth.error.message : 'Vos informations ont été mises à jour.', // message
                auth.error ? 'danger' : 'success' // type
			);
		},
	});

    return (
        <Wizard
            //isHeader
            stretch
            color='primary'
            noValidate
            disabled={formik.values.name === ''}
            //onSubmit={formik.handleSubmit}
            className='shadow-none'>
            <WizardItem id='step1' title='Nom'>
                <div className='row g-4'>
                    <div className='h1 mx-auto my-5 py-5'>
                        {isAdmin ? 'Quel est le nom du cheval ?' : 'Quel est le nom de votre cheval ?'}
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
                                onClick={() => formik.setFieldValue('image.id', '')}
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
                                                onClick={() => formik.setFieldValue('image.id', image.id)}
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
                </div>
            </WizardItem>

            <WizardItem id='step7' title='Résumé'>
            </WizardItem>


        </Wizard>
    );
}

export default CommonHorseCreation;