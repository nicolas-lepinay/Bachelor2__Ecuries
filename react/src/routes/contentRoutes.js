import React, { lazy } from 'react';
import { 
    componentsMenu, 
    dashboardMenu, 
    demoPages, 
    layoutMenu, 
    landingPage,
    profilePage,
    adminMenu, 
    professionalMenu,
    clientMenu,
    loginPage, 
    logoutPage,
    queryPages,
    clientQueryPages
} from '../menu';
// import Login from '../pages/presentation/auth/Login';
import Login from '../pages/auth/Login';
import Logout from '../pages/auth/Logout';

const PROFILE_PAGE = lazy(() => import('../pages/ProfilePage'));

const LANDING = {
	// DASHBOARD: lazy(() => import('../pages/dashboard/DashboardPage')),
    DASHBOARD: lazy(() => import('../pages/ProfilePage')),
	DASHBOARD_BOOKING: lazy(() => import('../pages/dashboard/DashboardBookingPage')),
};
const SINGLE = {
	BOXED: lazy(() => import('../pages/presentation/single-pages/SingleBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/single-pages/SingleFluidPage')),
};
const LIST = {
	BOXED: lazy(() => import('../pages/presentation/demo-pages/ListBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/demo-pages/ListFluidPage')),
};
const GRID = {
	BOXED: lazy(() => import('../pages/presentation/demo-pages/GridBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/demo-pages/GridFluidPage')),
};
const EDIT = {
	BOXED: lazy(() => import('../pages/presentation/demo-pages/EditBoxedPage')),
	FLUID: lazy(() => import('../pages/presentation/demo-pages/EditFluidPage')),
	WIZARD: lazy(() => import('../pages/presentation/demo-pages/EditWizardPage')),
	IN_CANVAS: lazy(() => import('../pages/presentation/demo-pages/EditInCanvasPage')),
	IN_MODAL: lazy(() => import('../pages/presentation/demo-pages/EditInModalPage')),
};
const PRICING = {
	PRICING_TABLE: lazy(() => import('../pages/presentation/pricing/PricingTablePage')),
};

const AUTH = {
	PAGE_404: lazy(() => import('../pages/presentation/auth/Page404')),
};
const APP = {
	PROJECT_MANAGEMENT: {
		PROJECTS_LIST: lazy(() =>
			import('../pages/presentation/project-management/ProjectManagementsList'),
		),
		PROJECT: lazy(() =>
			import('../pages/presentation/project-management/ProjectManagementsProject'),
		),
	},
	KNOWLEDGE: {
		GRID: lazy(() => import('../pages/presentation/knowledge/KnowledgeGridPage')),
		VIEW: lazy(() => import('../pages/presentation/knowledge/KnowledgeViewPage')),
	},
	SALES: {
		TRANSACTIONS: lazy(() => import('../pages/presentation/sales/TransActionsPage')),
		PRODUCTS: lazy(() => import('../pages/presentation/sales/SalesListPage')),
		PRODUCTS_GRID: lazy(() => import('../pages/presentation/sales/ProductsGridPage')),
		PRODUCTS_VIEW: lazy(() => import('../pages/presentation/sales/ProductViewPage')),
	},
	APPOINTMENT: {
		CALENDAR: lazy(() => import('../pages/presentation/appointment/CalendarPage')),
		EMPLOYEE_LIST: lazy(() => import('../pages/presentation/appointment/EmployeeList')),
		EMPLOYEE_VIEW: lazy(() => import('../pages/presentation/appointment/EmployeePage')),
		APPOINTMENT_LIST: lazy(() => import('../pages/presentation/appointment/AppointmentList')),
	},
	CRM: {
		CRM_DASHBOARD: lazy(() => import('../pages/presentation/crm/CrmDashboard')),
		CUSTOMERS: lazy(() => import('../pages/presentation/crm/CustomersList')),
		CUSTOMER: lazy(() => import('../pages/presentation/crm/Customer')),
		SALES: lazy(() => import('../pages/presentation/crm/Sales')),
		INVOICE: lazy(() => import('../pages/presentation/crm/Invoice')),
	},
	CHAT: {
		WITH_LIST: lazy(() => import('../pages/presentation/chat/WithListChatPage')),
		ONLY_LIST: lazy(() => import('../pages/presentation/chat/OnlyListChatPage')),
	},
};
const PAGE_LAYOUTS = {
	HEADER_SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/HeaderAndSubheader')),
	HEADER: lazy(() => import('../pages/presentation/page-layouts/OnlyHeader')),
	SUBHEADER: lazy(() => import('../pages/presentation/page-layouts/OnlySubheader')),
	CONTENT: lazy(() => import('../pages/presentation/page-layouts/OnlyContent')),
	BLANK: lazy(() => import('../pages/presentation/page-layouts/Blank')),
	ASIDE: lazy(() => import('../pages/presentation/aside-types/DefaultAsidePage')),
	MINIMIZE_ASIDE: lazy(() => import('../pages/presentation/aside-types/MinimizeAsidePage')),
};

const CONTENT = {
	CONTENTS: lazy(() => import('../pages/documentation/content/ContentListPage')),
	TYPOGRAPHY: lazy(() => import('../pages/documentation/content/TypographyPage')),
	IMAGES: lazy(() => import('../pages/documentation/content/ImagesPage')),
	TABLES: lazy(() => import('../pages/documentation/content/TablesPage')),
	FIGURES: lazy(() => import('../pages/documentation/content/FiguresPage')),
};
const FORMS_PAGE = {
	FORMS: lazy(() => import('../pages/documentation/forms/FormsListPage')),
	FORM_GROUP: lazy(() => import('../pages/documentation/forms/FormGroupPage')),
	FORM_CONTROLS: lazy(() => import('../pages/documentation/forms/FormControlsPage')),
	SELECT: lazy(() => import('../pages/documentation/forms/SelectPage')),
	CHECKS_AND_RADIO: lazy(() => import('../pages/documentation/forms/ChecksAndRadioPage')),
	RANGE: lazy(() => import('../pages/documentation/forms/RangePage')),
	INPUT_GROUP: lazy(() => import('../pages/documentation/forms/InputGroupPage')),
	VALIDATION: lazy(() => import('../pages/documentation/forms/ValidationPage')),
	WIZARD: lazy(() => import('../pages/documentation/forms/WizardPage')),
};
const COMPONENTS_PAGE = {
	COMPONENTS: lazy(() => import('../pages/documentation/components/ComponentsListPage')),
	ACCORDION: lazy(() => import('../pages/documentation/components/AccordionPage')),
	ALERT: lazy(() => import('../pages/documentation/components/AlertPage')),
	BADGE: lazy(() => import('../pages/documentation/components/BadgePage')),
	BREADCRUMB: lazy(() => import('../pages/documentation/components/BreadcrumbPage')),
	BUTTON: lazy(() => import('../pages/documentation/components/ButtonPage')),
	BUTTON_GROUP: lazy(() => import('../pages/documentation/components/ButtonGroupPage')),
	CARD: lazy(() => import('../pages/documentation/components/CardPage')),
	CAROUSEL: lazy(() => import('../pages/documentation/components/CarouselPage')),
	COLLAPSE: lazy(() => import('../pages/documentation/components/CollapsePage')),
	DROPDOWN: lazy(() => import('../pages/documentation/components/DropdownsPage')),
	LIST_GROUP: lazy(() => import('../pages/documentation/components/ListGroupPage')),
	MODAL: lazy(() => import('../pages/documentation/components/ModalPage')),
	NAVS_TABS: lazy(() => import('../pages/documentation/components/NavsTabsPage')),
	OFF_CANVAS: lazy(() => import('../pages/documentation/components/OffCanvasPage')),
	PAGINATION: lazy(() => import('../pages/documentation/components/PaginationPage')),
	POPOVERS: lazy(() => import('../pages/documentation/components/PopoversPage')),
	PROGRESS: lazy(() => import('../pages/documentation/components/ProgressPage')),
	SCROLLSPY: lazy(() => import('../pages/documentation/components/ScrollspyPage')),
	SPINNER: lazy(() => import('../pages/documentation/components/SpinnersPage')),
	TABLE: lazy(() => import('../pages/documentation/components/TablePage')),
	TOASTS: lazy(() => import('../pages/documentation/components/ToastsPage')),
	TOOLTIP: lazy(() => import('../pages/documentation/components/TooltipPage')),
};
const UTILITIES = {
	UTILITIES: lazy(() => import('../pages/documentation/utilities/UtilitiesListPage')),
	API: lazy(() => import('../pages/documentation/utilities/ApiPage')),
	BACKGROUND: lazy(() => import('../pages/documentation/utilities/BackgroundPage')),
	BORDERS: lazy(() => import('../pages/documentation/utilities/BordersPage')),
	COLORS: lazy(() => import('../pages/documentation/utilities/ColorsPage')),
	DISPLAY: lazy(() => import('../pages/documentation/utilities/DisplayPage')),
	FLEX: lazy(() => import('../pages/documentation/utilities/FlexPage')),
	FLOAT: lazy(() => import('../pages/documentation/utilities/FloatPage')),
	INTERACTIONS: lazy(() => import('../pages/documentation/utilities/InteractionsPage')),
	OVERFLOW: lazy(() => import('../pages/documentation/utilities/OverflowPage')),
	POSITION: lazy(() => import('../pages/documentation/utilities/PositionPage')),
	SHADOWS: lazy(() => import('../pages/documentation/utilities/ShadowsPage')),
	SIZING: lazy(() => import('../pages/documentation/utilities/SizingPage')),
	SPACING: lazy(() => import('../pages/documentation/utilities/SpacingPage')),
	TEXT: lazy(() => import('../pages/documentation/utilities/TextPage')),
	VERTICAL_ALIGN: lazy(() => import('../pages/documentation/utilities/VerticalAlignPage')),
	VISIBILITY: lazy(() => import('../pages/documentation/utilities/VisibilityPage')),
};
const ICONS = {
	ICONS_LIST: lazy(() => import('../pages/documentation/icons/IconsListPage')),
	ICON: lazy(() => import('../pages/documentation/icons/IconPage')),
	BOOTSTRAP: lazy(() => import('../pages/documentation/icons/BootstrapIconPage')),
	MATERIAL: lazy(() => import('../pages/documentation/icons/MaterialPage')),
};
const CHARTS_PAGE = {
	CHART_LIST: lazy(() => import('../pages/documentation/charts/ChartsListPage')),
	GENERAL_USAGE: lazy(() => import('../pages/documentation/charts/ChartGeneralUsagePage')),
	SPARKLINE: lazy(() => import('../pages/documentation/charts/ChartSparklinePage')),
	LINE: lazy(() => import('../pages/documentation/charts/ChartLinePage')),
	AREA: lazy(() => import('../pages/documentation/charts/ChartAreaPage')),
	COLUMN: lazy(() => import('../pages/documentation/charts/ChartColumnPage')),
	BAR: lazy(() => import('../pages/documentation/charts/ChartBarPage')),
	MIXED: lazy(() => import('../pages/documentation/charts/ChartMixedPage')),
	TIMELINE: lazy(() => import('../pages/documentation/charts/ChartTimelinePage')),
	CANDLESTICK: lazy(() => import('../pages/documentation/charts/ChartCandlestickPage')),
	BOX_WHISKER: lazy(() => import('../pages/documentation/charts/ChartBoxWhiskerPage')),
	PIE_DONUT: lazy(() => import('../pages/documentation/charts/ChartPieDonutPage')),
	RADAR: lazy(() => import('../pages/documentation/charts/ChartRadarPage')),
	POLAR: lazy(() => import('../pages/documentation/charts/ChartPolarPage')),
	RADIAL_BAR: lazy(() => import('../pages/documentation/charts/ChartRadialBarPage')),
	BUBBLE: lazy(() => import('../pages/documentation/charts/ChartBubblePage')),
	SCATTER: lazy(() => import('../pages/documentation/charts/ChartScatterPage')),
	HEAT_MAP: lazy(() => import('../pages/documentation/charts/ChartHeatMapPage')),
	TREE_MAP: lazy(() => import('../pages/documentation/charts/ChartTreeMapPage')),
};
const EXTRA = {
	NOTIFICATION: lazy(() => import('../pages/documentation/extras/NotificationPage')),
	HOOKS: lazy(() => import('../pages/documentation/extras/HooksPage')),
};

// --------- MY CUSTOM VERSION ---------

const HOME = {
	HOME_PAGE: lazy(() => import('../pages/HomePage')),
}

const PROFILE = {
	PROFILE_PAGE: lazy(() => import('../pages/ProfilePage')),
}

const DASHBOARDS = {
	DASHBOARD_BOOKING: lazy(() => import('../pages/dashboard/DashboardBookingPage')),
    DASHBOARD_ACTIVITY: lazy(() => import('../pages/dashboard/DashboardActivityPage')),
}

const ACCOUNTS = {
    HORSE_LIST: lazy(() => import('../pages/accounts/horses/HorseList')),
	HORSE_PAGE: lazy(() => import('../pages/accounts/horses/HorsePage')),
    EMPLOYEE_LIST: lazy(() => import('../pages/accounts/employees/EmployeeList')),
    EMPLOYEE_PAGE: lazy(() => import('../pages/accounts/employees/EmployeePage')),
	USER_LIST: lazy(() => import('../pages/accounts/users/UserList')),
	USER_PAGE: lazy(() => import('../pages/accounts/users/UserPage')),
}

const CHAT = {
    MESSENGER: lazy(() => import('../pages/chat/ChatPage_v2')),
}

const admin = [
    {
		path: adminMenu.accounts.accounts.subMenu.horses.path,
		element: <ACCOUNTS.HORSE_LIST />,
		exact: true,
	},
    {
        path: `${queryPages.horses.path}/:id`,
        element: <ACCOUNTS.HORSE_PAGE />,
        exact: true,
    },
    {
        path: adminMenu.accounts.accounts.subMenu.professionals.path,
		element: <ACCOUNTS.EMPLOYEE_LIST />,
		exact: true,
    },
    {
        path: `${queryPages.professionals.path}/:id`,
        element: <ACCOUNTS.EMPLOYEE_PAGE />,
        exact: true,
    },
    {
        path: adminMenu.accounts.accounts.subMenu.clients.path,
        element: <ACCOUNTS.USER_LIST />,
		exact: true,
    },
    {
        path: `${queryPages.users.path}/:id`,
        element: <ACCOUNTS.USER_PAGE />,
        exact: true,
    },
];

const professional = [
    {
		path: professionalMenu.accounts.accounts.subMenu.horses.path,
		element: <ACCOUNTS.HORSE_LIST />,
		exact: true,
	},
    {
        path: `${queryPages.horses.path}/:id`,
        element: <ACCOUNTS.HORSE_PAGE />,
        exact: true,
    },
    {
        path: professionalMenu.accounts.accounts.subMenu.professionals.path,
		element: <ACCOUNTS.EMPLOYEE_LIST />,
		exact: true,
    },
    {
        path: `${queryPages.professionals.path}/:id`,
        element: <ACCOUNTS.EMPLOYEE_PAGE />,
        exact: true,
    },
    {
        path: professionalMenu.accounts.accounts.subMenu.clients.path,
        element: <ACCOUNTS.USER_LIST />,
		exact: true,
    },
    {
        path: `${queryPages.users.path}/:id`,
        element: <ACCOUNTS.USER_PAGE />,
        exact: true,
    },
];

const client = [
    {
        path: clientMenu.accounts.accounts.subMenu.horses.path,
		element: <ACCOUNTS.HORSE_LIST />,
		exact: true,
    },
    {
        path: `${clientQueryPages.horses.path}/:id`,
        element: <ACCOUNTS.HORSE_PAGE />,
        exact: true,
    },
    {
        path: clientMenu.accounts.accounts.subMenu.professionals.path,
		element: <ACCOUNTS.EMPLOYEE_LIST />,
		exact: true,
    },
    {
        path: `${clientQueryPages.professionals.path}/:id`,
        element: <ACCOUNTS.EMPLOYEE_PAGE />,
        exact: true,
    },
];

const common = [
    {
        path: landingPage.landing.path,
		element: <HOME.HOME_PAGE />,
		exact: true,
    },
    {
        path: profilePage.profile.path,
		element: <PROFILE.PROFILE_PAGE />,
		exact: true,
    },
	{
		path: clientMenu.dashboards.dashboards.subMenu.dashboardActivity.path,
		element: <DASHBOARDS.DASHBOARD_ACTIVITY />,
		exact: true,
	},
    {
		path: clientMenu.dashboards.dashboards.subMenu.dashboardBooking.path,
		element: <DASHBOARDS.DASHBOARD_BOOKING />,
		exact: true,
	},
    {
		path: clientMenu.chat.messenger.path,
		element: <CHAT.MESSENGER />,
		exact: true,
	},
];

const auth = [
    {
        path: loginPage.login.path,
        element: <Login />,
        exact: true,
    },
    {
        path: logoutPage.logout.path,
        element: <Logout />,
        exact: true,
    }
];

const contents = { admin, professional, client, common, auth };

export default contents;

