import React from 'react';
import {
    Nav,
    Navbar,
    NavDropdown
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clear as chatClear } from '../../store/features/chat';
import { clear as loginClear } from '../../store/features/login';
import { clear as uploadClear } from '../../store/features/upload';
import { clear as userClear } from '../../store/features/user';


export const NavbarComponent = () => {
    let history = useHistory()
    let user = JSON.parse(localStorage.getItem("_Auth"));
    const dispatch = useDispatch()

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
        <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
            <Navbar.Brand href="/home">Final Project</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="/home">Trang Chủ</Nav.Link>
                    <Nav.Link href="/news">Thông Báo</Nav.Link>
                    {
                        user?.type === 1 ? (
                            <Nav.Link href="/users">Người dùng khoa phòng</Nav.Link>
                        ) : <React.Fragment />
                    }
                </Nav>
                <Nav onSelect={handleSelect} activeKey="0">
                    <NavDropdown title={user ? user.name : "USER"} id="nav-dropdown">
                        <NavDropdown.Item eventKey="1" bg='white'>Thông tin của tôi</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item eventKey="2" bg='white'>Đăng xuất</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}
