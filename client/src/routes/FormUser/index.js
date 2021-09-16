import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Form
} from 'react-bootstrap';
import Select from 'react-select'
import { useDispatch, useSelector } from 'react-redux';
import { NavbarComponent } from '../../components';
import { request as requestDepartment } from '../../store/features/department';
import { request as requestUser } from '../../store/features/user';
import Swal from 'sweetalert2';


export const FormUser = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [department, setDepartment] = useState([]);
    const [options, setOptions] = useState([]);
    const departmentReducer = useSelector(state => state.departmentReducer)

    // let history = useHistory()
    // let user = JSON.parse(localStorage.getItem("_Auth"));
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(requestDepartment())
    }, [dispatch])

    useEffect(() => {
        if (departmentReducer?.departmentData) {
            let dataSet = _.map(departmentReducer?.departmentData, (x) => {
                return {
                    value: x._id,
                    label: x.name
                }
            })
            setOptions(dataSet)
        }
    }, [departmentReducer?.departmentData])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (department.length === 0) {
            Swal.fire("Thiếu quản lý phòng/khoa")
            return;
        }
        dispatch(requestUser({ user_name: username, name: name, password: password, type: 2, list_department: department }))
        setDepartment('')
        setUsername('')
        setName('')
        setPassword('')
        setDepartment([])
    }

    const handleChangeSelect = (dataSelect) => {
        let dataCurrent = _.map(dataSelect, (x) => {
            return x.value;
        })
        setDepartment(dataCurrent)
    }
    return (
        <React.Fragment>
            <NavbarComponent />
            <div className="container mt-3 mb-3">
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicName">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control type="text" placeholder="Nhập tên" value={name} onChange={e => setName(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId="formBasicUsername">
                        <Form.Label>Tên tài khoản</Form.Label>
                        <Form.Control type="username" placeholder="Nhập tên tài khoản" value={username} onChange={e => setUsername(e.target.value)} required />
                    </Form.Group>


                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </Form.Group>

                    <Form.Group controlId="formCheckbox">
                        <Form.Label>Chọn phòng/khoa quản lý</Form.Label>
                        <Select isMulti options={options} onChange={handleChangeSelect} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </React.Fragment>
    )
}
