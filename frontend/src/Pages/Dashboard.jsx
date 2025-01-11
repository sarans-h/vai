import React, { useState, useCallback, useEffect } from "react";
import Profile from './Profile.jsx';
import AddBusiness from './AddBusiness.jsx';
import MyBusiness from './MyBusiness.jsx';
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import {
    User,
    Plus,
    BriefcaseBusiness,
    Building2,
    Menu // Import Menu icon
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Dashboard = () => {
    const [activeComponent, setActiveComponent] = useState("Profile");
    const [open, setOpen] = useState(false);
    const [componentMap, setComponentMap] = useState({
        "Profile": Profile,
        "Buy Stock": AddBusiness,
        "My Stocks": MyBusiness,
  
    });

    const getIconColor = (componentName) => {
        return activeComponent === componentName ? "text-white" : "text-neutral-700 ";
    };

    const createIcon = (component) => {
        switch (component) {
            case "Profile":
                return <User className={`h-5 w-5 flex-shrink-0 ${getIconColor("Profile")}`} />;
            case "Buy Stock":
                return <Plus className={`h-5 w-5 flex-shrink-0 ${getIconColor("Buy Stock")}`} />;
            case "My Stocks":
                return <BriefcaseBusiness className={`h-5 w-5 flex-shrink-0 ${getIconColor("My Stocks")}`} />;
            default:
                return <Building2 className={`h-5 w-5 flex-shrink-0 ${getIconColor(component)}`} />;
        }
    };

    const loadLinksFromLocalStorage = () => {
        const storedLinks = localStorage.getItem("sidebarLinks");
        if (storedLinks) {
            const parsedLinks = JSON.parse(storedLinks);
            return parsedLinks.map(link => ({
                ...link,
                icon: createIcon(link.component)
            }));
        }
        return [
            {
                label: "Profile",
                href: "#",
                icon: createIcon("Profile"),
                component: "Profile",
            },
            {
                label: "Buy Stock",
                href: "#",
                icon: createIcon("Buy Stock"),
                component: "Buy Stock",
            },
            {
                label: "My Socks",
                href: "#",
                icon: createIcon("My Stocks"),
                component: "My Stocks",
            }
        ];
    };

    const [links, setLinks] = useState(loadLinksFromLocalStorage);

    useEffect(() => {
        const linksToStore = links.map(link => ({
            label: link.label,
            href: link.href,
            component: link.component,
            id: link.id,
        }));
        localStorage.setItem("sidebarLinks", JSON.stringify(linksToStore));
    }, [links]);

    useEffect(() => {
        setLinks(prevLinks => 
            prevLinks.map(link => ({
                ...link,
                icon: React.cloneElement(link.icon, {
                    className: `h-5 w-5 flex-shrink-0 ${getIconColor(link.component)}`
                })
            }))
        );
    }, [activeComponent]);

    const handleSetActiveComponent = useCallback((component) => {
        setActiveComponent(component);
        setOpen(false); // Close sidebar after selecting a link
    }, []);

    const renderComponent = useCallback(() => {
       
        const link = links.find((item) => item.component === activeComponent);
        const Component = componentMap[activeComponent];
        return Component ? (
            <Component
                setLinks={setLinks}
                getIconColor={getIconColor}
                setActiveComponent={setActiveComponent}
            />
        ) : (
            <Profile />
        );
    }, [activeComponent, links, componentMap]);

    return (
        <div className={cn("flex flex-col md:flex-row bg-gray-100 flex-1 w-full overflow-hidden", "h-[100vh]")}>
            {/* Hamburger menu for mobile */}
            {/* <div className="md:hidden flex items-center p-4 bg-black"> */}
                {/* <button onClick={() => setOpen(!open)}>
                    <Menu className="h-6 w-6 text-white" />
                </button> */}
            {/* </div> */}
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10 bg-black">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        <Logo />
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink
                                    key={idx}
                                    link={link}
                                    className={cn(
                                        "items-start",
                                        activeComponent === link.component ? "text-red-700" : ""
                                    )}
                                    onClick={() => handleSetActiveComponent(link.component)}
                                />
                            ))}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-col flex-1 ">{renderComponent()}</div>
        </div>
    );
}

export default Dashboard;

export const Logo = () => {
    return (
        <Link
            to="/"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6  bg-gradient-to-r from-pink-500 to-yellow-300   rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <p className="text-white  -left-[1.59rem] relative font-bold text-lg">V</p>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pl-2 font-medium text-white  whitespace-pre"

            >
                Vaishnavi
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            to="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            V
         
        </Link>
    );
};
