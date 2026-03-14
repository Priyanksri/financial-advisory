import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-[#0a0a0f] flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto">{children}</main>
        </div>
    )
};

export default Layout;