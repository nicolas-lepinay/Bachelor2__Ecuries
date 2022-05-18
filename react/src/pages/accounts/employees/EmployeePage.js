import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
import { useFormik } from 'formik';
import classNames from 'classnames';
import CircularProgress from '@mui/material/CircularProgress';

import { getUserDataWithId } from '../../../common/data/userDummyData';

// 🛠️ Hooks :
import useAuth from '../../../hooks/useAuth';
import useFetchClients from '../../../hooks/useFetchClients';
import useSortableData from '../../../hooks/useSortableData';
import useDarkMode from '../../../hooks/useDarkMode';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import SubHeader, {
    SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';

import Spinner from '../../../components/bootstrap/Spinner'
import Button from '../../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../../components/bootstrap/Card';

import Popovers from '../../../components/bootstrap/Popovers';

import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import InputGroup, { InputGroupText } from '../../../components/bootstrap/forms/InputGroup';
import Select from '../../../components/bootstrap/forms/Select';
import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import showNotification from '../../../components/extras/showNotification';

import Avatar from '../../../components/Avatar';
import defaultHorseAvatar from '../../../assets/img/horse-avatars/defaultHorseAvatar.webp';
import defaultAvatar from '../../../assets/img/wanna/defaultAvatar.webp';

import { adminMenu, queryPages } from '../../../menu';
import Badge from '../../../components/bootstrap/Badge';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../../components/PaginationButtons';

import EVENT_STATUS from '../../../common/data/enumEventStatus';

import axios from 'axios';

function EmployeePage() {

    const { id } = useParams();

    return (
        <h1>Employee Page n°{id}</h1>
    )
}

export default EmployeePage