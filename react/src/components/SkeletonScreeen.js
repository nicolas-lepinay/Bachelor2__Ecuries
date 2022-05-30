import Card, { CardBody } from '../components/bootstrap/Card';
import PageWrapper from '../layout/PageWrapper/PageWrapper';
import Page from '../layout/Page/Page';
import SubHeader from '../layout/SubHeader/SubHeader';

const SkeletonScreen = () => {
	return (
        <PageWrapper title='Chargement...'>
            <SubHeader>
                <div />
            </SubHeader>
            <Page>
                <div className='row h-100'>
                    <div className='col-lg-6'>
                        <Card stretch>
                            <CardBody>
                                <div />
                            </CardBody>
                        </Card>
                    </div>
                    <div className='col-lg-6'>
                        <Card stretch='semi'>
                            <CardBody>
                                <div />
                            </CardBody>
                        </Card>
                        <Card stretch='semi'>
                            <CardBody>
                                <div />
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </Page>
	    </PageWrapper>
	);
};

export default SkeletonScreen;
