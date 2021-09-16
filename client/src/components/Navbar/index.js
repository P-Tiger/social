import React from 'react';
import {
    Nav,
    Navbar,
    NavDropdown
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { clear as chatClear } from '../../store/features/department';
import { clear as loginClear } from '../../store/features/login';
import { clear as uploadClear } from '../../store/features/upload';
import { clear as userClear } from '../../store/features/user';


export const NavbarComponent = () => {
    let history = useHistory()
    let user = JSON.parse(localStorage.getItem("_Auth"));
    const dispatch = useDispatch()
    const location = useLocation()

    const handleSelect = (eventKey) => {
        // Clear token
        if (+eventKey === 1) {
            history.push("/me")
        } else if (+eventKey === 2) {
            localStorage.removeItem("_Auth")
            history.push("/")
            dispatch(loginClear())
            dispatch(chatClear())
            dispatch(uploadClear())
            dispatch(userClear())
        }
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark" sticky="top" >
            <Navbar.Brand href="/home">Final Project</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" activeKey="/news">
                <Nav className="mr-auto" activeKey={location.pathname} >
                    <Nav.Link href="/home">Trang Chủ</Nav.Link>
                    <Nav.Link href="/news#">Thông Báo</Nav.Link>
                    {
                        user?.type === 1 ? (
                            <Nav.Link href="/users">Tạo tài khoản Phòng/Khoa</Nav.Link>
                        ) : <React.Fragment />
                    }
                </Nav>
                <Nav onSelect={handleSelect} className="mr-3">
                    <NavDropdown title={user ? user.name : "USER"} id="nav-dropdown">
                        {
                            user?.type !== 1 ? (
                                <NavDropdown.Item eventKey="1" bg='white'>Thông tin của tôi</NavDropdown.Item>
                            ) : <React.Fragment />
                        }
                        <NavDropdown.Divider />
                        <NavDropdown.Item eventKey="2" bg='white'>Đăng xuất</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
