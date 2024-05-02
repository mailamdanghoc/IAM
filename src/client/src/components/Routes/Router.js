import { useRoutes } from "react-router-dom";

//begin UserLayout layout
import UserLayout from "../Layout/UserLayout";
import Login from "../../views/user/Login";
import SignUp from "../../views/user/Signup"
import Info from "../../views/user/Info";
import AddRoleForm from "../../views/user/AddRoleForm";
import DeleteRoleForm from "../../views/user/DeleteRoleForm";


import PeopleInGroup from "../../views/user/PeopleInGroup";

// import MyGroup from "../../views/user/MyGroup"
// import Pending from "../../views/admin/Pending"
import RequestManagement from "../../views/admin/RequestManagement";
import GroupManagement from "../../views/admin/GroupManagement";
import UserProfile from "../../views/admin/UserProfile";
import AddRoleForUSer from "../../views/admin/AddUserToGroup";
import RemoveUserFromGroup from "../../views/admin/RemoveUserFromGroup";
//end UserLayout layout


//begin error layout
// import ErrorLayout from "../Layout/ErrorLayout";
// import Error401 from "../../views/Error/401";
// import Error403 from "../../views/Error/403";
// import Error404 from "../../views/Error/404";

//end erro layout

export default function Router() {
  const routes = useRoutes([
    {
      element: <UserLayout/>,
      children: [
        {element: <Login />, index:true,},
        {path: 'login', element: <Login/>},
        {path: 'signup', element: <SignUp/>},
        {path: 'profile', element: <Info/>},
        {path: 'profile/request-role', element: <AddRoleForm/>},
        {path: 'profile/delete-role', element: <DeleteRoleForm/>},
        {path: 'resources', element: <PeopleInGroup/>},
        {path: 'admin/', element: <Info/>},
        {path: 'admin/profile', element: <Info/>},
        {path: 'admin/manage-users', element: <RequestManagement/>},
        {path: 'admin/manage-requests', element: <RequestManagement/>},
        {path: 'admin/manage-groups', element: <GroupManagement/>},
        {path: 'admin/manage-groups/detail/:uid', element: <UserProfile/>},
        {path: 'admin/manage-groups/detail/:uid/request-role', element: <AddRoleForUSer/>},
        {path: '/admin/manage-groups/detail/:uid/delete-role', element: <RemoveUserFromGroup/>},
        {path: 'admin/log', element: <RequestManagement/>},

      ]
    },
    // {
    //   element: <ErrorLayout/>,
    //   children: [
    //     {path: "401",element: <Error401/>},
    //     {path: "404", element: <Error404/>},
    //     {path: "403", element: <Error403/>},
    //   ]
    // }
  ]);
  return routes;
}