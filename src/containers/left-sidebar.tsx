"use client"

import { HiXMark,HiBookmarkSquare,HiChevronUp,HiArrowUpOnSquare } from "react-icons/hi2";
import Link from 'next/link';
import SidebarSubmenu from './sidebar-submenu';
import routes from '@/helper/sidebar-routes';
import { usePathname } from 'next/navigation'
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setPageTitle } from '@/components/common/headerSlice';
import { UserProfile } from '@/helper/types';
import { getUserInfo } from '@/components/common/userSlice';

interface LeftSidebarProps {}



function LeftSidebar(props: LeftSidebarProps) {
    const pathname = usePathname()
    const dispatch = useAppDispatch()

    const close = () => {
        const leftSidebarDrawer = document.getElementById('left-sidebar-drawer');
        if (leftSidebarDrawer) leftSidebarDrawer.click();
    };
    const user = useAppSelector((state) => state.user);


    useEffect(() => {
        console.log(pathname)
        let routeObj = routes.filter((r) => {return r.path == pathname})[0]
        if(routeObj){
            dispatch(setPageTitle({title : routeObj.pageTitle}))
        }else{
            const secondSlashIndex = pathname.indexOf('/', pathname.indexOf('/') + 1)
            if (secondSlashIndex !== -1) {
                const substringBeforeSecondSlash = pathname.substring(0, secondSlashIndex);
                let submenuRouteObj = routes.filter((r) => {return r.path == substringBeforeSecondSlash})[0]
                if(submenuRouteObj.submenu){
                    let submenuObj = submenuRouteObj.submenu.filter((r) => {return r.path == pathname})[0]
                    console.log("herere", submenuObj)
                    dispatch(setPageTitle({title : submenuObj.pageTitle}))
                    
                }
            }
        }
    }, [pathname])


    useEffect(() => {
        dispatch(getUserInfo())
    }, [])

    const logoutUser = async () => {
        console.log("here")
        localStorage.clear();
        window.location.href = '/'
      }

      


    return (
        <div className="drawer-side z-30 overflow-hidden">
            <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
            <ul className="menu pt-2 w-80 bg-base-100 min-h-full text-base-content">
                <button
                    className="btn btn-ghost bg-base-300 btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden"
                    onClick={close}
                >
                    <HiXMark className="h-5 inline-block w-5" />
                </button>

                <li className="mb-2 font-semibold text-xl">
                    <Link href="/welcome">
                        <img className="mask mask-squircle w-10" src="https://www.loliapi.com/acg/pp/" alt="Ai-WebUi Logo" />
                        Ai-WebUi
                    </Link>
                </li>
                <div className="overflow-y-scroll pb-20 no-scrollbar" style={{ height: "85vh" }}>
                    {routes.map((route, k: number) => (
                        <li className="" key={k}>
                            {route.submenu ? (
                                <SidebarSubmenu {...route} />
                            ) : (
                                <Link
                                    href={route.path}
                                    className={`${pathname == route.path ? 'font-semibold bg-base-200 ' : 'font-normal'}`
                                    }
                                >
                                    {route.icon} {route.pageName}
                                    {pathname === route.path ? (
                                        <span
                                            className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                                            aria-hidden="true"
                                        ></span>
                                    ) : null}
                                </Link>
                            )}
                        </li>
                    ))}
                </div>
            </ul>
            {/* Profile icon, opening menu on click */}
            <div className="dropdown bottom-0 absolute dropdown-top w-80 ">
            <div tabIndex={0} role="button" className="btn w-full bg-base-100 text-left justify-start ">
                <div className="avatar">
                <div className="w-6 rounded-full">
                    <img src={user.avatar} />
                </div>
                </div>{user.name}<HiChevronUp className='w-4 ' /></div>
            <ul tabIndex={0} className="dropdown-content visible w-52 px-4 z-[1]  menu  shadow bg-base-200 rounded-box ">
                <li className=""><Link href={'/settings/billing'}><HiBookmarkSquare className='w-4 ' />Bill History</Link></li>
                <div className="divider py-2 m-0"></div>
                <li onClick={() => logoutUser()}><a className=' ' ><HiArrowUpOnSquare className='w-4 ' />Logout</a></li>
            </ul>
            </div>
        </div>
    );
}

export default LeftSidebar;
