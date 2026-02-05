import { jsx as _jsx } from "react/jsx-runtime";
import { useRoutes } from 'react-router-dom';
import { NotFound } from './components/NotFound.js';
import { ActiveTransactionsPage } from './pages/ActiveTransactionsPage/ActiveTransactionsPage.js';
import { LanguagesPage } from './pages/LanguagesPage.js';
import { MainPage } from './pages/MainPage/MainPage.js';
import { RoutesPage } from './pages/RoutesPage/RoutesPage.js';
import { SelectChainPage } from './pages/SelectChainPage/SelectChainPage.js';
import { SelectEnabledToolsPage } from './pages/SelectEnabledToolsPage.js';
import { SelectTokenPage } from './pages/SelectTokenPage/SelectTokenPage.js';
import { BookmarksPage } from './pages/SendToWallet/BookmarksPage.js';
import { ConnectedWalletsPage } from './pages/SendToWallet/ConnectedWalletsPage.js';
import { RecentWalletsPage } from './pages/SendToWallet/RecentWalletsPage.js';
import { SendToConfiguredWalletPage } from './pages/SendToWallet/SendToConfiguredWalletPage.js';
import { SendToWalletPage } from './pages/SendToWallet/SendToWalletPage.js';
import { SettingsPage } from './pages/SettingsPage/SettingsPage.js';
import { TransactionDetailsPage } from './pages/TransactionDetailsPage/TransactionDetailsPage.js';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage/TransactionHistoryPage.js';
import { TransactionPage } from './pages/TransactionPage/TransactionPage.js';
import { navigationRoutes } from './utils/navigationRoutes.js';
const routes = [
    {
        path: '/',
        element: _jsx(MainPage, {}),
    },
    {
        path: navigationRoutes.settings,
        element: _jsx(SettingsPage, {}),
    },
    {
        path: `${navigationRoutes.settings}/${navigationRoutes.bridges}`,
        element: _jsx(SelectEnabledToolsPage, { type: "Bridges" }),
    },
    {
        path: `${navigationRoutes.settings}/${navigationRoutes.exchanges}`,
        element: _jsx(SelectEnabledToolsPage, { type: "Exchanges" }),
    },
    {
        path: `${navigationRoutes.settings}/${navigationRoutes.languages}`,
        element: _jsx(LanguagesPage, {}),
    },
    {
        path: navigationRoutes.fromToken,
        element: _jsx(SelectTokenPage, { formType: "from" }),
    },
    {
        path: navigationRoutes.toToken,
        element: _jsx(SelectTokenPage, { formType: "to" }),
    },
    {
        path: navigationRoutes.toTokenNative,
        element: _jsx(SelectChainPage, { formType: "to", selectNativeToken: true }),
    },
    {
        path: `${navigationRoutes.fromToken}?/${navigationRoutes.fromChain}`,
        element: _jsx(SelectChainPage, { formType: "from" }),
    },
    {
        path: `${navigationRoutes.toToken}?/${navigationRoutes.toChain}`,
        element: _jsx(SelectChainPage, { formType: "to" }),
    },
    {
        path: navigationRoutes.routes,
        element: _jsx(RoutesPage, {}),
    },
    {
        path: navigationRoutes.activeTransactions,
        element: _jsx(ActiveTransactionsPage, {}),
    },
    {
        path: navigationRoutes.sendToWallet,
        element: _jsx(SendToWalletPage, {}),
    },
    {
        path: `${navigationRoutes.sendToWallet}/${navigationRoutes.bookmarks}`,
        element: _jsx(BookmarksPage, {}),
    },
    {
        path: `${navigationRoutes.sendToWallet}/${navigationRoutes.recentWallets}`,
        element: _jsx(RecentWalletsPage, {}),
    },
    {
        path: `${navigationRoutes.sendToWallet}/${navigationRoutes.connectedWallets}`,
        element: _jsx(ConnectedWalletsPage, {}),
    },
    {
        path: navigationRoutes.configuredWallets,
        element: _jsx(SendToConfiguredWalletPage, {}),
    },
    {
        path: navigationRoutes.transactionHistory,
        element: _jsx(TransactionHistoryPage, {}),
    },
    {
        path: `${navigationRoutes.transactionHistory}?/${navigationRoutes.routes}?/${navigationRoutes.transactionExecution}?/${navigationRoutes.transactionDetails}`,
        element: _jsx(TransactionDetailsPage, {}),
    },
    {
        path: `${navigationRoutes.routes}?/${navigationRoutes.activeTransactions}?/${navigationRoutes.transactionExecution}`,
        element: _jsx(TransactionPage, {}),
    },
    {
        path: '*',
        element: _jsx(NotFound, {}),
    },
];
export const AppRoutes = () => {
    const element = useRoutes(routes);
    return element;
};
//# sourceMappingURL=AppRoutes.js.map